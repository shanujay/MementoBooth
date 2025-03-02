document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton"); // The anchor
    const startBtnContainer = document.getElementById("startBtn"); // Div containing button
    const mainTitle = document.getElementById("mainTitle"); // Title
    const introGirl = document.getElementById("introGirl"); // Intro girl image
    const intro = document.getElementById("intro"); // Intro image
    const goBtn = document.getElementById("goBtn"); // "Let`s Go!" button

    const sound = document.getElementById("clickSound");


    startButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default anchor behavior
        sound.play();
        // Change background image or other settings if needed
        document.body.style.backgroundImage = "url('assets/img/booth_bg.png')";

        // Hide the start button and title
        startBtnContainer.classList.add("hidden");
        mainTitle.classList.add("hidden");

        // Show the new images after a slight delay
        setTimeout(() => {
            introGirl.classList.remove("hidden"); // Show intro girl image
            intro.classList.remove("hidden"); // Show intro image
            goBtn.classList.remove("hidden"); // Show "Let's Go!" button
        }, 800); // Adjust the delay if needed

        // After 10 seconds, redirect to booth.html
        setTimeout(() => {
            window.location.href = "booth.html"; // Navigate to booth.html
        }, 10000); // 10000 milliseconds = 10 seconds
    });
});
