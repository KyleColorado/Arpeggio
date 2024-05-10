const audioContext = new AudioContext();
let activeOscillators = [];

document.getElementById('playButton').addEventListener('click', function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    playArpeggio();
});

document.getElementById('stopButton').addEventListener('click', stopArpeggio);

function playArpeggio() {
    stopArpeggio(); // Stop any currently playing arpeggios before starting a new one
    const type = document.getElementById('scaleType').value;
    const pattern = document.getElementById('patternType').value;
    const waveform = document.getElementById('oscillatorType').value;

    // For simplicity, assume we always start with C4 (frequency of approximately 261.63 Hz)
    const baseFrequency = 261.63; // C4
    let frequencies = [baseFrequency, baseFrequency * 1.12246, baseFrequency * 1.25992]; // Simple major scale: root, major third, perfect fifth

    if (type === 'minor') {
        frequencies[1] = baseFrequency * 1.18921; // Minor third
    }

    frequencies.forEach(freq => {
        const oscillator = createOscillator(freq, waveform);
        oscillator.start();
        activeOscillators.push(oscillator);
    });

    setTimeout(stopArpeggio, 5000); // Stop after 5 seconds
}

function createOscillator(freq, type) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    return oscillator;
}

function stopArpeggio() {
    activeOscillators.forEach(osc => osc.stop());
    activeOscillators = [];
}

