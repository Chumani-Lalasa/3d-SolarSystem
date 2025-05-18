// This file creates a procedural space ambient sound using the Web Audio API

// Function to create space ambient sound
export function createSpaceAmbience(audioContext) {
  // Create a gain node for the overall volume
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.15; // Set a low volume for background noise
  masterGain.connect(audioContext.destination);

  // Create a function to generate a random frequency within a range
  const randomFrequency = (min, max) => Math.random() * (max - min) + min;

  // Create a function to generate a random detune value
  const randomDetune = () => Math.random() * 20 - 10;

  // Create a function to generate a random Q value for filters
  const randomQ = () => Math.random() * 10 + 1;

  // Create a function to generate a deep space hum
  const createDeepSpaceHum = () => {
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = randomFrequency(40, 80);
    oscillator.detune.value = randomDetune();
    
    // Create filter
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = randomQ();
    
    // Create gain node
    const gain = audioContext.createGain();
    gain.gain.value = 0.1;
    
    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    // Start oscillator
    oscillator.start();
    
    // Slowly modulate the frequency
    const now = audioContext.currentTime;
    oscillator.frequency.setValueAtTime(oscillator.frequency.value, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      randomFrequency(30, 60),
      now + 10
    );
    
    return { oscillator, gain, filter };
  };

  // Create a function to generate cosmic whispers
  const createCosmicWhispers = () => {
    // Create noise source using white noise
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    // Create filter
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = randomFrequency(2000, 6000);
    filter.Q.value = randomQ();
    
    // Create gain node
    const gain = audioContext.createGain();
    gain.gain.value = 0.01;
    
    // Connect nodes
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    // Start noise
    noise.start();
    
    // Modulate the filter frequency
    const now = audioContext.currentTime;
    filter.frequency.setValueAtTime(filter.frequency.value, now);
    filter.frequency.exponentialRampToValueAtTime(
      randomFrequency(1000, 8000),
      now + 15
    );
    
    return { noise, gain, filter };
  };

  // Create a function to generate distant pulses
  const createDistantPulses = () => {
    // Create LFO for amplitude modulation
    const lfo = audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = randomFrequency(0.05, 0.2);
    
    // Create gain node for LFO
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 1;
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = randomFrequency(200, 800);
    oscillator.detune.value = randomDetune();
    
    // Create filter
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = oscillator.frequency.value;
    filter.Q.value = randomQ();
    
    // Create gain node
    const gain = audioContext.createGain();
    gain.gain.value = 0.02;
    
    // Connect LFO to gain
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    
    // Connect oscillator to output
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    // Start oscillator and LFO
    oscillator.start();
    lfo.start();
    
    return { oscillator, lfo, gain, filter };
  };

  // Create multiple layers of space sounds
  const deepSpaceHums = Array(3).fill().map(() => createDeepSpaceHum());
  const cosmicWhispers = Array(2).fill().map(() => createCosmicWhispers());
  const distantPulses = Array(2).fill().map(() => createDistantPulses());

  // Return an object with methods to control the ambience
  return {
    setVolume: (volume) => {
      masterGain.gain.value = volume;
    },
    stop: () => {
      // Stop all sound sources
      deepSpaceHums.forEach(({ oscillator }) => oscillator.stop());
      cosmicWhispers.forEach(({ noise }) => noise.stop());
      distantPulses.forEach(({ oscillator, lfo }) => {
        oscillator.stop();
        lfo.stop();
      });
    }
  };
}
