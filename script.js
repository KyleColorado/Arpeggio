document.addEventListener('DOMContentLoaded', function() {
    // Update the tempo value immediately
    const tempoSlider = document.getElementById('tempo');
    const tempoValueDisplay = document.getElementById('tempoValue');
    tempoValueDisplay.textContent = tempoSlider.value; // Display the default slider value

    // Event listener for tempo changes
    tempoSlider.oninput = function() {
        tempoValueDisplay.textContent = this.value;
    }

    // Event listener for play button
    document.getElementById('playButton').addEventListener('click', function() {
        playArpeggio();
    });
});

function playArpeggio() {
    // Retrieve user selections
    const tempo = document.getElementById('tempo').value;
    const key = document.getElementById('keySelect').value;
    const scale = document.getElementById('scaleSelect').value;
    const direction = document.getElementById('directionSelect').value;

    // Logging to console for testing (replace this with actual sound generation code)
    console.log(`Playing arpeggio in key: ${key}, scale/mode: ${scale}, direction: ${direction} at ${tempo} BPM`);

    // This is where you would integrate with a sound library or the Web Audio API to generate and play the notes
    // For now, this is just a placeholder to show the structure
}

