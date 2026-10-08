import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EVIDENCE, FILES, TRAIL } from "./caseData";

const MODEL = "/models/on-my-desk.glb?v=1";
const ease = (t) => 1 - Math.pow(1 - t, 3);
const mix = (a, b, t) => a.clone().lerp(b, t);
const vector = (a) => new THREE.Vector3(...a);

function woodGrain(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader =
      `varying vec3 vDeskPosition;\n${shader.vertexShader}`.replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvDeskPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader =
      `varying vec3 vDeskPosition;\n${shader.fragmentShader}`.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
      float rings = sin(vDeskPosition.z * 37.0 + sin(vDeskPosition.x * 0.7) * 2.4 + sin(vDeskPosition.x * 2.1) * 0.6);
      float fine = sin(vDeskPosition.z * 160.0 + vDeskPosition.x * 4.0);
      diffuseColor.rgb *= 0.92 + rings * 0.09 + fine * 0.025;`,
      );
  };
  material.customProgramCacheKey = () => "desk-walnut-grain-v1";
}

export function createDeskScene(host, read, notify) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#101820");
  scene.fog = new THREE.FogExp2("#101820", 0.017);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  const canvas = renderer.domElement;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "A modeled 3D room with Shreyas’s portrait, a walnut desk, and interactive portfolio folders",
  );
  canvas.dataset.renderer = "three-webgl";
  canvas.dataset.model = MODEL;
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.3 : 1.7),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  host.append(canvas);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.06, 80);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.085;
  controls.minDistance = 3;
  controls.maxDistance = 34;
  controls.minPolarAngle = 0.06;
  controls.maxPolarAngle = Math.PI * 0.485;
  controls.rotateSpeed = 0.55;
  controls.panSpeed = 0.65;
  controls.zoomSpeed = 0.7;
  controls.screenSpacePanning = false;
  controls.target.set(0, 3.7, -0.45);
  camera.position.set(0.65, 6.6, 11.8);
  controls.update();

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentRoom = new RoomEnvironment();
  const environment = pmrem.fromScene(environmentRoom, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.18;
  environmentRoom.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight("#d6e7ff", "#30231a", 0.55));
  const key = new THREE.DirectionalLight("#ffe6bc", 1.55);
  key.position.set(-5, 10, 6);
  key.target.position.set(0, 2.5, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(
    window.innerWidth < 700 ? 1024 : 2048,
    window.innerWidth < 700 ? 1024 : 2048,
  );
  Object.assign(key.shadow.camera, {
    left: -9,
    right: 9,
    top: 9,
    bottom: -9,
    near: 1,
    far: 25,
  });
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.025;
  key.shadow.radius = 3;
  scene.add(key, key.target);
  const windowLight = new THREE.PointLight("#78b6ff", 22, 19, 2);
  windowLight.position.set(2.5, 6.0, -5.3);
  scene.add(windowLight);
  const lamp = new THREE.SpotLight("#ffcb7b", 70, 12, 0.9, 0.75, 2);
  lamp.position.set(-5, 4.26, -1.46);
  lamp.target.position.set(-3, 2.35, 0.2);
  scene.add(lamp, lamp.target);
  const fill = new THREE.PointLight("#beddf0", 5, 15, 2);
  fill.position.set(4, 5, 7);
  scene.add(fill);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const objects = new Map();
  const hinges = new Map();
  const hotspots = new Map();
  const sceneMeshes = [];
  const projected = new THREE.Vector3();
  const toAnchor = new THREE.Vector3();
  let disposed = false,
    model = null,
    raf = 0,
    flight = null,
    savedView = null;
  let inspecting = null,
    hovered = null,
    ready = false,
    progress = 0,
    angle = 0;
  let gesture = null,
    renderAt = 0,
    statsAt = 0,
    lastAt = performance.now();
  const touches = new Set();
  const tooltip = document.createElement("div");
  tooltip.className = "object-tooltip";
  tooltip.setAttribute("aria-hidden", "true");
  host.append(tooltip);

  function home() {
    if (window.innerWidth < 700) {
      const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const distance = Math.max(
        2.72 / (2 * tangent * camera.aspect * 0.78),
        3.36 / (2 * tangent * 0.76),
      );
      const target = vector([0, 4.03, -0.45]);
      return {
        position: target
          .clone()
          .add(
            vector([0.03, 0.19, 0.981]).normalize().multiplyScalar(distance),
          ),
        target,
      };
    }
    return {
      position: vector(
        window.innerWidth < 700 ? [0.25, 5.4, 7.7] : [0.65, 5.8, 8.5],
      ),
      target: vector([0, 3.78, -0.45]),
    };
  }
  function wide() {
    const distance = Math.max(
      14,
      (12.8 /
        (2 *
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
          camera.aspect)) *
        1.25,
    );
    const target = vector([0, 2.25, 0]);
    return {
      position: target
        .clone()
        .add(
          vector([0.22, 0.47, 0.855])
            .normalize()
            .multiplyScalar(Math.min(32, distance)),
        ),
      target,
    };
  }
  function itemView(id) {
    const item = objects.get(id);
    if (!item || id === "profile") return home();
    const target = item.root.getWorldPosition(new THREE.Vector3());
    target.y += 0.14;
    const distance = window.innerWidth < 700 ? 6.7 : 5.5;
    return {
      position: target
        .clone()
        .add(vector([0.15, 0.89, 0.44]).normalize().multiplyScalar(distance)),
      target,
    };
  }
  function fly(view, duration = 850, complete) {
    tooltip.classList.remove("visible");
    flight = {
      from: camera.position.clone(),
      targetFrom: controls.target.clone(),
      ...view,
      start: performance.now(),
      duration: read().reduced ? 0 : duration,
      complete,
    };
  }
  function restore() {
    if (!savedView) {
      inspecting = null;
      return;
    }
    fly(savedView, 800);
    savedView = null;
    inspecting = null;
  }
  function pick(id) {
    if (read().locked || !ready) return;
    const item = objects.get(id);
    if (item) read().onPick(item.file, id);
  }
  function pointerDown(event) {
    if (read().mode === "explore" && !read().locked && !inspecting) {
      flight = null;
      controls.enabled = true;
      controls.enableDamping = true;
    }
    touches.add(event.pointerId);
    if (touches.size > 1 && gesture) gesture.multi = true;
    if (event.isPrimary && event.button === 0)
      gesture = {
        x: event.clientX,
        y: event.clientY,
        multi: false,
        id: event.pointerId,
      };
  }
  function hitAt(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return (
      raycaster.intersectObjects(sceneMeshes, false)[0]?.object.userData
        .evidenceId || null
    );
  }
  function pointerMove(event) {
    if (!ready || read().locked || touches.size) return;
    hovered = hitAt(event);
    canvas.style.cursor = hovered
      ? "pointer"
      : read().mode === "explore"
        ? "grab"
        : "auto";
    const file = objects.get(hovered)?.file;
    if (file) {
      tooltip.textContent = `${FILES.find((item) => item.id === file)?.label} ↗`;
      tooltip.style.left = `${Math.min(host.clientWidth - 210, event.offsetX + 18)}px`;
      tooltip.style.top = `${Math.max(12, event.offsetY - 42)}px`;
      tooltip.classList.add("visible");
    } else tooltip.classList.remove("visible");
  }
  function pointerUp(event) {
    touches.delete(event.pointerId);
    if (
      gesture?.id === event.pointerId &&
      !gesture.multi &&
      event.type !== "pointercancel" &&
      Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) < 7
    ) {
      const hit = hitAt(event);
      if (hit) pick(hit);
    }
    if (!touches.size) gesture = null;
  }
  const leave = () => {
    hovered = null;
    tooltip.classList.remove("visible");
  };
  canvas.addEventListener("pointerdown", pointerDown, true);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerUp);
  canvas.addEventListener("pointerleave", leave);
  const contextLost = (event) => {
    event.preventDefault();
    notify("error");
  };
  canvas.addEventListener("webglcontextlost", contextLost);
  const resize = () => {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.fov = width < 700 ? 42 : 38;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  function disposeModel(root) {
    const materials = new Set(),
      textures = new Set();
    root.traverse((obj) => {
      obj.geometry?.dispose();
      if (obj.material)
        for (const material of Array.isArray(obj.material)
          ? obj.material
          : [obj.material])
          materials.add(material);
    });
    for (const mat of materials) {
      for (const value of Object.values(mat))
        if (value?.isTexture) textures.add(value);
      mat.dispose();
    }
    for (const tex of textures) {
      tex.source?.data?.close?.();
      tex.dispose();
    }
  }
  new GLTFLoader().load(
    MODEL,
    (gltf) => {
      if (disposed) {
        disposeModel(gltf.scene);
        return;
      }
      model = gltf.scene;
      scene.add(model);
      let meshes = 0,
        triangles = 0;
      model.traverse((obj) => {
        if (obj.name.startsWith("item_")) {
          const id = obj.userData.evidenceId || obj.name.slice(5);
          const data = EVIDENCE.find((item) => item.id === id);
          objects.set(id, {
            root: obj,
            baseY: obj.position.y,
            file: obj.userData.fileId || data?.file,
          });
        }
        if (obj.name.startsWith("hinge_"))
          hinges.set(obj.name.slice(6), {
            root: obj,
            quaternion: obj.quaternion.clone(),
            open: 0,
          });
        if (!obj.isMesh) return;
        meshes++;
        sceneMeshes.push(obj);
        triangles += obj.geometry.index
          ? obj.geometry.index.count / 3
          : obj.geometry.attributes.position.count / 3;
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material.name.startsWith("Walnut")) woodGrain(obj.material);
        if (obj.material.name === "Shreyas photograph") {
          obj.material = new THREE.MeshBasicMaterial({
            map: obj.material.map,
            toneMapped: false,
          });
        }
        let root = obj;
        while (root && !root.userData.evidenceId) root = root.parent;
        if (root?.userData.evidenceId) {
          obj.userData.evidenceId = root.userData.evidenceId;
        }
      });
      for (const [id, item] of objects) {
        const button = document.createElement("button");
        button.className = "mesh-hotspot";
        button.dataset.item = id;
        button.setAttribute(
          "aria-label",
          EVIDENCE.find((entry) => entry.id === id)?.label ||
            `Open ${item.file}`,
        );
        const caption = document.createElement("span");
        caption.textContent =
          FILES.find((file) => file.id === item.file)?.label || "Open file";
        button.append(caption);
        button.addEventListener("click", () => pick(id));
        button.addEventListener("focus", () => {
          hovered = id;
          if (
            button.matches(":focus-visible") &&
            read().mode === "explore" &&
            !read().locked
          )
            fly(itemView(id), 550);
        });
        button.addEventListener("blur", leave);
        host.append(button);
        hotspots.set(id, button);
      }
      canvas.dataset.meshCount = String(meshes);
      canvas.dataset.triangles = String(Math.round(triangles));
      canvas.dataset.loaded = "true";
      renderer.shadowMap.needsUpdate = true;
      ready = true;
      fly(home(), 1500);
      notify("ready");
    },
    undefined,
    (error) => {
      if (!disposed) {
        console.error("Could not load desk model", error);
        notify("error");
      }
    },
  );

  function tick(now) {
    if (disposed) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.07, (now - lastAt) / 1000);
    lastAt = now;
    const state = read();
    controls.enabled = state.mode === "explore" && !state.locked && !flight;
    controls.enableDamping = controls.enabled;
    canvas.style.touchAction = state.mode === "explore" ? "none" : "pan-y";
    if (flight) {
      const t = flight.duration
        ? Math.min(1, (now - flight.start) / flight.duration)
        : 1;
      const f = ease(t);
      camera.position.copy(mix(flight.from, flight.position, f));
      controls.target.copy(mix(flight.targetFrom, flight.target, f));
      if (t === 1) {
        const complete = flight.complete;
        flight = null;
        complete?.();
      }
    } else if (ready && state.mode === "story" && !state.locked) {
      const stop = progress * (TRAIL.length - 1);
      const index = Math.floor(stop),
        next = Math.min(TRAIL.length - 1, index + 1);
      const a = itemView(
        EVIDENCE.find((item) => item.file === TRAIL[index].file)?.id,
      );
      const b = itemView(
        EVIDENCE.find((item) => item.file === TRAIL[next].file)?.id,
      );
      const amount = state.reduced ? 1 : 1 - Math.exp(-dt * 6);
      camera.position.lerp(mix(a.position, b.position, stop - index), amount);
      controls.target.lerp(mix(a.target, b.target, stop - index), amount);
    }
    controls.update();
    let moving = Boolean(flight);
    for (const [id, item] of objects) {
      const lift =
        !state.reduced && (id === inspecting || id === hovered)
          ? id === "profile"
            ? 0.05
            : 0.16
          : 0;
      const height = THREE.MathUtils.lerp(
        item.root.position.y,
        item.baseY + lift,
        state.reduced ? 1 : 1 - Math.exp(-dt * 12),
      );
      if (Math.abs(height - item.root.position.y) > 0.0002) {
        moving = true;
        renderer.shadowMap.needsUpdate = true;
      }
      item.root.position.y = height;
    }
    for (const [id, hinge] of hinges) {
      const target = id === inspecting ? 1 : 0;
      const amount = state.reduced ? 1 : 1 - Math.exp(-dt * 6);
      const next = THREE.MathUtils.lerp(hinge.open, target, amount);
      if (Math.abs(next - hinge.open) > 0.0003) {
        moving = true;
        renderer.shadowMap.needsUpdate = true;
      }
      hinge.open = next;
      hinge.root.quaternion
        .copy(hinge.quaternion)
        .multiply(
          new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            next * Math.PI * 0.63,
          ),
        );
    }
    scene.updateMatrixWorld();
    for (const [id, button] of hotspots) {
      const item = objects.get(id);
      item.root.getWorldPosition(projected);
      if (id === "profile") {
        projected.x += 1.05;
        projected.y -= 1.46;
        projected.z += 0.14;
      } else {
        projected.x += 0.9;
        projected.z += 0.65;
        projected.y += 0.11;
      }
      toAnchor.copy(projected).sub(camera.position).normalize();
      raycaster.set(camera.position, toAnchor);
      const frontObject = raycaster.intersectObjects(sceneMeshes, false)[0]
        ?.object.userData.evidenceId;
      projected.project(camera);
      const visible =
        projected.z > -1 &&
        projected.z < 1 &&
        Math.abs(projected.x) < 0.96 &&
        Math.abs(projected.y) < 0.96 &&
        frontObject === id &&
        !state.locked;
      button.hidden = !visible;
      button.style.left = `${((projected.x + 1) * host.clientWidth) / 2}px`;
      button.style.top = `${((1 - projected.y) * host.clientHeight) / 2}px`;
      button.classList.toggle("active", id === hovered);
    }
    if (now - statsAt > 250) {
      canvas.dataset.camera = JSON.stringify({
        position: camera.position.toArray().map((n) => +n.toFixed(3)),
        target: controls.target.toArray().map((n) => +n.toFixed(3)),
        distance: +controls.getDistance().toFixed(3),
        inspecting,
        hinges: Object.fromEntries(
          [...hinges].map(([id, entry]) => [id, +entry.open.toFixed(2)]),
        ),
      });
      statsAt = now;
    }
    if (
      !document.hidden &&
      (!state.locked || moving) &&
      now - renderAt > (window.innerWidth < 700 ? 30 : 12)
    ) {
      renderer.render(scene, camera);
      renderAt = now;
    }
  }
  raf = requestAnimationFrame(tick);
  return {
    travel(value) {
      progress = Math.max(0, Math.min(1, value));
    },
    inspect(id, complete) {
      if (!ready) {
        complete?.();
        return;
      }
      savedView ??= {
        position: camera.position.clone(),
        target: controls.target.clone(),
      };
      inspecting = id || "profile";
      hovered = null;
      const view = itemView(inspecting);
      if (inspecting === "profile")
        view.position.sub(view.target).multiplyScalar(0.84).add(view.target);
      fly(view, 1150, complete);
    },
    restore,
    cancel: restore,
    fit() {
      if (ready) fly(wide());
    },
    home() {
      if (ready) fly(home());
    },
    angle(value) {
      angle = value;
      if (!ready) return;
      if (!angle) {
        fly(home());
        return;
      }
      const view = wide();
      const distance = view.position.distanceTo(view.target);
      const direction =
        angle === 1
          ? vector([0.001, 1, 0.002])
          : vector([0.58, 0.42, 0.69]).normalize();
      fly({
        position: view.target.clone().add(direction.multiplyScalar(distance)),
        target: view.target,
      });
    },
    zoom(direction) {
      if (!ready || inspecting) return;
      const delta = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(
        delta.length() * (direction > 0 ? 0.82 : 1.22),
        3,
        34,
      );
      fly(
        {
          position: controls.target
            .clone()
            .add(delta.normalize().multiplyScalar(distance)),
          target: controls.target.clone(),
        },
        350,
      );
    },
    key(event) {
      if (read().mode !== "explore" || read().locked) return;
      const pan = {
        ArrowLeft: [-55, 0],
        ArrowRight: [55, 0],
        ArrowUp: [0, -55],
        ArrowDown: [0, 55],
      }[event.key];
      if (pan) {
        event.preventDefault();
        controls.pan(...pan);
        controls.update();
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        this.zoom(1);
      }
      if (event.key === "-") {
        event.preventDefault();
        this.zoom(-1);
      }
      if (event.key === "0") {
        event.preventDefault();
        this.fit();
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      controls.dispose();
      canvas.removeEventListener("pointerdown", pointerDown, true);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("webglcontextlost", contextLost);
      if (model) disposeModel(model);
      environment.dispose();
      key.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      for (const button of hotspots.values()) button.remove();
      tooltip.remove();
      canvas.remove();
    },
  };
}
