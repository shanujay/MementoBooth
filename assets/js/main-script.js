document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const startBtnContainer = document.getElementById("startBtn");
    const mainTitle = document.getElementById("mainTitle");
    const introGirl = document.getElementById("introGirl");
    const intro = document.getElementById("intro");
    const goBtn = document.getElementById("goBtn");
    const sound = document.getElementById("clickSound");

    startButton.addEventListener("click", function (event) {
        event.preventDefault();
        sound.play();
        document.body.style.backgroundImage = "url('assets/img/booth_bg.png')";
        // Hide the start button and title
        startBtnContainer.classList.add("hidden");
        mainTitle.classList.add("hidden");
        // Show the new images after a slight delay
        setTimeout(() => {
            introGirl.classList.remove("hidden");
            intro.classList.remove("hidden");
            goBtn.classList.remove("hidden");
        }, 800);
        // After 10 seconds, redirect to booth.html
        setTimeout(() => {
            window.location.href = "booth.html";
        }, 10000);
    });
});
