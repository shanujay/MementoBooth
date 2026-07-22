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


    // Clicking empty space deselects any active text
    activeText = null;


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

            isDraggingSticker = true;

            dragOffsetX = mouseX - sticker.x;

            dragOffsetY = mouseY - sticker.y;

            console.log("Selected sticker:", selectedSticker);

            return;

        }

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


    editorState.texts.push({

        content: text,
    
        x: canvas.width / 2,
    
        y: 80,

        color: textColor.value,

        font: selectedFont

    });


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

        case "cool":
            return "hue-rotate(180deg)";

        default:
            return "none";

    }

}

// Filters Buttons
document.querySelectorAll("[data-filter]").forEach(button => {

    button.addEventListener("click", () => {

        editorState.filter = button.dataset.filter;
        console.log("Filter applied: " + editorState.filter);

        generatePhotoStrip();
        console.log("Photo strip generated");

    });

});