document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const startBtnContainer = document.getElementById("startBtn");
    const mainTitle = document.getElementById("mainTitle");
    const introGirl = document.getElementById("introGirl");
    const intro = document.getElementById("intro");
    const goBtn = document.getElementById("goBtn");
    const sound = document.getElementById("clickSound");

    // Start button click event
    startButton.addEventListener("click", function () {
        sound.play();
    });

    // Mobile nav menu
    const navHeader = document.querySelector(".nav-header");
    const navToggle = document.querySelector(".nav-toggle");

    // Close nav menu
    function closeNavMenu() {
        if (!navHeader || !navToggle) return;
        navHeader.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
    }

    // Nav toggle click event
    if (navToggle && navHeader) {
        navToggle.addEventListener("click", function () {
            const isOpen = navHeader.classList.toggle("nav-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        });
    }

    // Nav links click event
    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll(".page-section");
    const bgDecorationsHome = document.querySelector(".bg-decorations-home");
    const bgDecorationsAbout = document.querySelector(".bg-decorations-about");
    const bgDecorationsFeatures = document.querySelector(".bg-decorations-features");

    // Section decorations
    const sectionDecorations = {
        home: { container: bgDecorationsHome, cloudSelector: ".bg-deco-home" },
        about: { container: bgDecorationsAbout, cloudSelector: ".bg-deco-about" },
        features: { container: bgDecorationsFeatures, cloudSelector: ".bg-deco-features" },
    };

    // Replay cloud animations
    function replayCloudAnimations(container, cloudSelector) {
        if (!container) return;

        const clouds = container.querySelectorAll(cloudSelector);
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        clouds.forEach(cloud => {
            cloud.style.animation = "none";
            cloud.style.opacity = prefersReducedMotion ? "1" : "0";
        });

        void container.offsetWidth;

        clouds.forEach(cloud => {
            cloud.style.animation = "";
            if (!prefersReducedMotion) {
                cloud.style.opacity = "";
            }
        });
    }

    // Set active section
    function setActiveSection(target) {
        // Show active section
        sections.forEach(section => {
            section.classList.toggle("hidden", section.id !== target);
        });
    
        // Active nav link
        navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.section === target);
        });
    
        // Decorations
        Object.entries(sectionDecorations).forEach(([sectionName, { container, cloudSelector }]) => {
            if (!container) return;
    
            if (target === sectionName) {
                container.classList.remove("is-hidden");
                replayCloudAnimations(container, cloudSelector);
            } else {
                container.classList.add("is-hidden");
            }
        });
    }

    // Nav links click event
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            setActiveSection(link.dataset.section);
            closeNavMenu();
        });
    });
});
