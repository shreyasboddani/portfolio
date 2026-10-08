import { useEffect, useRef, useState } from "react";

export default function useDeskAudio() {
  const [enabled, setEnabled] = useState(false);
  const context = useRef(null);
  useEffect(
    () => () => {
      context.current?.close();
    },
    [],
  );
  const play = (kind = "paper", force = false) => {
    if (!enabled && !force) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    context.current ??= new Audio();
    const audio = context.current;
    if (audio.state === "suspended") audio.resume().catch(() => {});
    const now = audio.currentTime;
    const duration = kind === "paper" ? 0.32 : 0.1;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(
      kind === "paper" ? 0.045 : 0.025,
      now + 0.015,
    );
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    gain.connect(audio.destination);
    if (kind === "paper") {
      const buffer = audio.createBuffer(
        1,
        Math.ceil(audio.sampleRate * duration),
        audio.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const source = audio.createBufferSource();
      const filter = audio.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      source.start(now);
      source.stop(now + duration);
    } else {
      const oscillator = audio.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(380, now);
      oscillator.frequency.exponentialRampToValueAtTime(160, now + duration);
      oscillator.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + duration);
    }
  };
  const toggle = () => {
    if (!enabled) play("click", true);
    setEnabled((value) => !value);
  };
  return { enabled, toggle, play };
}
