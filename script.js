const audioContext = new AudioContext();
let isPlaying = false;
let activeOscillators = [];

document.getElementById('playButton').addEventListener('click', function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (!isPlaying) {
        isPlaying = true;
        playArpeggio();
    }
});

document.getElementById('stopButton').addEventListener('click', function() {
    isPlaying = false;
    stopArpeggio();
});

function playArpeggio() {
    const scaleType = document.getElementById('scaleType').value;
    const patternType = document.getElementById('patternType').value;
    const waveformType = document.getElementById('oscillatorType').value;
    const bpm = parseInt(document.getElementById('tempoSlider').value);
    const noteDuration = (60 / bpm) * 1000; // Duration of each note in milliseconds

    const frequencies = calculateFrequencies(scaleType);
    const noteOrder = getOrder(patternType, frequencies.length);

    let noteIndex = 0;

    function scheduleNextNote() {
        if (!isPlaying) return;
        const realNoteIndex = noteOrder[noteIndex % noteOrder.length];
        const frequency = frequencies[realNoteIndex];
        const oscillator = createOscillator(frequency, waveformType);
        oscillator.start();
        setTimeout(() => oscillator.stop(), noteDuration);

        noteIndex++;
        setTimeout(scheduleNextNote, noteDuration);
    }

    scheduleNextNote();
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
    const baseFrequency = 261.63; // C4, Middle C
    switch (scale) {
        case 'major':
            return [baseFrequency, baseFrequency * Math.pow(2, 2/12), baseFrequency * Math.pow(2, 4/12), baseFrequency * Math.pow(2, 5/12), baseFrequency * Math.pow(2, 7/12), baseFrequency * Math.pow(2, 9/12), baseFrequency * Math.pow(2, 11/12), baseFrequency * 2];
        case 'minor':
            return [baseFrequency, baseFrequency * Math.pow(2, 2/12), baseFrequency * Math.pow(2, 3/12), baseFrequency * Math.pow(2, 5/12), baseFrequency * Math.pow(2, 7/12), baseFrequency * Math.pow(2, 8/12), baseFrequency * Math.pow(2, 10/12), baseFrequency * 2];
        // Add more scales as needed
        default:
            return [baseFrequency, baseFrequency * Math.pow(2, 2/12), baseFrequency * Math.pow(2, 4/12), baseFrequency * Math.pow(2, 5/12), baseFrequency * Math.pow(2, 7/12), baseFrequency * Math.pow(2, 9/12), baseFrequency * Math.pow(2, 11/12), baseFrequency * 2];
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
    isPlaying = false;
    activeOscillators.forEach(osc => osc.stop());
    activeOscillators = [];
}
