import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// One continuous path connects the three recurring interests in the scroll story.
class CuriosityLoop extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const angle = t * Math.PI * 2;
    const radius = 1.15 + 0.34 * Math.cos(3 * angle);
    return target.set(
      radius * Math.cos(2 * angle),
      radius * Math.sin(2 * angle),
      0.5 * Math.sin(3 * angle),
    );
  }
}

export default function Sculpture({ paused, onUnavailable }) {
  const mount = useRef(null);
  const pausedRef = useRef(paused);
  const wake = useRef(() => {});
  useEffect(() => {
    pausedRef.current = paused;
    wake.current();
  }, [paused]);
  useEffect(() => {
    const element = mount.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      onUnavailable();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0xf5f3ec, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 6.9);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    const group = new THREE.Group();
    group.rotation.set(0.3, -0.45, -0.22);
    scene.add(group);
    const path = new CuriosityLoop();
    const geometry = new THREE.TubeGeometry(path, 200, 0.19, 20, true);
    const material = new THREE.MeshStandardMaterial({
      color: 0x343d2c,
      metalness: 0.82,
      roughness: 0.24,
      envMapIntensity: 1.5,
    });
    group.add(new THREE.Mesh(geometry, material));
    const beadGeometry = new THREE.SphereGeometry(0.225, 28, 20);
    const beadMaterial = new THREE.MeshStandardMaterial({
      color: 0xd5ef87,
      metalness: 0.25,
      roughness: 0.3,
    });
    const beads = [0.09, 0.42, 0.75].map((t) => {
      const bead = new THREE.Mesh(beadGeometry, beadMaterial);
      bead.position.copy(path.getPoint(t));
      group.add(bead);
      return bead;
    });
    const rim = new THREE.DirectionalLight(0xecf8d6, 4);
    rim.position.set(-3, 4, 3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 2);
    fill.position.set(4, -2, 1);
    scene.add(fill);
    let visible = true;
    let hidden = document.hidden;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let drag = false;
    let userRotation = 0;
    let previousX = 0;
    const pointer = new THREE.Vector2();
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      schedule();
    };
    const tick = (time) => {
      frame = 0;
      if (!visible || hidden) return;
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      if (!pausedRef.current) {
        elapsed += delta;
        group.rotation.y =
          -0.45 + elapsed * 0.1 + userRotation + pointer.x * 0.13;
        group.rotation.x = 0.3 + pointer.y * 0.1;
        group.position.y = Math.sin(elapsed * 0.6) * 0.055;
        beads.forEach((bead, i) =>
          bead.position.copy(
            path.getPoint((elapsed * 0.018 + i / 3 + 0.09) % 1),
          ),
        );
      }
      renderer.render(scene, camera);
      if (!pausedRef.current) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame && visible && !hidden) frame = requestAnimationFrame(tick);
    };
    wake.current = () => {
      lastTime = 0;
      schedule();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          lastTime = 0;
          schedule();
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0 },
    );
    observer.observe(element);
    const visibility = () => {
      hidden = document.hidden;
      lastTime = 0;
      if (!hidden) schedule();
    };
    const move = (event) => {
      if (event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      pointer.set(
        (event.clientX - rect.left) / rect.width - 0.5,
        (event.clientY - rect.top) / rect.height - 0.5,
      );
      if (drag) {
        userRotation += (event.clientX - previousX) * 0.009;
        previousX = event.clientX;
      }
      schedule();
    };
    const down = (event) => {
      if (event.pointerType !== "touch") {
        drag = true;
        previousX = event.clientX;
        element.setPointerCapture(event.pointerId);
      }
    };
    const up = () => {
      drag = false;
    };
    const leave = () => {
      pointer.set(0, 0);
    };
    const contextLost = (event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      onUnavailable();
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("pointerleave", leave);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      wake.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      geometry.dispose();
      material.dispose();
      beadGeometry.dispose();
      beadMaterial.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onUnavailable]);
  return <div className="sculpture-mount" ref={mount} aria-hidden="true" />;
}
