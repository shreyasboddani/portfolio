import { useEffect, useImperativeHandle, useRef } from "react";
import { createDeskScene } from "./deskScene";

export default function Desk3D({
  ref,
  mode,
  reduced,
  locked,
  onPick,
  onStatus,
}) {
  const host = useRef(null);
  const engine = useRef(null);
  const latest = useRef(null);
  useEffect(() => {
    latest.current = { mode, reduced, locked, onPick, onStatus };
  }, [mode, reduced, locked, onPick, onStatus]);
  useImperativeHandle(
    ref,
    () => ({
      travel: (value) => engine.current?.travel(value),
      inspect: (id, complete) => engine.current?.inspect(id, complete),
      restore: () => engine.current?.restore(),
      cancel: () => engine.current?.cancel(),
      fit: () => engine.current?.fit(),
      home: () => engine.current?.home(),
      begin: () => engine.current?.begin(),
      angle: (value) => engine.current?.angle(value),
      zoom: (direction) => engine.current?.zoom(direction),
    }),
    [],
  );
  useEffect(() => {
    let instance;
    try {
      instance = createDeskScene(
        host.current,
        () => latest.current,
        (status) => latest.current.onStatus(status),
      );
      engine.current = instance;
    } catch (error) {
      console.error("Could not create 3D renderer", error);
      latest.current.onStatus("error");
    }
    return () => {
      engine.current = null;
      instance?.dispose();
    };
  }, []);
  return (
    <div
      className="webgl-host"
      role="group"
      ref={host}
      tabIndex={mode === "explore" ? 0 : -1}
      aria-label="3D desk controls. Drag to orbit. Scroll or pinch to zoom. Arrow keys pan; plus and minus zoom; zero fits the desk."
      onKeyDown={(event) => {
        if (event.target === event.currentTarget) engine.current?.key(event);
      }}
    />
  );
}
