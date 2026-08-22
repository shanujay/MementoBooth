// Hide Editor UI
function hideEditorUI() {
    stripDownload.classList.add("hidden");
    editorContainer.classList.add("hidden");
    photoStripContainer.classList.add("hidden");
    downloadBtn.classList.add("hidden");
    console.log("Editor UI hidden");
}

// Show Editor UI
function showEditorUI() {
    stripDownload.classList.remove("hidden");
    editorContainer.classList.remove("hidden");
    photoStripContainer.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
    console.log("Editor UI shown");
}

// Filter Tool
filterTool.addEventListener("click",()=>{

    filtersPanel.classList.remove("hidden");
    textPanel.classList.add("hidden");
    stickersPanel.classList.add("hidden");

});

// Load Stickers
async function loadStickers() {
    const panel = document.getElementById('stickersPanel');
    const dataPath = 'assets/data/stickers.json';
    const imgFolder = 'assets/stickers/';

    try {
        const response = await fetch(dataPath);
        if (!response.ok) throw new Error('Could not load stickers.json');

        const stickerFiles = await response.json();

        stickerFiles.forEach((filename, i) => {
            const img = document.createElement('img');
            img.src = imgFolder + filename;
            img.className = 'stickerOption';
            img.dataset.src = imgFolder + filename;
            img.alt = `Sticker ${i + 1}`;
            panel.appendChild(img);
        });
    } catch (err) {
        console.error('Error loading stickers:', err);
    }
}

// Run once on page load
loadStickers();


function resizeEditorCanvas(){

    editorCanvas.width = canvas.width;
    editorCanvas.height = canvas.height;

}

function clearTextLayer(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

function redrawCanvas(){

    canvas.width = canvas.width; // clear canvas

    generatePhotoStrip();

}

function getCanvasPoint(e){

    const rect = editorCanvas.getBoundingClientRect();

    const scaleX = editorCanvas.width / rect.width;
    const scaleY = editorCanvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };

}

// Cancel Long Press
function cancelLongPress(){
    if(longPressTimer){
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    longPressCandidate = null;
    longPressStartPoint = null;
}

// Cancel Text Long Press
function cancelTextLongPress(){
    if(textLongPressTimer){
        clearTimeout(textLongPressTimer);
        textLongPressTimer = null;
    }
    textLongPressCandidate = null;
    textLongPressStartPoint = null;
}

// Stop Dragging
function stopDragging(){

    isDraggingText = false;

    selectedText = null;

    isDraggingSticker = false;

    selectedSticker = null;

}

function getHitPadding(){

    const rect = editorCanvas.getBoundingClientRect();

    if(!rect.width){
        return 0;
    }

    // ~22 CSS pixels of extra grab area, converted into canvas pixels
    return 22 * (editorCanvas.width / rect.width);

}

editorCanvas.addEventListener("pointerdown", (e)=>{

    // Ignore extra fingers / non-primary pointers
    if(!e.isPrimary){
        return;
    }

    e.preventDefault();

    const point = getCanvasPoint(e);

    const mouseX = point.x;
    const mouseY = point.y;
    const pad = getHitPadding();

    try {
        editorCanvas.setPointerCapture(e.pointerId);
    } catch (err) {
        // Some browsers throw if the pointer is already released
    }


    // 0a) If a text is armed for delete, check its delete icon first
    if(textArmedForDelete){

        const btn = getTextCloseButton(textArmedForDelete);

        const dx = mouseX - btn.cx;
        const dy = mouseY - btn.cy;

        if(dx * dx + dy * dy <= (btn.r + pad) * (btn.r + pad)){

            const idx = editorState.texts.indexOf(textArmedForDelete);

            if(idx !== -1){
                editorState.texts.splice(idx, 1);
            }

            textArmedForDelete = null;

            drawTextOnTop();

            console.log("Text deleted");

            return;

        }

        // Tapped somewhere else: dismiss the armed state
        textArmedForDelete = null;

        drawTextOnTop();

    }


    // 0b) If a sticker is selected, check its close (delete) button first
    if(stickerArmedForDelete){

        const btn = getStickerCloseButton(stickerArmedForDelete);

        const dx = mouseX - btn.cx;
        const dy = mouseY - btn.cy;

        if(dx * dx + dy * dy <= (btn.r + pad) * (btn.r + pad)){

            const idx = editorState.stickers.indexOf(stickerArmedForDelete);

            if(idx !== -1){
                editorState.stickers.splice(idx, 1);
            }

            stickerArmedForDelete = null;

            drawTextOnTop();

            console.log("Sticker deleted");

            return;

        }

        // Tapped somewhere else on the canvas: dismiss the armed state
        stickerArmedForDelete = null;

        drawTextOnTop();

    }


    // Clicking deselects any previously active text / sticker
    const hadActive = activeText || activeSticker;

    activeText = null;

    activeSticker = null;


    // 1) Hit-test text first (text is drawn on top of stickers)
    for(let i = editorState.texts.length - 1; i >= 0; i--){

        const text = editorState.texts[i];

        editorCtx.font = "40px " + (text.font || defaultTextFont);

        const textWidth = editorCtx.measureText(text.content).width;

        if(
            mouseX >= text.x - textWidth / 2 - pad &&
            mouseX <= text.x + textWidth / 2 + pad &&
            mouseY >= text.y - 40 - pad &&
            mouseY <= text.y + pad
        ){

            selectedText = text;

            // Sync the color picker / font buttons to this text
            textColor.value = text.color || defaultTextColor;
            setActiveFontButton(text.font || defaultTextFont);

            isDraggingText = true;

            dragOffsetX = mouseX - text.x;
            dragOffsetY = mouseY - text.y;

            // Start long-press timer — if held without much movement, arm delete
            textLongPressCandidate = text;
            textLongPressStartPoint = { x: mouseX, y: mouseY };

            textLongPressTimer = setTimeout(() => {

                if(textLongPressCandidate === text){

                    textArmedForDelete = text;

                    isDraggingText = false;
                    selectedText = null;

                    drawTextOnTop();

                    console.log("Text armed for delete:", text);

                }

            }, LONG_PRESS_DURATION);

            console.log("Selected text:", selectedText);

            return;

        }

    }


    // 2) Hit-test stickers (topmost first)
    for(let i = editorState.stickers.length - 1; i >= 0; i--){

        const sticker = editorState.stickers[i];

        if(
            mouseX >= sticker.x - pad &&
            mouseX <= sticker.x + sticker.width + pad &&
            mouseY >= sticker.y - pad &&
            mouseY <= sticker.y + sticker.height + pad
        ){

            selectedSticker = sticker;

            isDraggingSticker = true;

            dragOffsetX = mouseX - sticker.x;

            dragOffsetY = mouseY - sticker.y;

            // Start long-press timer — if held without much movement, arm delete
            longPressCandidate = sticker;
            longPressStartPoint = { x: mouseX, y: mouseY };

            longPressTimer = setTimeout(() => {

                if(longPressCandidate === sticker){

                    stickerArmedForDelete = sticker;

                    isDraggingSticker = false;
                    selectedSticker = null;

                    drawTextOnTop();

                    console.log("Sticker armed for delete:", sticker);

                }

            }, LONG_PRESS_DURATION);

            console.log("Selected sticker:", selectedSticker);

            return;

        }

    }


    // Nothing was hit: redraw to remove a previously shown close button
    if(hadActive){
        drawTextOnTop();
    }

}, { passive: false });

editorCanvas.addEventListener("pointermove",(e)=>{

    // Cancel long-press if the pointer moved too far before the timer fired
    if(longPressCandidate && longPressStartPoint){

        const point = getCanvasPoint(e);

        const dx = point.x - longPressStartPoint.x;
        const dy = point.y - longPressStartPoint.y;

        if(dx * dx + dy * dy > LONG_PRESS_MOVE_THRESHOLD * LONG_PRESS_MOVE_THRESHOLD){
            cancelLongPress();
        }

    }

    // Cancel text long-press if moved too far
    if(textLongPressCandidate && textLongPressStartPoint){
        const p = getCanvasPoint(e);
        const dx = p.x - textLongPressStartPoint.x;
        const dy = p.y - textLongPressStartPoint.y;
        if(dx * dx + dy * dy > LONG_PRESS_MOVE_THRESHOLD * LONG_PRESS_MOVE_THRESHOLD){
            cancelTextLongPress();
        }
    }

    if(!e.isPrimary || (!isDraggingText && !isDraggingSticker)){
        return;
    }

    e.preventDefault();

    const point = getCanvasPoint(e);

    const mouseX = point.x;
    const mouseY = point.y;


    if(isDraggingText && selectedText){

        selectedText.x = mouseX - dragOffsetX;

        selectedText.y = mouseY - dragOffsetY;

    }
    else if(isDraggingSticker && selectedSticker){

        selectedSticker.x = mouseX - dragOffsetX;

        selectedSticker.y = mouseY - dragOffsetY;

    }


    drawTextOnTop();


}, { passive: false });

editorCanvas.addEventListener("pointerup", (e)=>{
    if(!e.isPrimary){ return; }
    cancelLongPress();
    cancelTextLongPress();
    stopDragging();
});

editorCanvas.addEventListener("pointercancel", (e)=>{
    if(!e.isPrimary){ return; }
    cancelLongPress();
    cancelTextLongPress();
    stopDragging();
});

// Text Tool
textTool.addEventListener("click",()=>{

    textPanel.classList.remove("hidden");
    filtersPanel.classList.add("hidden");
    stickersPanel.classList.add("hidden");

});

// Sticker Tool
stickerTool.addEventListener("click",()=>{

    stickersPanel.classList.remove("hidden");
    filtersPanel.classList.add("hidden");
    textPanel.classList.add("hidden");

});

// Add Sticker when an option is clicked (event delegation — works for dynamically added stickers)
stickersPanel.addEventListener("click", (e) => {

    const option = e.target.closest('.stickerOption');

    if(!option) return; // click wasn't on a sticker

    const src = option.dataset.src;

    const img = new Image();
    img.src = src;

    const sticker = {
        img: img,
        x: canvas.width / 2 - stickerDefaultWidth / 2,
        y: canvas.height / 2 - stickerDefaultWidth / 2,
        width: stickerDefaultWidth,
        height: stickerDefaultWidth
    };

    editorState.stickers.push(sticker);

    activeSticker = sticker;
    activeText = null;

    img.onload = () => {
        sticker.height = stickerDefaultWidth * (img.naturalHeight / img.naturalWidth);
        sticker.x = canvas.width / 2 - sticker.width / 2;
        sticker.y = canvas.height / 2 - sticker.height / 2;
        drawTextOnTop();
    };

    console.log("Sticker added:", src);

});

// Add Text
addTextBtn.addEventListener("click", () => {

    console.log("Add button clicked");


    const text = textField.value.trim();

    console.log("Text:", text);


    if(!text){
        console.log("No text entered");
        return;
    }


    const newText = {

        content: text,
    
        x: canvas.width / 2,
    
        y: 80,

        color: textColor.value,

        font: selectedFont

    };


    editorState.texts.push(newText);

    // Newly added text becomes selected (shows the close button)
    activeText = newText;
    activeSticker = null;


    console.log(editorState.texts);


    generatePhotoStrip();


    textField.value="";

});


// Change Font Color
textColor.addEventListener("input", () => {

    // If a text is currently selected, recolor it live
    if(activeText){

        activeText.color = textColor.value;

        console.log("Text color changed:", activeText);

        drawTextOnTop();

    }

    // Otherwise the chosen color simply applies to the next added text

});


// Highlight the font button matching the given font
function setActiveFontButton(font){

    fontOptions.forEach(btn=>{

        btn.classList.toggle("active", btn.dataset.font === font);

    });

}


// Change Font Type
fontOptions.forEach(btn=>{

    btn.addEventListener("click", () => {

        selectedFont = btn.dataset.font;

        setActiveFontButton(selectedFont);

        console.log("Font selected:", selectedFont);


        // If a text is currently selected, change its font live
        if(activeText){

            activeText.font = selectedFont;

            drawTextOnTop();

        }

    });

});


// Get Canvas Filter
function getCanvasFilter() {

    switch (editorState.filter) {

        case "grayscale":
            return "grayscale(100%)";

        case "sepia":
            return "sepia(100%)";

        case "warm":
            return "brightness(105%) saturate(120%)";

        case "vintage":
            return "sepia(45%) contrast(92%) brightness(95%) saturate(85%)";

        case "cool":
            return "hue-rotate(180deg)";

        default:
            return "none";

    }

}

// Filters Buttons
document.querySelectorAll(".filter-option").forEach(button => {

    button.addEventListener("click", () => {

        editorState.filter = button.dataset.filter;

        document.querySelectorAll(".filter-option").forEach(option => {
            option.classList.remove("active");
        });

        button.classList.add("active");
        console.log("Filter applied: " + editorState.filter);

        generatePhotoStrip();
        console.log("Photo strip generated");

    });

});