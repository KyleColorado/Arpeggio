// Audio context initialization
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let arpeggioInterval;

// Function to play a frequency with a specific duration
function playFrequency(freq, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration - 0.01);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// Musical scales definitions including modes and exotic scales
const scales = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    aeolian: [0, 2, 3, 5, 7, 8, 10], // same as natural minor
    locrian: [0, 1, 3, 5, 6, 8, 10],
    arabian: [0, 2, 3, 5, 6, 8, 9, 11],
    hungarianMinor: [0, 2, 3, 6, 7, 8, 11]
};

// Function to play the arpeggio based on selected pattern
function playArpeggio(pattern, notes, noteDuration) {
    clearInterval(arpeggioInterval);
    let noteIndex = 0;
    arpeggioInterval = setInterval(() => {
        if (pattern === 'up') {
            playFrequency(notes[noteIndex % notes.length], noteDuration);
            noteIndex++;
        } else if (pattern === 'down') {
            playFrequency(notes[notes.length - 1 - (noteIndex % notes.length)], noteDuration);
            noteIndex++;
        } else if (pattern === 'upDown') {
            const index = noteIndex % (notes.length * 2 - 2);
            const adjustedIndex = index < notes.length ? index : 2 * notes.length - 2 - index;
            playFrequency(notes[adjustedIndex], noteDuration);
            noteIndex++;
        } else if (pattern === 'random') {
            playFrequency(notes[Math.floor(Math.random() * notes.length)], noteDuration);
        }
    }, noteDuration * 1000);
}

// Start playing based on UI selections
function startArpeggio() {
    const tempo = parseInt(document.getElementById('tempo').value);
    const key = document.getElementById('keySelect').value;
    const scale = document.getElementById('scaleSelect').value;
    const pattern = document.getElementById('patternSelect').value;
    const notes = generateNotes(key, scale);
    const noteDuration = 60 / tempo; // duration in seconds
    playArpeggio(pattern, notes, noteDuration);
}

// Stop playing
function stopArpeggio() {
    clearInterval(arpeggioInterval);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('playButton').addEventListener('click', startArpeggio);
    document.getElementById('stopButton').addEventListener('click', stopArpeggio);
});
