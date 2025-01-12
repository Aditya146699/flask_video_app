const video = document.getElementById('video');
const playPauseButton = document.getElementById('playPause');
const stopButton = document.getElementById('stop');
const muteButton = document.getElementById('mute');
const fullscreenButton = document.getElementById('fullscreen');
const volumeSlider = document.getElementById('volume');
const filterSelect = document.getElementById('filter');
const playbackRateSelect = document.getElementById('playbackRate');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const controls = document.getElementById('controls');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const settingsButton = document.getElementById('settings');
const settingsMenu = document.getElementById('settings-menu');
const pictureInPictureButton = document.getElementById('picture-in-picture');
const loadingIndicator = document.getElementById('loading');

let controlsTimeout;

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to show controls
// const showControls = () => {
//     controls.classList.remove('hidden');
//     clearTimeout(controlsTimeout);
//     controlsTimeout = setTimeout(() => {
//         controls.classList.add('hidden');
//     }, 3000);
// };
// Function to show controls
const showControls = () => {
    controls.classList.remove('hidden');
    document.querySelector('.T-vid').style.display= 'flex';
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
        controls.classList.add('hidden');
        document.querySelector('.T-vid').style.display= 'none';
    }, 3000);
};



// Play/Pause function
playPauseButton.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPauseButton.innerHTML = '<i class="vjs-icon-pause"></i>';
    } else {
        video.pause();
        playPauseButton.innerHTML = '<i class="vjs-icon-play"></i>';
    }
    showControls();
});

// Stop function
stopButton.addEventListener('click', () => {
    video.pause();
    video.currentTime = 0;
    playPauseButton.innerHTML = '<i class="vjs-icon-play"></i>';
    showControls();
});

// Mute/Unmute function
muteButton.addEventListener('click', () => {
    video.muted = !video.muted;
    muteButton.innerHTML = video.muted ? '<i class="vjs-icon-volume-mute"></i>' : '<i class="vjs-icon-volume-high"></i>';
    showControls();
});

// Fullscreen function with exit capability
fullscreenButton.addEventListener('click', () => {
    const videoPlayer = document.querySelector('.video-player');
    if (!document.fullscreenElement) {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
        }
        fullscreenButton.innerHTML = '<i class="vjs-icon-fullscreen-exit"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            videoPlayer.webkitExitFullscreen();
        } else if (videoPlayer.msExitFullscreen) {
            videoPlayer.msExitFullscreen();
        }
        fullscreenButton.innerHTML = '<i class="vjs-icon-fullscreen-enter"></i>';
    }
    showControls();
});

// Volume control
volumeSlider.addEventListener('input', (event) => {
    video.volume = event.target.value;
    muteButton.innerHTML = video.volume === 0 ? '<i class="vjs-icon-volume-mute"></i>' : '<i class="vjs-icon-volume-high"></i>';
    showControls();
});

// Filter function
filterSelect.addEventListener('change', (event) => {
    video.style.filter = event.target.value;
    showControls();
});

// Playback rate control
playbackRateSelect.addEventListener('change', (event) => {
    video.playbackRate = parseFloat(event.target.value);
    showControls();
});

// Update progress bar and time displays
video.addEventListener('timeupdate', () => {
    const percentage = (video.currentTime / video.duration) * 100;
    progress.style.width = percentage + '%';
    currentTimeDisplay.textContent = formatTime(video.currentTime);
});

// Set duration when metadata is loaded
video.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(video.duration);
});

// Seek video on progress bar click
progressBar.addEventListener('click', (event) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
    showControls();
});

// Show loading icon while buffering
video.addEventListener('waiting', () => {
    loadingIndicator.style.display = 'block';
});

video.addEventListener('playing', () => {
    loadingIndicator.style.display = 'none';
});

// Mouse move event to show controls
video.addEventListener('mousemove', showControls);

// Settings dropdown toggle
settingsButton.addEventListener('click', () => {
    settingsMenu.classList.toggle('show');
    showControls();
});

// Close settings menu when clicking outside
document.addEventListener('click', (event) => {
    if (!settingsButton.contains(event.target) && !settingsMenu.contains(event.target)) {
        settingsMenu.classList.remove('show');
    }
});

// Picture-in-Picture functionality
pictureInPictureButton.addEventListener('click', async () => {
    if (document.pictureInPictureElement) {
        pictureInPictureButton.innerHTML=`<i class="vjs-icon-picture-in-picture-enter"></i>`
        await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
        pictureInPictureButton.innerHTML=`<i class="vjs-icon-picture-in-picture-exit"></i>`
        await video.requestPictureInPicture();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

    switch (event.key) {
        case ' ':
            playPauseButton.click();
            event.preventDefault();
            showControls();
            break;
        case 'm':
            muteButton.click();
            showControls();
            break;
        case 'f':
            fullscreenButton.click();
            showControls();
            break;
        case 'ArrowRight':
            video.currentTime += 5;
            break;
        case 'ArrowLeft':
            video.currentTime -= 5;
            break;
        case 'b':
            window.history.back()
            break;
        }
});
video.addEventListener('click', async () => {
    playPauseButton.click();
    event.preventDefault();
    showControls();
});

video.addEventListener('dblclick', async () => {
    fullscreenButton.click();
    showControls();
    
});

// Reset play button when video ends
video.addEventListener('ended', () => {
    playPauseButton.innerHTML = '<i class="vjs-icon-play"></i>';
});

// Handle fullscreen change to show/hide controls
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        controls.classList.remove('hidden');
        fullscreenButton.innerHTML = '<i class="vjs-icon-fullscreen-enter"></i>';
    } else {
        showControls();
        fullscreenButton.innerHTML = '<i class="vjs-icon-fullscreen-exit"></i>';
    }
});

// Handle file selection
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        video.src = fileURL;
        video.play();
        playPauseButton.innerHTML = '<i class="vjs-icon-pause"></i>';
        showControls();
    }
});
