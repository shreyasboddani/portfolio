import { useEffect, useRef, useState } from "react";

function makeRoomAudio() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return null;
  const audio = new Audio();
  const master = audio.createGain();
  master.gain.value = 0;
  const compressor = audio.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.ratio.value = 3;
  master.connect(compressor).connect(audio.destination);
  const noise = audio.createBuffer(1, audio.sampleRate * 4, audio.sampleRate);
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  const rain = audio.createBufferSource();
  rain.buffer = noise;
  rain.loop = true;
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  const gain = audio.createGain();
  gain.gain.value = .028;
  rain.connect(filter).connect(gain).connect(master);
  rain.start();
  return { audio, master, noise };
}

export default function useDeskAudio() {
  const [enabled, setEnabled] = useState(false);
  const context = useRef(null);
  useEffect(
    () => () => {
      context.current?.audio.close();
    },
    [],
  );
  useEffect(() => {
    let pauseTimer;
    const update = () => {
      clearTimeout(pauseTimer);
      const room = context.current;
      if (!room) return;
      const { audio, master } = room;
      master.gain.cancelScheduledValues(audio.currentTime);
      master.gain.setTargetAtTime(enabled && !document.hidden ? .55 : 0, audio.currentTime, .15);
      if (enabled && !document.hidden && audio.state === "suspended") audio.resume().catch(() => {});
      if (!enabled || document.hidden)
        pauseTimer = window.setTimeout(() => audio.suspend().catch(() => {}), 600);
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      clearTimeout(pauseTimer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [enabled]);
  const play = (kind = "paper", force = false) => {
    if (!enabled && !force) return;
    context.current ??= makeRoomAudio();
    if (!context.current) return;
    const { audio, master, noise } = context.current;
    if (audio.state === "suspended") audio.resume().catch(() => {});
    if (force) master.gain.setTargetAtTime(.55, audio.currentTime, .02);
    const now = audio.currentTime;
    const pan = audio.createStereoPanner();
    pan.pan.value = (Math.random() - .5) * .3;
    pan.connect(master);
    let ends = now;
    const burst = (delay, duration, volume, frequency, type = "bandpass") => {
      const source = audio.createBufferSource();
      source.buffer = noise;
      source.playbackRate.value = .92 + Math.random() * .18;
      const filter = audio.createBiquadFilter();
      filter.type = type;
      filter.frequency.setValueAtTime(frequency, now + delay);
      filter.frequency.exponentialRampToValueAtTime(Math.max(180, frequency * .5), now + delay + duration);
      filter.Q.value = .65;
      const gain = audio.createGain();
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(volume, now + delay + .009);
      gain.gain.exponentialRampToValueAtTime(.0001, now + delay + duration);
      source.connect(filter).connect(gain).connect(pan);
      source.start(now + delay, Math.random() * 2, duration);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
      ends = Math.max(ends, now + delay + duration);
    };
    const knock = (frequency, delay, volume, duration) => {
      const oscillator = audio.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now + delay);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * .75, now + delay + duration);
      const gain = audio.createGain();
      gain.gain.setValueAtTime(volume, now + delay);
      gain.gain.exponentialRampToValueAtTime(.0001, now + delay + duration);
      oscillator.connect(gain).connect(pan);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + duration);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      ends = Math.max(ends, now + delay + duration);
    };
    if (["paper", "close", "page"].includes(kind)) {
      const closing = kind === "close";
      burst(0, .16, .14, 1900);
      burst(.075, .24, .10, 3200);
      burst(.21, .15, .07, 1400);
      if (kind !== "page") {
        knock(closing ? 130 : 190, closing ? .25 : 0, .11, .13);
        burst(closing ? .25 : 0, .055, .07, 540, "lowpass");
      }
    } else if (kind === "camera") {
      burst(0, .24, .055, 620, "lowpass");
      knock(95, 0, .023, .20);
    } else {
      burst(0, .042, .10, 2100, "highpass");
      knock(780, 0, .045, .035);
      knock(1700, .008, .017, .027);
    }
    window.setTimeout(() => pan.disconnect(), (ends - now) * 1000 + 100);
  };
  const toggle = () => {
    if (!enabled) play("click", true);
    setEnabled((value) => !value);
  };
  return { enabled, toggle, play };
}
