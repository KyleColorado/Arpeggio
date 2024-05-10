document.getElementById('tempo').addEventListener('input', function() {
    document.getElementById('tempoValue').textContent = this.value;
});

function playArpeggio() {
    const tempo = document.getElementById('tempo').value;
    const key = document.getElementById('keySelect').value;
    const scale = document.getElementById('scaleSelect').value;
    const direction = document.getElementById('directionSelect').value;

    console.log(`Playing ${scale} in key of ${key} at ${tempo} BPM, direction: ${direction}`);
    // Implement the actual audio generation and playback logic here
}
