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
    stopArpeggio(); // Clear any previously playing oscillators and timeouts

    const scaleType = document.getElementById('scaleType').value;
    const patternType = document.getElementById('patternType').value;
    const waveformType = document.getElementById('oscillatorType').value;
    const bpm = parseInt(document.getElementById('tempoSlider').value);
    const noteDuration = (60 / bpm) * 1000; // Duration of each note in milliseconds

    // Calculate frequencies for the selected scale
    const frequencies = calculateFrequencies(scaleType);

    // Determine the order of notes based on the selected pattern
    const noteOrder = getOrder(patternType, frequencies.length);

    // Schedule each note to play at the correct time
    noteOrder.forEach((noteIndex, index) => {
        const timeout = setTimeout(() => {
            const frequency = frequencies[noteIndex];
            const oscillator = createOscillator(frequency, waveformType);
            oscillator.start();
            // Stop the oscillator after the note's duration
            setTimeout(() => oscillator.stop(), noteDuration);
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
            const down = [...Array(length).keys()].reverse().slice(1);
            return up.concat(down);
        case 'random':
            return [...Array(length).keys()].sort(() => Math.random() - 0.5);
        default:
            return [...Array(length).keys()];
    }
}

function calculateFrequencies(scale) {
    const baseFrequency = 261.63; // C4 in Hz
    switch (scale) {
        case 'major':
            return [baseFrequency, baseFrequency * Math.pow(2, 4/12), baseFrequency * Math.pow(2, 7/12)];
        case 'minor':
            return [baseFrequency, baseFrequency * Math.pow(2, 3/12), baseFrequency * Math.pow(2, 7/12)];
        // Define other scales as needed
        default:
            return [baseFrequency, baseFrequency * Math.pow(2, 4/12), baseFrequency * Math.pow(2, 7/12)];
    }
}

function createOscillator(freq, type) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    return oscillator;
}

function stopArpeggio() {
    noteTimeouts.forEach(timeout => clearTimeout(timeout));
    activeOscillators.forEach(osc => osc.stop());
    noteTimeouts = [];
    activeOscillators = [];
}
