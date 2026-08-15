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

editorCanvas.addEventListener("mousedown", (e)=>{

    const rect = editorCanvas.getBoundingClientRect();

    const scaleX = editorCanvas.width / rect.width;
    const scaleY = editorCanvas.height / rect.height;


    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;


    // 0a) If a text is selected, check its close (delete) button first
    if(activeText){

        const btn = getTextCloseButton(activeText);

        const dx = mouseX - btn.cx;
        const dy = mouseY - btn.cy;

        if(dx * dx + dy * dy <= btn.r * btn.r){

            const idx = editorState.texts.indexOf(activeText);

            if(idx !== -1){
                editorState.texts.splice(idx, 1);
            }

            activeText = null;

            drawTextOnTop();

            console.log("Text deleted");

            return;

        }

    }


    // 0b) If a sticker is selected, check its close (delete) button first
    if(activeSticker){

        const btn = getStickerCloseButton(activeSticker);

        const dx = mouseX - btn.cx;
        const dy = mouseY - btn.cy;

        if(dx * dx + dy * dy <= btn.r * btn.r){

            const idx = editorState.stickers.indexOf(activeSticker);

            if(idx !== -1){
                editorState.stickers.splice(idx, 1);
            }

            activeSticker = null;

            drawTextOnTop();

            console.log("Sticker deleted");

            return;

        }

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
            mouseX >= text.x - textWidth / 2 &&
            mouseX <= text.x + textWidth / 2 &&
            mouseY >= text.y - 40 &&
            mouseY <= text.y
        ){

            selectedText = text;

            // Keep a persistent reference so the color picker can edit it
            activeText = text;

            // Sync the color picker to the selected text's current color
            textColor.value = text.color || defaultTextColor;

            // Sync the font buttons to the selected text's current font
            setActiveFontButton(text.font || defaultTextFont);

            isDraggingText = true;

            dragOffsetX = mouseX - text.x;

            dragOffsetY = mouseY - text.y;

            console.log("Selected text:", selectedText);

            // Redraw to show this text's close button
            drawTextOnTop();

            return; // stop: don't also grab a sticker underneath

        }

    }


    // 2) Hit-test stickers (topmost first)
    for(let i = editorState.stickers.length - 1; i >= 0; i--){

        const sticker = editorState.stickers[i];

        if(
            mouseX >= sticker.x &&
            mouseX <= sticker.x + sticker.width &&
            mouseY >= sticker.y &&
            mouseY <= sticker.y + sticker.height
        ){

            selectedSticker = sticker;

            // Mark as active so the close button shows
            activeSticker = sticker;

            isDraggingSticker = true;

            dragOffsetX = mouseX - sticker.x;

            dragOffsetY = mouseY - sticker.y;

            console.log("Selected sticker:", selectedSticker);

            // Redraw to show the close button
            drawTextOnTop();

            return;

        }

    }


    // Nothing was hit: redraw to remove a previously shown close button
    if(hadActive){
        drawTextOnTop();
    }

});

editorCanvas.addEventListener("mousemove",(e)=>{


    if(!isDraggingText && !isDraggingSticker){
        return;
    }


    const rect = editorCanvas.getBoundingClientRect();


    const scaleX = editorCanvas.width / rect.width;
    const scaleY = editorCanvas.height / rect.height;


    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;


    if(isDraggingText && selectedText){

        selectedText.x = mouseX - dragOffsetX;

        selectedText.y = mouseY - dragOffsetY;

    }
    else if(isDraggingSticker && selectedSticker){

        selectedSticker.x = mouseX - dragOffsetX;

        selectedSticker.y = mouseY - dragOffsetY;

    }


    drawTextOnTop();


});

editorCanvas.addEventListener("mouseup",()=>{

    isDraggingText = false;

    selectedText = null;

    isDraggingSticker = false;

    selectedSticker = null;

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

// Add Sticker when an option is clicked
stickerOptions.forEach(option=>{

    option.addEventListener("click", ()=>{

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

        // Newly added sticker becomes selected (shows the close button)
        activeSticker = sticker;
        activeText = null;


        // Once loaded, keep aspect ratio and redraw
        img.onload = ()=>{

            sticker.height = stickerDefaultWidth * (img.naturalHeight / img.naturalWidth);

            sticker.x = canvas.width / 2 - sticker.width / 2;

            sticker.y = canvas.height / 2 - sticker.height / 2;

            drawTextOnTop();

        };


        console.log("Sticker added:", src);

    });

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