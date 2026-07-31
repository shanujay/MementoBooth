// Hide Camera UI
function hideCameraUI() {
    video.classList.add("hidden");
    photoCountDisplay.classList.add("hidden");
}

// Show Camera UI
function showCameraUI() {
    hidePhotoPreviewViewer();
    video.classList.remove("hidden");
    photoCountDisplay.classList.remove("hidden");
}

// Start Camera 
function startCamera() {
    navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
    })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error("Error accessing webcam:", error);
        alert("Please allow camera access.");
    });

    // Removing Hidden Class
    takeSnapBtn.classList.remove("hidden");
}

// Stop Camera
function stopCamera() {
    const stream = video.srcObject;

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
}
