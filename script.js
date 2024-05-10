const audioContext = new AudioContext();
let activeOscillators = [];
let noteTimeouts = [];

document.getElementById('playButton').addEventListener('click', function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    playArpeggio();
});

document.getElementById('stopButton').addEventListener('click', stopArpeggio);

function playArpeggio() {
    clearOscillators(); // Clear any previously playing oscillators

    const type = document.getElementById('scaleType').value;
    const pattern = document.getElementById('patternType').value;
    const waveform = document.getElementById('oscillatorType').value;
    const bpm = parseInt(document.getElementById('tempoSlider').value);
    const noteDuration = (60 / bpm) * 1000; // duration in milliseconds

    // Frequency calculation for the scale
    let frequencies = calculateFrequencies(type);

    // Determine note order based on the pattern
    let noteOrder = getOrder(pattern, frequencies.length);

    noteOrder.forEach((noteIndex, index) => {
        const timeout = setTimeout(() => {
            const oscillator = createOscillator(frequencies[noteIndex], waveform);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + (noteDuration / 1000)); // Stop after note duration
            activeOscillators.push(oscillator);
        }, noteDuration * index);
        noteTimeouts.push(timeout);
    });
}

function getOrder(pattern, length) {
    switch (pattern) {
        case 'up':
            return [...Array(length).keys()];
        case 'down':
            return [...Array(length).keys()].reverse();
        case 'upAndDown':
            const up = [...Array(length).keys()];
            const down = up.slice(0, -1).reverse().slice(1);
            return up.concat(down);
        case 'random':
            const random = [...Array(length).keys()];
            return random.sort(() => Math.random() - 0.5);
        default:
            return [...Array(length).keys()];
    }
}

function calculateFrequencies(scale) {
    // Placeholder: Simple C major scale (implement actual scale logic)
    const baseFrequency = 261.63; // C4
    switch (scale) {
        case 'major':
            return [baseFrequency, baseFrequency * 1.12246, baseFrequency * 1.25992]; // C, E, G
        case 'minor':
            return [baseFrequency, baseFrequency * 1.18921, baseFrequency * 1.25992]; // C, Eb, G
        // Add more scales here
        default:
            return [baseFrequency, baseFrequency * 1.12246, baseFrequency * 1.25992];
    }
}

function createOscillator(freq, type) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    return oscillator;
}

function clearOscillators() {
    activeOscillators.forEach(osc => osc.stop());
    noteTimeouts.forEach(timeout => clearTimeout(timeout));
    activeOscillators = [];
    noteTimeouts = [];
}
