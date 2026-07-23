document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const startBtnContainer = document.getElementById("startBtn");
    const mainTitle = document.getElementById("mainTitle");
    const introGirl = document.getElementById("introGirl");
    const intro = document.getElementById("intro");
    const goBtn = document.getElementById("goBtn");
    const sound = document.getElementById("clickSound");

    startButton.addEventListener("click", function () {
        sound.play();
        // Navigate directly to booth.html (href handles the redirect)
    });

    // Nav section switching
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            sound.play();

            const target = link.dataset.section;

            // Hide all sections, then show the target
            sections.forEach(section => {
                section.classList.toggle("hidden", section.id !== target);
            });
        });
    });
});
