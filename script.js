const screenVideo = document.getElementById('screenVideo');
const recordedVideo = document.getElementById('recordedVideo');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const downloadButton = document.getElementById('download');

let mediaRecorder;
let recordedChunks = [];

// Function to start screen recording
async function startRecording() {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        });

        screenVideo.srcObject = screenStream;

        mediaRecorder = new MediaRecorder(screenStream);
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            recordedVideo.src = url;
            recordedVideo.style.display = 'block';
            downloadButton.href = url;
            downloadButton.download = 'screen-recording.webm';
            downloadButton.disabled = false;
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    } catch (err) {
        console.error('Error: ', err);
        alert('Failed to capture screen. Please ensure you have granted the necessary permissions.');
    }
}

// Function to stop screen recording
function stopRecording() {
    mediaRecorder.stop();
    screenVideo.srcObject.getTracks().forEach(track => track.stop());
    startButton.disabled = false;
    stopButton.disabled = true;
}

// Event listeners for buttons
startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
