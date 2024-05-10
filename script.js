// Audio context initialization
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Function to play a frequency with a specific duration
function playFrequency(freq, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine'; // You can change this to 'square', 'sawtooth', or 'triangle'
    oscillator.frequency.value = freq; // Frequency in hertz
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration - 0.01);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// Function to get frequency from note and octave
function getFrequency(note, octave) {
    const A4 = 440;
    let semitonesFromA4 = (octave - 4) * 12 + note - 9; // A4 is note number 9 in the 4th octave
    return A4 * Math.pow(2, semitonesFromA4 / 12);
}

// Musical scales definitions
const scales = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    // Additional scales can be added here
};

// Generate notes based on key and scale
function generateNotes(key, scale) {
    const rootNote = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(key);
    const scalePattern = scales[scale];
    const notes = scalePattern.map(interval => (rootNote + interval) % 12);
    return notes.map(note => getFrequency(note, 4)); // Assuming octave 4 for simplicity
}

// Main function to play the arpeggio
function playArpeggio() {
    const tempo = parseInt(document.getElementById('tempo').value);
    const key = document.getElementById('keySelect').value;
    const scale = document.getElementById('scaleSelect').value;
    const notes = generateNotes(key, scale);
    const noteDuration = 60 / tempo; // duration of each note in seconds

    notes.forEach((freq, index) => {
        setTimeout(() => {
            playFrequency(freq, noteDuration);
        }, noteDuration * 1000 * index);
    });
}

// Event listeners for document load and play button click
document.addEventListener('DOMContentLoaded', function() {
    const tempoSlider = document.getElementById('tempo');
    const tempoValueDisplay = document.getElementById('tempoValue');
    tempoValueDisplay.textContent = tempoSlider.value; // Display the default slider value

    tempoSlider.oninput = function() {
        tempoValueDisplay.textContent = this.value;
    }

    document.getElementById('playButton').addEventListener('click', playArpeggio);
});
