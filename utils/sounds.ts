
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

// Helper to create a noise buffer for scratchy/dice sounds
let noiseBuffer: AudioBuffer | null = null;
const getNoiseBuffer = () => {
  if (!noiseBuffer) {
    const bufferSize = audioCtx.sampleRate * 1.0;
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
};

export const playSound = (type: 'dice' | 'write' | 'gold' | 'luck' | 'delete') => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  switch (type) {
    case 'dice': {
      // Low rumble + high rattle
      const noise = audioCtx.createBufferSource();
      noise.buffer = getNoiseBuffer();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.2);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.2);

      // Add a tiny click for impact
      const osc = audioCtx.createOscillator();
      osc.frequency.setValueAtTime(150, now);
      const oscGain = audioCtx.createGain();
      oscGain.gain.setValueAtTime(0.1, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }
    case 'write': {
      // Parchment scratch using filtered noise
      const noise = audioCtx.createBufferSource();
      noise.buffer = getNoiseBuffer();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(1, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.12);
      break;
    }
    case 'gold': {
      // Metallic chime with harmonics
      [880, 1760, 2200].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.05 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      });
      break;
    }
    case 'luck': {
      // Shimmery magical rise
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.6);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    }
    case 'delete': {
      // Quick low-pitched thud/crumple
      const noise = audioCtx.createBufferSource();
      noise.buffer = getNoiseBuffer();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.1);
      break;
    }
  }
};
