// Select elements
const video = document.getElementById("video");
const takeSnapBtn = document.getElementById("takeSnapBtn");
const photoCountDisplay = document.getElementById("photoCountDisplay");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("download");
const templateSelection = document.getElementById("templateSelection");
const photoBooth = document.getElementById("photoBooth");
const photoStripContainer = document.getElementById("photoStripContainer");
const stripDownload = document.getElementById("stripDownload");
const hoverSound = document.getElementById("hoverSound");
const clickSound = document.getElementById("clickSound");
const cameraSound = document.getElementById("cameraSound");
const girlImg = document.getElementById("girlImg");
const downloadInfo = document.getElementById("downloadInfo");
const thanksImage = document.getElementById("thanksImage");
const girlImg2 = document.getElementById("girlImg2");

let selectedFrame = "";
let photos = [];

// Frame selection
document.querySelectorAll(".frame-option").forEach(frame => {
    frame.addEventListener("click", function () {
        selectedFrame = this.getAttribute("data-frame");
        hoverSound.play();
        templateSelection.classList.add("hidden");
        photoBooth.classList.remove("hidden");
        startCamera();
    });
});

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

// Capture Photos
takeSnapBtn.addEventListener("click", async () => {
    takeSnapBtn.classList.add("hidden"); 
    let photoCount = 1;
    photos = [];

    while (photoCount <= 3) {
        photoCountDisplay.textContent = `Taking Photo ${photoCount} of 3...`;
        
        // Play camera sound
        cameraSound.play();

        await capturePhotoExactSize(400, 550);
        console.log(`Captured photo ${photoCount}`);
        photoCount++;

        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log("All photos captured:", photos);

    // Removing Hidden Class
    video.classList.add("hidden");
    photoCountDisplay.classList.add("hidden");
    photoStripContainer.classList.remove("hidden");
    stripDownload.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
    girlImg.classList.remove("hidden");
    downloadInfo.classList.remove("hidden");

    generatePhotoStrip();
});


takeSnapBtn.addEventListener("click", function () {
    clickSound.play();
})

downloadBtn.addEventListener("click", function () {
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

    tempCtx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);

    let imageDataUrl = tempCanvas.toDataURL("image/png");
    photos.push(imageDataUrl);
}

// Generate Final Strip
function generatePhotoStrip() {
    const canvasWidth = 400 + 100;
    const canvasHeight = 550 * 3 + 50 * 2 + 200;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let yOffset = 40;

    const photoWidth = 400;
    const photoHeight = 550;

    let loadedPhotos = 0;

    photos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo;

        img.onload = () => {
            ctx.drawImage(img, 50, yOffset, photoWidth, photoHeight);
            yOffset += photoHeight + 40;

            loadedPhotos++;

            if (loadedPhotos === photos.length) {
                drawFrameOnTop();
            }
        };
    });
}

// Function to draw the selected frame on top of the photos
function drawFrameOnTop() {
    const frameImg = new Image();
    frameImg.crossOrigin = "anonymous";
    frameImg.src = `assets/template/${selectedFrame}`;

    frameImg.onload = () => {
        console.log("Frame loaded successfully");
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        downloadBtn.classList.remove("hidden");
        console.log("Download button should be visible now");
    };

    frameImg.onerror = () => {
        console.error("Failed to load frame image. Check the file path.");
        downloadBtn.classList.remove("hidden"); 
    };

    document.getElementById("download").style.display = "block";
    document.getElementById("download").classList.remove("hidden");
    document.getElementById("downloadContainer").classList.remove("hidden");
    console.log("Download button should be visible now");

}

// Download Photo Strip
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "photo_strip.png";
    link.click();

    setTimeout(() => {
        stripDownload.classList.add("hidden");
        photoStripContainer.classList.add("hidden");
        downloadContainer.classList.add("hidden");
        girlImg.classList.add("hidden");
        thanksImage.classList.remove("hidden");
        girlImg2.classList.remove("hidden");
    }, 1000);

    setTimeout(() => {
        window.location.href = "index.html";
    }, 20000);
});
