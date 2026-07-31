function displayCategories(){

    frameTitle.textContent = "Choose Your Theme";

    frameCategories.innerHTML = "";


    categories.forEach(category => {


        const card = document.createElement("div");

        card.classList.add("category-card");


        const thumbnails = category.thumbnails?.length
            ? category.thumbnails
            : [category.thumbnail];

        const thumbnailsHtml = thumbnails
            .slice(0, 2)
            .map((src, index) => `
                <div class="category-strip-image category-strip-image--${index === 0 ? "left" : "right"}">
                    <img src="${src}" alt="">
                </div>
            `)
            .join("");

        card.innerHTML = `
            <div class="category-folder">
                <div class="category-folder-strips">
                    ${thumbnailsHtml}
                </div>
                    <p class="category-folder-name">${category.name}</p>
            </div>
        `;


        card.addEventListener("click",()=>{

            loadFrames(category);

        });


        frameCategories.appendChild(card);


    });

}

function loadFrames(category){

    fetch(`assets/data/frames/${category.frameFile}`)
    .then(response => response.json())
    .then(frames => {

        displayFrames(frames, category.name);

    })
    .catch(error => {

        console.error("Error loading frames:", error);

    });

}

function displayFrames(frames, categoryName){

    frameTitle.textContent = `${categoryName} Frames`;

    framesContainer.innerHTML = "";


    // Hide categories
    frameCategories.classList.add("hidden");


    // Show frames
    framesContainer.classList.remove("hidden");


    // Show back button
    backToCategories.classList.remove("hidden")


    frames.forEach(frame=>{


        const img = document.createElement("img");

        img.src = frame.image;

        img.classList.add("frame-option");

        img.dataset.frame = frame.image;


        img.addEventListener("click",()=>{

            selectedFrame = frame.image;
        
            selectedPhotoCount = frame.photoCount;
        
            selectedLayout = layouts[frame.layout];
        
            console.log("Selected Frame:", selectedFrame);
            console.log("Photo Count:", selectedPhotoCount);
            console.log("Selected Layout:", selectedLayout);
        
            showFramePreview(frame);
        
        });


        framesContainer.appendChild(img);


    });

}

backToCategories.addEventListener("click",()=>{


    framesContainer.classList.add("hidden");

    frameCategories.classList.remove("hidden");

    backToCategories.classList.add("hidden");


    frameTitle.textContent = "Choose Your Theme";

});

// Frame selection
document.querySelectorAll(".frame-option").forEach(frame => {
    frame.addEventListener("click", function () {
        selectedFrame = this.getAttribute("data-frame");
        hoverSound.play();
        templateSelection.classList.add("hidden");
        photoBooth.classList.remove("hidden");
        startCamera();
    });
});

// Show Frame Preview
function showFramePreview(frame) {

    selectedFrame = frame.image;


    // Hide frame selection
    frameCategories.classList.add("hidden");
    framesContainer.classList.add("hidden");


    // Show preview
    framePreview.classList.remove("hidden");


    // Add frame details
    previewTitle.textContent = `${frame.name} (${frame.photoCount} Photos - ${frame.layoutId})`;

    previewFrameImage.src = frame.image;

}

// Confirm Frame
confirmFrame.addEventListener("click",()=>{


    framePreview.classList.add("hidden");


    templateSelection.classList.add("hidden");


    photoBooth.classList.remove("hidden");


    startCamera();


});

// Cancel Frame
cancelFrame.addEventListener("click",()=>{

    framePreview.classList.add("hidden");

    framesContainer.classList.remove("hidden");

    backToCategories.classList.remove("hidden");

});
