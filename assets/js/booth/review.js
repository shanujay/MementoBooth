function clearCapturedPhotosPreview() {

    if (!capturedPhotosPreview) return;

    capturedPhotosPreview.innerHTML = "";
    capturedPhotosPreview.classList.add("hidden");

}

function hidePhotoPreviewViewer() {

    if (!photoPreview) return;

    photoPreview.classList.add("hidden");
    photoPreview.removeAttribute("src");

}

function showPhotoPreviewViewer(index) {

    if (!photoPreview || !photos[index]) return;

    reviewIndex = index;

    video.classList.add("hidden");
    photoPreview.src = photos[index];
    photoPreview.classList.remove("hidden");

    capturedPhotosPreview.querySelectorAll(".captured-photo-thumb").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === reviewIndex);
    });

}

function renderCapturedPhotosPreview() {

    if (!capturedPhotosPreview) return;

    capturedPhotosPreview.innerHTML = "";

    photos.forEach((photo, index) => {

        const img = document.createElement("img");

        img.src = photo;
        img.classList.add("captured-photo-thumb");
        img.alt = `Captured photo ${index + 1}`;

        if (inPhotoReview) {
            img.classList.add("captured-photo-thumb--selectable");
            img.classList.toggle("active", index === reviewIndex);

            img.addEventListener("click", () => {
                clickSound.play();
                showPhotoPreviewViewer(index);
            });
        }

        capturedPhotosPreview.appendChild(img);

    });

    if (photos.length > 0) {
        capturedPhotosPreview.classList.remove("hidden");
    } else {
        capturedPhotosPreview.classList.add("hidden");
    }

}

function showPhotoReview() {

    inPhotoReview = true;

    stopCamera();
    photoCountDisplay.classList.add("hidden");
    takeSnapBtn.classList.add("hidden");

    renderCapturedPhotosPreview();
    showPhotoPreviewViewer(reviewIndex);

    if (captureReviewActions) {
        captureReviewActions.classList.remove("hidden");
    }

}

function exitPhotoReview() {

    inPhotoReview = false;

    hidePhotoPreviewViewer();

    if (captureReviewActions) {
        captureReviewActions.classList.add("hidden");
    }

}

// Confirm Review
confirmReview.addEventListener("click", () => {

    exitPhotoReview();
    photoBooth.classList.add("hidden");

    showEditorUI();
    generatePhotoStrip();

});

// Retake Review
retakeReview.addEventListener("click", async () => {

    exitPhotoReview();
    isRetaking = true;

    renderCapturedPhotosPreview();

    await startCamera();
    showCameraUI();
    takeSnapBtn.classList.remove("hidden");

});

// Retake All Photos
retakeAll.addEventListener("click", async () => {

    exitPhotoReview();
    isRetakingAll = true;

    clearCapturedPhotosPreview();

    await startCamera();
    showCameraUI();
    takeSnapBtn.classList.remove("hidden");

});
