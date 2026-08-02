function createSelectionCard(category, onClick) {

    const card = document.createElement("button");

    card.type = "button";
    card.classList.add("selection-card");
    card.innerHTML = `
    <div class="category-card-container">
        <img src="${category.categoryIcon}" alt="${category.name}" class="category-image">
        <span class="category-name">${category.name}</span>
    </div>
    `;
    card.addEventListener("click", () => {
        onClick(category);
        console.log("Selected Category:", category.name);
    });

    return card;

}

function displayLayouts() {

    selectionStep = "layout";
    selectedLayout = "";
    selectedPhotoCount = null;

    frameTitle.textContent = "Select A Layout";

    console.log("Categories Loaded");

    frameCategories.innerHTML = "";
    frameCategories.classList.remove("hidden");
    framesContainer.classList.add("hidden");
    backToCategories.classList.add("hidden");

    categories.forEach((category) => {
        frameCategories.appendChild(createSelectionCard(category, (category) => {
            selectedLayout = layouts[category.id];
            loadFrames(category);
        }));
    });

}


function loadFrames(category) {

    fetch(`assets/data/frames/${category.frameFile}.json`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${category.frameFile}.json`);
            }

            return response.json();
        })
        .then((frames) => {

            displayFrames(frames, category.name);
        })
        .catch((error) => {
            console.error("Error loading frames:", error);
        });

}

function displayFrames(frames, name) {

    selectionStep = "frames";
    frameTitle.textContent = `${name} Frames`;
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

            showFramePreview(frame);

        });

        framesContainer.appendChild(img);

    });

}

backToCategories.addEventListener("click", () => {

    framePreview.classList.add("hidden");
    

    if (selectionStep === "frames") {
        displayLayouts();
        console.log("Back to Categories");
        return;
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
