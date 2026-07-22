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