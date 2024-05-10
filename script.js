// Creating the Web Audio API context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function createOscillator(freq) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    return oscillator;
}

function getFrequency(note, octave) {
    return 440 * Math.pow(2, (note + octave * 12 - 69) / 12);
}

function getScaleNotes(baseFreq, scale) {
    const scales = {
        major: [0, 2, 4, 5, 7, 9, 11, 12],
        minor: [0, 2, 3, 5, 7, 8, 10, 12],
        dorian: [0, 2, 3, 5, 7, 9, 10, 12],
        phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
        lydian: [0, 2, 4, 6, 7, 9, 11, 12],
        mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
        aeolian: [0, 2, 3, 5, 7, 8, 10, 12],
        locrian: [0, 1, 3, 5, 6, 8, 10, 12],
        arabian: [0, 2, 4, 5, 6, 8, 10, 12],
        hungarianMinor: [0, 2, 3, 6, 7, 8, 11, 12]
    };
    return scales[scale].map(step => baseFreq * Math.pow(2, step / 12));
}

function playArpeggio() {
    const keyIndex = document.getElementById('keySelect').selectedIndex;
    const scaleType = document.getElementById('scaleSelect').value;
    const pattern = document.getElementById('patternSelect').value;
    const tempo = parseInt(document.getElementById('tempo').value, 10);
    const baseFrequency = getFrequency(keyIndex, 4); // Assuming 4th octave
    const notes = getScaleNotes(baseFrequency, scaleType);
    let noteIndex = 0;

    const playNote = () => {
        if (noteIndex < notes.length) {
            const oscillator = createOscillator(notes[noteIndex]);
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                noteIndex++;
                playNote(); // Recursively play the next note
            }, 60000 / tempo);
        } else {
            noteIndex = 0; // Reset note index for continuous play
            if (document.getElementById('playButton').clicked) {
                playNote(); // Loop
            }
        }
    };

    playNote();
}

function stopArpeggio() {
    // Stopping the audio context or any other necessary clean-up
    audioContext.close().then(() => {
        console.log('Arpeggio stopped and audio context closed.');
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    });
}

document.getElementById('playButton').addEventListener('click', function() {
    this.clicked = true;
    playArpeggio();
});

document.getElementById('stopButton').addEventListener('click', function() {
    document.getElementById('playButton').clicked = false;
    stopArpeggio();
});
