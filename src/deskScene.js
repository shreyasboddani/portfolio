import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { EVIDENCE, FILES, TRAIL } from "./caseData";

const MODEL = "/models/on-my-desk.glb?v=3";
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
  scene.background = new THREE.Color("#080e14");
  scene.fog = new THREE.FogExp2("#080e14", 0.022);
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
  renderer.toneMappingExposure = 1.10;
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
  scene.environmentIntensity = 0.12;
  environmentRoom.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight("#a4bcdf", "#201510", 0.24));
  const key = new THREE.SpotLight("#ffd7a2", 230, 23, 0.63, 0.48, 2);
  key.position.set(-3.4, 8.4, 4.0);
  key.target.position.set(0, 2.5, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(
    window.innerWidth < 700 ? 1024 : 2048,
    window.innerWidth < 700 ? 1024 : 2048,
  );
  key.shadow.camera.near = 0.4;
  key.shadow.camera.far = 23;
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.015;
  key.shadow.radius = 4;
  scene.add(key, key.target);
  const windowLight = new THREE.SpotLight("#729ecf", 65, 19, 0.68, 0.3, 2);
  windowLight.position.set(1.2, 7.4, -6.24);
  windowLight.target.position.set(-0.4, 2.45, 0.8);
  windowLight.castShadow = true;
  windowLight.shadow.mapSize.set(1024, 1024);
  windowLight.shadow.bias = -0.0001;
  windowLight.shadow.normalBias = 0.015;
  scene.add(windowLight, windowLight.target);
  const lamp = new THREE.SpotLight("#ffbb68", 38, 12, 0.9, 0.75, 2);
  lamp.position.set(-5, 4.26, -1.46);
  lamp.target.position.set(-3, 2.35, 0.2);
  scene.add(lamp, lamp.target);
  const fill = new THREE.PointLight("#beddf0", 3, 15, 2);
  fill.position.set(4, 5, 7);
  scene.add(fill);

  // Integrate scattering along the view ray inside the spotlight's real cone.
  const beamLength = key.position.distanceTo(key.target.position);
  const beamGeometry = new THREE.CylinderGeometry(0, Math.tan(key.angle)*beamLength, beamLength, 40, 1, false);
  const beamMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    defines: { STEPS: window.innerWidth < 700 ? 12 : 20 },
    uniforms: {
      inverseCone: { value: new THREE.Matrix4() },
      coneLength: { value: beamLength },
      slope: { value: Math.tan(key.angle) },
    },
    vertexShader: `varying vec3 worldPoint;
      void main(){vec4 w=modelMatrix*vec4(position,1.0);worldPoint=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `uniform mat4 inverseCone;uniform float coneLength;uniform float slope;varying vec3 worldPoint;
      void main(){
        vec3 origin=(inverseCone*vec4(cameraPosition,1.0)).xyz;
        vec3 end=(inverseCone*vec4(worldPoint,1.0)).xyz;
        float stepLength=length(end-origin)/float(STEPS);
        vec3 ray=normalize(end-origin);
        float scattering=0.0;
        for(int i=0;i<STEPS;i++){
          vec3 p=origin+ray*(float(i)+.5)*stepLength;
          float h=coneLength*.5-p.y;
          float radius=max(.001,h*slope);
          float density=(1.0-smoothstep(radius*.70,radius,length(p.xz)))*step(.0,h)*(1.0-smoothstep(coneLength*.55,coneLength,h));
          scattering+=density*stepLength/(1.0+h*h*.12);
        }
        float opacity=min(.032,scattering*.008);
        gl_FragColor=vec4(vec3(1.0,.69,.39),opacity);
      }`,
  });
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.copy(key.position).lerp(key.target.position, .5);
  beam.quaternion.setFromUnitVectors(vector([0,1,0]), key.position.clone().sub(key.target.position).normalize());
  beam.updateMatrixWorld();
  beamMaterial.uniforms.inverseCone.value.copy(beam.matrixWorld).invert();
  scene.add(beam);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const ao = window.innerWidth >= 700 ? new GTAOPass(scene, camera, 1, 1) : null;
  if (ao) {
    ao.blendIntensity = 0.65;
    ao.updateGtaoMaterial({ radius: 0.23, thickness: 0.10, samples: 8 });
    // Atmospheric scattering has no solid surface to contribute to contact AO.
    const renderAO = ao.render.bind(ao);
    ao.render = (...args) => {
      beam.visible = false;
      try { renderAO(...args); } finally { beam.visible = true; }
    };
    composer.addPass(ao);
  }
  const bloom = window.innerWidth >= 700
    ? new UnrealBloomPass(new THREE.Vector2(1, 1), 0.16, 0.35, 1.15)
    : null;
  if (bloom) composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const antialias = new ShaderPass(FXAAShader);
  composer.addPass(antialias);
  const finish = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, time: { value: 0 } },
    vertexShader: `varying vec2 vUv;
      void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float time; varying vec2 vUv;
      void main(){
        vec3 color=texture2D(tDiffuse,vUv).rgb;
        vec2 p=(vUv-.5)*1.4;
        color*=1.0-.20*dot(p,p);
        float grain=fract(sin(dot(vUv+fract(time*.013),vec2(12.9898,78.233)))*43758.5453)-.5;
        color+=grain*.007;
        gl_FragColor=vec4(color,1.0);
      }`,
  });
  composer.addPass(finish);

  // Sparse dust is lit inside the actual spotlight, rather than a screen overlay.
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array((window.innerWidth < 700 ? 65 : 180) * 3);
  for (let i = 0; i < dustPositions.length; i += 3) {
    dustPositions[i] = Math.random() * 10 - 5;
    dustPositions[i + 1] = 2.55 + Math.random() * 4.4;
    dustPositions[i + 2] = Math.random() * 6 - 3;
  }
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { time: { value: 0 } },
    vertexShader: `uniform float time; varying float illumination;
      void main(){
        vec3 p=position;
        p.x+=sin(time*.15+position.y*2.0)*.08;
        p.y+=sin(time*.10+position.x*3.0)*.06;
        vec3 light=vec3(-3.4,8.4,4.0);
        vec3 aim=normalize(vec3(0.0,2.5,0.0)-light);
        illumination=smoothstep(.83,.94,dot(normalize(p-light),aim));
        vec4 view=modelViewMatrix*vec4(p,1.0);
        gl_PointSize=clamp(13.0/-view.z,1.0,2.5);
        gl_Position=projectionMatrix*view;
      }`,
    fragmentShader: `varying float illumination;
      void main(){float a=1.0-smoothstep(.1,.5,length(gl_PointCoord-.5));
      gl_FragColor=vec4(vec3(.9,.64,.36),a*illumination*.16);}`,
  });
  scene.add(new THREE.Points(dustGeometry, dustMaterial));

  const fibers = document.createElement("canvas");
  fibers.width = fibers.height = 512;
  const fiberContext = fibers.getContext("2d");
  fiberContext.fillStyle = "#e2e2e2";
  fiberContext.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 18000; i++) {
    const shade = 145 + Math.floor(Math.random() * 100);
    fiberContext.fillStyle = `rgba(${shade},${shade},${shade},.4)`;
    fiberContext.fillRect(Math.random()*512, Math.random()*512, 1 + Math.random()*3, 1);
  }
  const fiberTexture = new THREE.CanvasTexture(fibers);
  fiberTexture.wrapS = fiberTexture.wrapT = THREE.RepeatWrapping;
  fiberTexture.repeat.set(3, 3);

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
        2.88 * 0.8 / (2 * tangent * camera.aspect * 0.75),
        3.32 * 0.8 / (2 * tangent * 0.76),
      );
      const target = vector([-0.45, 3.82, -0.95]);
      return {
        position: target
          .clone()
          .add(
            vector([0.20, 0.19, 0.961]).normalize().multiplyScalar(distance),
          ),
        target,
      };
    }
    return {
      position: vector([2.45, 5.65, 8.4]),
      target: vector([-0.15, 3.48, -0.55]),
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
    const pixelRatio = Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1 : 1.25);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    antialias.uniforms.resolution.value.set(1/(width*pixelRatio), 1/(height*pixelRatio));
    if (ao) {
      ao.enabled = window.innerWidth >= 700;
      ao.setSize(Math.round(width * .75), Math.round(height * .75));
    }
    if (bloom) bloom.enabled = window.innerWidth >= 700;
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
        if (["Ivory paper", "Manila", "Paper edges", "Frame felt backing"].includes(obj.material.name) || obj.material.name.startsWith("Book cover")) {
          obj.material.bumpMap = fiberTexture;
          obj.material.bumpScale = .006;
        }
        if (obj.material.name.startsWith("Walnut") && !obj.material.map) woodGrain(obj.material);
        for (const name of ["map", "normalMap", "roughnessMap"]) {
          if (obj.material[name])
            obj.material[name].anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        }
        if (obj.material.name === "Shreyas photograph") {
          // The print receives the room's light like the rest of the frame.
          obj.material.roughness = 0.58;
          obj.material.envMapIntensity = 0.3;
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
        // The anchor follows the frame's lean, yaw and smaller physical size.
        projected.copy(item.root.localToWorld(vector([1.08, -1.18, 0.17])));
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
      const time = state.reduced ? 0 : now / 1000;
      dustMaterial.uniforms.time.value = time;
      finish.uniforms.time.value = state.reduced ? 0 : Math.floor(time * 12);
      composer.render();
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
      windowLight.shadow.map?.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      beamGeometry.dispose();
      beamMaterial.dispose();
      fiberTexture.dispose();
      for (const pass of composer.passes) pass.dispose?.();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      for (const button of hotspots.values()) button.remove();
      tooltip.remove();
      canvas.remove();
    },
  };
}
