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

// Category Buttons
const backToCategories = document.getElementById("backToCategories");
const frameCategories = document.getElementById("frameCategories");
const framesContainer = document.getElementById("framesContainer");
const frameTitle = document.getElementById("frameTitle");

// Frame Preview
const framePreview = document.getElementById("framePreview");
const previewTitle = document.getElementById("previewTitle");
const previewFrameImage = document.getElementById("previewFrameImage");
const cancelFrame = document.getElementById("cancelFrame");
const confirmFrame = document.getElementById("confirmFrame");

let templates = [];

let selectedFrame = "";
let photos = [];

// Load Frame Templates

fetch("assets/data/templates.json")
.then(response => response.json())
.then(data => {

    templates = data.categories;

    displayCategories();

})
.catch(error => {

    console.error("Error loading templates:", error);

});

function displayCategories(){

    frameTitle.textContent = "Choose Your Theme";

    frameCategories.innerHTML = "";


    templates.forEach(category => {


        const card = document.createElement("div");

        card.classList.add("category-card");


        card.innerHTML = `

            <img src="${category.thumbnail}">

            <p>${category.name}</p>

        `;


        card.addEventListener("click",()=>{

            displayFrames(category);

        });


        frameCategories.appendChild(card);


    });

}

function displayFrames(category){

    frameTitle.textContent = `${category.name} Frames`;

    framesContainer.innerHTML = "";


    // Hide categories
    frameCategories.classList.add("hidden");


    // Show frames
    framesContainer.classList.remove("hidden");


    // Show back button
    backToCategories.classList.remove("hidden");


    category.frames.forEach(frame => {


        const img = document.createElement("img");

        img.src = frame.image;

        img.classList.add("frame-option");

        img.dataset.frame = frame.image;


        img.addEventListener("click",()=>{

            hoverSound.play();
        
            showFramePreview(frame);
        
        });


        framesContainer.appendChild(img);


    });

}

backToCategories.addEventListener("click",()=>{


    framesContainer.classList.add("hidden");

    frameCategories.classList.remove("hidden");

    backToCategories.classList.add("hidden");


    frameTitle.textContent = "Choose Your Theme";

});

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

// Show Frame Preview
function showFramePreview(frame) {

    selectedFrame = frame.image;


    // Hide frame selection
    frameCategories.classList.add("hidden");
    framesContainer.classList.add("hidden");


    // Show preview
    framePreview.classList.remove("hidden");


    // Add frame details
    previewTitle.textContent = frame.name;

    previewFrameImage.src = frame.image;

}

// Confirm Frame
confirmFrame.addEventListener("click",()=>{


    framePreview.classList.add("hidden");


    templateSelection.classList.add("hidden");


    photoBooth.classList.remove("hidden");


    startCamera();


});

// Cancel Frame
cancelFrame.addEventListener("click",()=>{


    framePreview.classList.add("hidden");


    framesContainer.classList.remove("hidden");


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
    frameImg.src = selectedFrame;

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
