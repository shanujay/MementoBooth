// Download Button
downloadBtn.addEventListener("click", function () {
    clickSound.play();
})

// Draw Text on Top
function drawTextOnTop(){

    editorCtx.clearRect(
        0,
        0,
        editorCanvas.width,
        editorCanvas.height
    );


    editorCtx.font = "40px Arial";
    editorCtx.fillStyle = "#000000";
    editorCtx.textAlign = "center";


    editorState.texts.forEach(text=>{

        editorCtx.fillText(
            text.content,
            text.x,
            text.y
        );

    });

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

    resizeEditorCanvas();


    let yOffset = paddingTop;

    let loadedPhotos = 0;


    photos.forEach((photo)=>{

        const img = new Image();

        img.src = photo;


        img.onload = ()=>{

            ctx.filter = getCanvasFilter();

            ctx.drawImage(
                img,
                paddingLeft,
                yOffset,
                photoWidth,
                photoHeight
            );

            ctx.filter = "none";

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

    if(!loadedFrameImage){

        loadedFrameImage = new Image();

        loadedFrameImage.crossOrigin = "anonymous";

        loadedFrameImage.src = selectedFrame;


        loadedFrameImage.onload = () => {

            ctx.drawImage(
                loadedFrameImage,
                0,
                0,
                canvas.width,
                canvas.height
            );

            drawTextOnTop();

        };

    } 
    else {

        ctx.drawImage(
            loadedFrameImage,
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawTextOnTop();

    }

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
        girlImg.classList.add("hidden");
        thanksImage.classList.remove("hidden");
        girlImg2.classList.remove("hidden");
        hideEditorUI();
    }, 1000);

    setTimeout(() => {
        window.location.href = "index.html";
    }, 20000);
});
