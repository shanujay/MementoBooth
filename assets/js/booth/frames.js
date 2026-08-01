function createSelectionCard(label, onClick) {

    const card = document.createElement("button");

    card.type = "button";
    card.classList.add("selection-card");
    card.innerHTML = `<span class="selection-card-label">${label}</span>`;
    card.addEventListener("click", () => {
        clickSound.play();
        onClick();
    });

    return card;

}

function displayOrientations() {

    selectionStep = "orientation";
    selectedOrientation = "";
    selectedPhotoCountOption = null;

    frameTitle.textContent = "Choose Orientation";
    frameCategories.innerHTML = "";
    frameCategories.classList.remove("hidden");
    framesContainer.classList.add("hidden");
    backToCategories.classList.add("hidden");

    categories.forEach((category) => {
        frameCategories.appendChild(createSelectionCard(category.name, () => {
            selectedOrientation = category.id;
            displayPhotoCounts();
        }));
    });

}

function displayPhotoCounts() {

    selectionStep = "photoCount";

    frameTitle.textContent = "Choose Photo Count";
    frameCategories.innerHTML = "";
    frameCategories.classList.remove("hidden");
    framesContainer.classList.add("hidden");
    backToCategories.classList.remove("hidden");

    photoCounts.forEach((option) => {
        frameCategories.appendChild(createSelectionCard(option.name, () => {
            selectedPhotoCountOption = option;
            loadFrames(option);
        }));
    });

}

function loadFrames(photoCountOption) {

    fetch(`assets/data/frames/${photoCountOption.frameFile}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${photoCountOption.frameFile}`);
            }

            return response.json();
        })
        .then((frames) => {
            const filteredFrames = frames.filter(
                (frame) => frame.orientation === selectedOrientation
            );

            if (filteredFrames.length === 0) {
                alert(`No ${selectedOrientation} frames found for ${photoCountOption.name}.`);
                return;
            }

            displayFrames(filteredFrames, photoCountOption.name);
        })
        .catch((error) => {
            console.error("Error loading frames:", error);
        });

}

function displayFrames(frames, sectionName) {

    selectionStep = "frames";
    frameTitle.textContent = `${sectionName} Frames`;
    framesContainer.innerHTML = "";

    frameCategories.classList.add("hidden");
    framesContainer.classList.remove("hidden");
    backToCategories.classList.remove("hidden");

    frames.forEach((frame) => {

        const img = document.createElement("img");

        img.src = frame.image;
        img.alt = frame.name;
        img.classList.add("frame-option");
        img.dataset.frame = frame.image;

        img.addEventListener("click", () => {

            selectedFrame = frame.image;
            selectedPhotoCount = frame.photoCount;
            selectedLayout = layouts[frame.layout];

            if (!selectedLayout) {
                console.error("Missing layout:", frame.layout);
                alert("This frame layout is not configured yet.");
                return;
            }

            console.log("Selected Frame:", selectedFrame);
            console.log("Photo Count:", selectedPhotoCount);
            console.log("Selected Layout:", selectedLayout);

            showFramePreview(frame);

        });

        framesContainer.appendChild(img);

    });

}

backToCategories.addEventListener("click", () => {

    clickSound.play();
    framePreview.classList.add("hidden");

    if (selectionStep === "frames") {
        displayPhotoCounts();
        return;
    }

    if (selectionStep === "photoCount") {
        displayOrientations();
    }

});

function showFramePreview(frame) {

    selectedFrame = frame.image;

    frameCategories.classList.add("hidden");
    framesContainer.classList.add("hidden");
    framePreview.classList.remove("hidden");

    previewTitle.textContent = `${frame.name} (${frame.photoCount} Photos)`;
    previewFrameImage.src = frame.image;

}

confirmFrame.addEventListener("click", () => {

    framePreview.classList.add("hidden");
    templateSelection.classList.add("hidden");
    photoBooth.classList.remove("hidden");

    startCamera();

});

cancelFrame.addEventListener("click", () => {

    framePreview.classList.add("hidden");
    framesContainer.classList.remove("hidden");
    backToCategories.classList.remove("hidden");

});
