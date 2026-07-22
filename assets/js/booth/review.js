// Show Photo Review 
function showPhotoReview(){

    photoReview.classList.remove("hidden");
    hideCameraUI();

    // Stop Camera
    stopCamera();

    photoCarousel.innerHTML = "";

    photos.forEach((photo,index)=>{

        const img = document.createElement("img");

        img.src = photo;

        img.classList.add("review-photo");


        photoCarousel.appendChild(img);

    });


    updateCarousel();

}

// Update Carousel
function updateCarousel(){

    const images = document.querySelectorAll(".review-photo");
    
    images.forEach((img,index)=>{

        img.classList.toggle(
            "hidden",
            index !== reviewIndex
        );

    });

    prevPhoto.disabled = reviewIndex === 0;
    nextPhoto.disabled = reviewIndex === photos.length - 1;

    reviewCounter.textContent =
    `Photo ${reviewIndex + 1} / ${photos.length}`;

}

nextPhoto.addEventListener("click",()=>{

    clickSound.play();

    if(reviewIndex < photos.length - 1){

        reviewIndex++;

        updateCarousel();

    }

});


prevPhoto.addEventListener("click",()=>{

    clickSound.play();

    if(reviewIndex > 0){

        reviewIndex--;

        updateCarousel();

    }

});

// Confirm Review
confirmReview.addEventListener("click",()=>{


    photoReview.classList.add("hidden");


    // Show final result section
    showEditorUI();


    generatePhotoStrip();


});

// Retake Review
retakeReview.addEventListener("click", async () => {

    photoReview.classList.add("hidden");

    isRetaking = true;

    await startCamera();

    showCameraUI();
    takeSnapBtn.classList.remove("hidden");

});

// Retake All Photos
retakeAll.addEventListener("click", async () => {

    photoReview.classList.add("hidden");

    isRetakingAll = true;

    await startCamera();

    showCameraUI();
    takeSnapBtn.classList.remove("hidden");

});
