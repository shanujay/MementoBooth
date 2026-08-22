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
    // Draw the close (delete) button for the currently selected sticker
    if(stickerArmedForDelete){

        drawCloseButton(getStickerCloseButton(stickerArmedForDelete));

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
function updateStripDisplaySize() {

    if (!selectedLayout) return;

    document.documentElement.style.setProperty(
        "--strip-native-w",
        String(selectedLayout.canvasWidth)
    );
    document.documentElement.style.setProperty(
        "--strip-native-h",
        String(selectedLayout.canvasHeight)
    );

}

function generatePhotoStrip() {

    if(!selectedLayout){
        console.error("No layout selected");
        return;
    }

    updateStripDisplaySize();

    const orientation = selectedLayout.orientation;

    const canvasWidth = selectedLayout.canvasWidth;
    const canvasHeight = selectedLayout.canvasHeight;

    const photoWidth = selectedLayout.photoWidth;
    const photoHeight = selectedLayout.photoHeight;

    const spacing = selectedLayout.spacing;

    const paddingTop = selectedLayout.paddingTop;
    const paddingLeft = selectedLayout.paddingLeft;

    const columns = selectedLayout.columns || 1;


    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    resizeEditorCanvas();


    let loadedPhotos = 0;

    let xOffset = paddingLeft;
    let yOffset = paddingTop;

    let currentColumn = 0;


    const isGridLayout = orientation === "grid";


    photos.forEach((photo) => {

        const img = new Image();

        img.src = photo;


        img.onload = () => {

            ctx.filter = getCanvasFilter();


            if(isGridLayout){

                ctx.drawImage(
                    img,
                    xOffset,
                    yOffset,
                    photoWidth,
                    photoHeight
                );


                currentColumn++;


                // Move to next row
                if(currentColumn >= columns){

                    currentColumn = 0;

                    xOffset = paddingLeft;

                    yOffset += photoHeight + spacing;

                } else {

                    xOffset += photoWidth + spacing;

                }


            } else {

                // Vertical strip
                ctx.drawImage(
                    img,
                    paddingLeft,
                    yOffset,
                    photoWidth,
                    photoHeight
                );

                yOffset += photoHeight + spacing;

            }


            ctx.filter = "none";


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

// Convert a data URL into a Blob (done synchronously to keep the user gesture
// valid for the Web Share API on mobile)
function dataURLToBlob(dataUrl){

    const parts = dataUrl.split(",");

    const mime = parts[0].match(/:(.*?);/)[1];

    const binary = atob(parts[1]);

    const array = new Uint8Array(binary.length);

    for(let i = 0; i < binary.length; i++){
        array[i] = binary.charCodeAt(i);
    }

    return new Blob([array], { type: mime });

}

// Direct file download (used on Android, desktop, and as iOS fallback)
function downloadBlob(blob){

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "photo_strip.png";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

}

// Hide the editor and move on to the thank-you screen
function finishDownloadFlow(){

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

}

// iOS / iPadOS (incl. iPadOS reporting as Mac)
function isIOSDevice(){

    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

}

// Download / Share Photo Strip
downloadBtn.addEventListener("click", async () => {

    // Deselect so the close buttons aren't drawn into the output
    stickerArmedForDelete = null;
    activeText = null;
    drawTextOnTop();

    // Merge the base canvas (photos + frame) with the editor overlay (text + stickers)
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;

    const mergedCtx = mergedCanvas.getContext("2d");
    mergedCtx.drawImage(canvas, 0, 0);
    mergedCtx.drawImage(editorCanvas, 0, 0);

    // Build the PNG blob / file synchronously
    const blob = dataURLToBlob(mergedCanvas.toDataURL("image/png"));
    const file = new File([blob], "photo_strip.png", { type: "image/png" });

    // iOS Safari ignores <a download>, so use the share sheet ("Save to Photos", etc.)
    const canShareFile =
        navigator.canShare && navigator.canShare({ files: [file] });

    if(isIOSDevice() && canShareFile){

        try {

            await navigator.share({
                files: [file],
                title: "My Photo Strip",
                text: "Check out my photo strip!"
            });

            finishDownloadFlow();

        } catch (err) {

            // User cancelled: stay on the editor so they can retry.
            // Any other error: fall back to a direct download.
            if(err && err.name !== "AbortError"){
                downloadBlob(blob);
                finishDownloadFlow();
            }

        }

    }
    else {

        // Android, desktop, and other platforms: direct file download
        downloadBlob(blob);
        finishDownloadFlow();

    }

});
