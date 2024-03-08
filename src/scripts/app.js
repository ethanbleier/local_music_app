// Get references to the audio player, playlist, and mixer elements
const audioPlayer = document.getElementById('audio-player');
const playlistElement = document.getElementById('playlist');
const bassSlider = document.getElementById('bass');
const trebleSlider = document.getElementById('treble');

// Create an audio context for the mixer
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();
const bassNode = audioContext.createBiquadFilter();
const trebleNode = audioContext.createBiquadFilter();

// Connect the nodes for the mixer
const audioSource = audioContext.createMediaElementSource(audioPlayer);
audioSource.connect(bassNode);
bassNode.connect(trebleNode);
trebleNode.connect(gainNode);
gainNode.connect(audioContext.destination);

// Set the filter types for bass and treble
bassNode.type = 'lowshelf';
trebleNode.type = 'highshelf';

// Function to load MP3 files from a local folder
function loadMP3Files(folderPath) {
    
    const files = [
        '*.mp3'
        // Add more file paths here
    ];

    // Create playlist items
    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;
        li.addEventListener('click', () => {
            audioPlayer.src = file;
            audioPlayer.play();
        });
        playlistElement.appendChild(li);
    });
}

loadMP3Files('src/assets/audio');

// Event listeners for the mixer sliders
bassSlider.addEventListener('input', () => {
    bassNode.gain.value = bassSlider.value;
});

trebleSlider.addEventListener('input', () => {
    trebleNode.gain.value = trebleSlider.value;
});