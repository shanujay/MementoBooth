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


    editorCtx.font = "40px Arial"; // add this


    editorState.texts.forEach(text=>{

        const textWidth = editorCtx.measureText(text.content).width;


        if(
            mouseX >= text.x - textWidth / 2 &&
            mouseX <= text.x + textWidth / 2 &&
            mouseY >= text.y - 40 &&
            mouseY <= text.y
        ){

            selectedText = text;

            isDraggingText = true;

            dragOffsetX = mouseX - text.x;

            dragOffsetY = mouseY - text.y;

            console.log("Selected text:", selectedText);

        }

    });

});

editorCanvas.addEventListener("mousemove",(e)=>{


    if(!isDraggingText || !selectedText){
        return;
    }


    const rect = editorCanvas.getBoundingClientRect();


    const scaleX = editorCanvas.width / rect.width;
    const scaleY = editorCanvas.height / rect.height;


    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;


    selectedText.x = mouseX - dragOffsetX;

    selectedText.y = mouseY - dragOffsetY;


    drawTextOnTop();


});

editorCanvas.addEventListener("mouseup",()=>{

    isDraggingText = false;

    selectedText = null;

});

// Text Tool
textTool.addEventListener("click",()=>{

    textPanel.classList.remove("hidden");
    filtersPanel.classList.add("hidden");

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
    
        y: 80
    
    });


    console.log(editorState.texts);


    generatePhotoStrip();


    textField.value="";

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