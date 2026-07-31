// Capture Photos
takeSnapBtn.addEventListener("click", async () => {
    takeSnapBtn.classList.add("hidden"); 

    // If Retaking
    if (isRetaking) {

        await startCountdown(3);

        cameraSound.play();

        await capturePhotoExactSize(
            selectedLayout.photoWidth,
            selectedLayout.photoHeight
        );

        isRetaking = false;

        takeSnapBtn.classList.add("hidden");
        stopCamera();

        console.log("Before review:", reviewIndex);
        showPhotoReview();

        return;
    }

    // If Retaking All Photos
    if (isRetakingAll) {
        photos = [];
        clearCapturedPhotosPreview();
    
        for (let photoCount = 1; photoCount <= selectedPhotoCount; photoCount++) {
    
            photoCountDisplay.textContent =
                `Photo ${photoCount} of ${selectedPhotoCount}`;
    
            await startCountdown(3);
    
            cameraSound.play();
    
            await capturePhotoExactSize(
                selectedLayout.photoWidth,
                selectedLayout.photoHeight
            );
    
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    
        isRetakingAll = false;
    
        takeSnapBtn.classList.add("hidden");
        stopCamera();
        showPhotoReview();
    
        return;
    }

    let photoCount = 1;
    photos = [];
    clearCapturedPhotosPreview();

    while (photoCount <= selectedPhotoCount) {
        photoCountDisplay.textContent = `Photo ${photoCount} of ${selectedPhotoCount}`;

        await startCountdown(3);
        
        // Play camera sound
        cameraSound.play();

        await capturePhotoExactSize(
            selectedLayout.photoWidth,
            selectedLayout.photoHeight
        );
        console.log(`Captured photo ${photoCount}`);
        photoCount++;

        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log("All photos captured:", photos);

    reviewIndex = 0;

    takeSnapBtn.classList.add("hidden");

    stopCamera();

    showPhotoReview();
});


takeSnapBtn.addEventListener("click", function () {
    clickSound.play();
})

// Function to capture photo with exact size
async function capturePhotoExactSize(width, height) {
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");

    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;

    let aspectRatioVideo = videoWidth / videoHeight;
    let aspectRatioTarget = width / height;

    let sx, sy, sWidth, sHeight;

    if (aspectRatioVideo > aspectRatioTarget) {
        sHeight = videoHeight;
        sWidth = sHeight * aspectRatioTarget;
        sx = (videoWidth - sWidth) / 2;
        sy = 0;
    } else {
        sWidth = videoWidth;
        sHeight = sWidth / aspectRatioTarget;
        sx = 0;
        sy = (videoHeight - sHeight) / 2;
    }

    tempCanvas.width = width;
    tempCanvas.height = height;

    tempCtx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        width,
        height
    );

    let imageDataUrl = tempCanvas.toDataURL("image/png");

    if (isRetaking && reviewIndex !== null) {
        photos[reviewIndex] = imageDataUrl;
        isRetaking = false;
    } else {
        photos.push(imageDataUrl);
    }

    renderCapturedPhotosPreview();
}
