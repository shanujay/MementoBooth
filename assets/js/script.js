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

// Retake Button
const retakeBtn = document.getElementById("retakeBtn");
const retakePopup = document.getElementById("retakePopup");
const cancelRetake = document.getElementById("cancelRetake");
const confirmRetake = document.getElementById("confirmRetake");

// Countdown Display
const countdown = document.getElementById("countdown");


let selectedFrame = "";
let selectedPhotoCount = 3;
let photos = [];

// Load Frame Templates
let categories = [];

let layouts = {};
let selectedLayout = {};

Promise.all([
    fetch("assets/data/layouts.json").then(response => response.json()),
    fetch("assets/data/categories.json").then(response => response.json())
])
.then(([layoutData, categoryData]) => {

    layouts = layoutData;

    categories = categoryData;

    displayCategories();

})
.catch(error => {

    console.error("Error loading data:", error);

});


function displayCategories(){

    frameTitle.textContent = "Choose Your Theme";

    frameCategories.innerHTML = "";


    categories.forEach(category => {


        const card = document.createElement("div");

        card.classList.add("category-card");


        card.innerHTML = `

            <img src="${category.thumbnail}">

            <p>${category.name}</p>

        `;


        card.addEventListener("click",()=>{

            loadFrames(category);

        });


        frameCategories.appendChild(card);


    });

}

function loadFrames(category){

    fetch(`assets/data/frames/${category.frameFile}`)
    .then(response => response.json())
    .then(frames => {

        displayFrames(frames, category.name);

    })
    .catch(error => {

        console.error("Error loading frames:", error);

    });

}

function displayFrames(frames, categoryName){

    frameTitle.textContent = `${categoryName} Frames`;

    framesContainer.innerHTML = "";


    // Hide categories
    frameCategories.classList.add("hidden");


    // Show frames
    framesContainer.classList.remove("hidden");


    // Show back button
    backToCategories.classList.remove("hidden")


    frames.forEach(frame=>{


        const img = document.createElement("img");

        img.src = frame.image;

        img.classList.add("frame-option");

        img.dataset.frame = frame.image;


        img.addEventListener("click",()=>{

            selectedFrame = frame.image;
        
            selectedPhotoCount = frame.photoCount;
        
            selectedLayout = layouts[frame.layout];
        
            console.log("Selected Frame:", selectedFrame);
            console.log("Photo Count:", selectedPhotoCount);
            console.log("Selected Layout:", selectedLayout);
        
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
    previewTitle.textContent = `${frame.name} (${frame.photoCount} Photos - ${frame.layoutId})`;

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

    backToCategories.classList.remove("hidden");

});

// Countdown
function startCountdown(seconds){

    return new Promise(resolve=>{

        let count = seconds;


        countdown.classList.remove("hidden");

        countdown.textContent = count;


        const timer = setInterval(()=>{


            count--;


            if(count === 0){

                clearInterval(timer);

                countdown.classList.add("hidden");

                resolve();

            }
            else{

                countdown.textContent = count;

            }


        },1000);


    });

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

// Capture Photos
takeSnapBtn.addEventListener("click", async () => {
    takeSnapBtn.classList.add("hidden"); 
    let photoCount = 1;
    photos = [];

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

    // Removing Hidden Class
    video.classList.add("hidden");
    photoCountDisplay.classList.add("hidden");
    photoStripContainer.classList.remove("hidden");
    stripDownload.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
    girlImg.classList.remove("hidden");
    downloadInfo.classList.remove("hidden");
    retakeBtn.classList.remove("hidden");

    generatePhotoStrip();
});


takeSnapBtn.addEventListener("click", function () {
    clickSound.play();
})

// Download Button
downloadBtn.addEventListener("click", function () {
    clickSound.play();
})

// Retake Button
retakeBtn.addEventListener("click",()=>{

    clickSound.play();

    retakePopup.classList.remove("hidden");

});

// confirm retake
confirmRetake.addEventListener("click",()=>{


    retakePopup.classList.add("hidden");


    // Clear photos
    photos = [];


    // Hide result section
    stripDownload.classList.add("hidden");
    photoStripContainer.classList.add("hidden");

    downloadBtn.classList.add("hidden");
    retakeBtn.classList.add("hidden");
    downloadInfo.classList.add("hidden");

    girlImg.classList.add("hidden");


    // Clear canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Show camera
    photoBooth.classList.remove("hidden");

    video.classList.remove("hidden");

    photoCountDisplay.classList.remove("hidden");


    takeSnapBtn.classList.remove("hidden");


});

// cancel retake
cancelRetake.addEventListener("click",()=>{

    retakePopup.classList.add("hidden");

});

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

    if(!selectedLayout){
        console.error("No layout selected");
        return;
    }

    const canvasWidth = selectedLayout.canvasWidth;

    const photoWidth = selectedLayout.photoWidth;
    const photoHeight = selectedLayout.photoHeight;

    const spacing = selectedLayout.spacing;

    const paddingTop = selectedLayout.paddingTop;
    const paddingLeft = selectedLayout.paddingLeft;


    const canvasHeight =
        paddingTop +
        (photoHeight * selectedPhotoCount) +
        (spacing * (selectedPhotoCount - 1)) +
        paddingTop;


    canvas.width = canvasWidth;
    canvas.height = canvasHeight;


    let yOffset = paddingTop;

    let loadedPhotos = 0;


    photos.forEach((photo)=>{

        const img = new Image();

        img.src = photo;


        img.onload = ()=>{

            ctx.drawImage(
                img,
                paddingLeft,
                yOffset,
                photoWidth,
                photoHeight
            );


            yOffset += photoHeight + spacing;


            loadedPhotos++;


            if(loadedPhotos === photos.length){

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
