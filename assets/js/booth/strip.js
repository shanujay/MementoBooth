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


    // Draw stickers first (below the text layer)
    editorState.stickers.forEach(sticker=>{

        if(sticker.img && sticker.img.complete){

            editorCtx.drawImage(
                sticker.img,
                sticker.x,
                sticker.y,
                sticker.width,
                sticker.height
            );

        }

    });


    editorCtx.textAlign = "center";


    editorState.texts.forEach(text=>{

        editorCtx.font = "40px " + (text.font || defaultTextFont);

        editorCtx.fillStyle = text.color || defaultTextColor;

        editorCtx.fillText(
            text.content,
            text.x,
            text.y
        );

    });


    // Draw the close (delete) button for the currently selected text
    if(activeText){

        drawCloseButton(getTextCloseButton(activeText));

    }


    // Draw the close (delete) button for the currently selected sticker
    if(activeSticker){

        drawCloseButton(getStickerCloseButton(activeSticker));

    }

}


// Draws a red circular close button with a white "X"
function drawCloseButton(btn){

    // Red circle
    editorCtx.beginPath();
    editorCtx.arc(btn.cx, btn.cy, btn.r, 0, Math.PI * 2);
    editorCtx.fillStyle = "#ff4d4d";
    editorCtx.fill();

    // White "X"
    editorCtx.strokeStyle = "#ffffff";
    editorCtx.lineWidth = 3;

    const o = btn.r * 0.45;

    editorCtx.beginPath();
    editorCtx.moveTo(btn.cx - o, btn.cy - o);
    editorCtx.lineTo(btn.cx + o, btn.cy + o);
    editorCtx.moveTo(btn.cx + o, btn.cy - o);
    editorCtx.lineTo(btn.cx - o, btn.cy + o);
    editorCtx.stroke();

}


// Returns the close button geometry for a sticker (top-right corner)
function getStickerCloseButton(sticker){

    return {
        cx: sticker.x + sticker.width,
        cy: sticker.y,
        r: stickerCloseRadius
    };

}


// Returns the close button geometry for a text (top-right corner of its box)
function getTextCloseButton(text){

    editorCtx.font = "40px " + (text.font || defaultTextFont);

    const textWidth = editorCtx.measureText(text.content).width;

    return {
        cx: text.x + textWidth / 2,
        cy: text.y - 40,
        r: textCloseRadius
    };

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

    // Deselect so the sticker close button isn't drawn into the download
    activeSticker = null;
    activeText = null;
    drawTextOnTop();

    // Merge the base canvas (photos + frame) with the editor overlay (text)
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;

    const mergedCtx = mergedCanvas.getContext("2d");
    mergedCtx.drawImage(canvas, 0, 0);
    mergedCtx.drawImage(editorCanvas, 0, 0);

    const link = document.createElement("a");
    link.href = mergedCanvas.toDataURL("image/png");
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
