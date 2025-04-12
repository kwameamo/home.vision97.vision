document.addEventListener('DOMContentLoaded', function() {
    const audioControl = document.getElementById('audioControl');
    const audioOnIcon = document.getElementById('audioOnIcon');
    const audioOffIcon = document.getElementById('audioOffIcon');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    // Check if user previously set a preference
    const audioPreference = localStorage.getItem('audioPreference');
    let audioPlaying = false;
    
    // Function to play audio
    function playAudio() {
        // Create a user interaction promise
        const userInteractionPromise = new Promise((resolve) => {
            // Add a one-time event listener for any user interaction
            const handleUserInteraction = () => {
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
                document.removeEventListener('keydown', handleUserInteraction);
                resolve();
            };
            
            document.addEventListener('click', handleUserInteraction);
            document.addEventListener('touchstart', handleUserInteraction);
            document.addEventListener('keydown', handleUserInteraction);
        });
        
        // When user interacts, play audio if preference is to play
        userInteractionPromise.then(() => {
            if (audioPreference !== 'off') {
                backgroundMusic.play().then(() => {
                    audioPlaying = true;
                    audioOnIcon.style.display = 'block';
                    audioOffIcon.style.display = 'none';
                }).catch(error => {
                    console.error('Audio playback failed:', error);
                    audioPlaying = false;
                    audioOnIcon.style.display = 'none';
                    audioOffIcon.style.display = 'block';
                });
            }
        });
    }
    
    // Initialize based on saved preference
    if (audioPreference === 'off') {
        audioPlaying = false;
        audioOnIcon.style.display = 'none';
        audioOffIcon.style.display = 'block';
    } else {
        playAudio();
    }
    
    // Toggle audio on button click
    audioControl.addEventListener('click', function() {
        if (audioPlaying) {
            backgroundMusic.pause();
            audioPlaying = false;
            audioOnIcon.style.display = 'none';
            audioOffIcon.style.display = 'block';
            localStorage.setItem('audioPreference', 'off');
        } else {
            backgroundMusic.play().then(() => {
                audioPlaying = true;
                audioOnIcon.style.display = 'block';
                audioOffIcon.style.display = 'none';
                localStorage.setItem('audioPreference', 'on');
            }).catch(error => {
                console.error('Audio playback failed:', error);
            });
        }
    });
});