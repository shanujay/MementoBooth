// Download Button
downloadBtn.addEventListener("click", function () {
    clickSound.play();
})

// Draw Text on Top
function drawTextOnTop(){

    if(editorState.texts.length === 0){
        return;
    }


    ctx.font = "40px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";


    editorState.texts.forEach(text => {

        let x = canvas.width / 2;
        let y;


        if(text.position === "top"){

            y = 80;

        }
        else if(text.position === "bottom"){

            y = canvas.height - 50;

        }


        ctx.fillText(
            text.content,
            x,
            y
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

    const frameImg = new Image();

    frameImg.crossOrigin = "anonymous";

    frameImg.src = selectedFrame;


    frameImg.onload = () => {

        console.log("Frame loaded successfully");


        ctx.drawImage(
            frameImg,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Draw text after frame
        drawTextOnTop();

    };


    frameImg.onerror = () => {

        console.error(
            "Failed to load frame image. Check the file path."
        );

        drawTextOnTop();

    };


    showEditorUI();

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
