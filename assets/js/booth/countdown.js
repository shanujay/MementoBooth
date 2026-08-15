// Countdown
function getPhotoOrdinal(number) {
    const ordinals = [
        "First", "Second", "Third", "Fourth", "Fifth",
        "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"
    ];

    return ordinals[number - 1] || `${number}th`;
}

function startCountdown(seconds, photoNumber) {

    return new Promise(resolve => {

        countdown.textContent = `Ready For ${getPhotoOrdinal(photoNumber)} Photo`;
        countdown.classList.add("countdown-ready");
        countdown.classList.remove("hidden");

        setTimeout(() => {

            countdown.classList.remove("countdown-ready");

            let count = seconds;
            countdown.textContent = count;

            const timer = setInterval(() => {

                count--;

                if (count === 0) {

                    clearInterval(timer);
                    countdown.classList.add("hidden");
                    resolve();

                } else {

                    countdown.textContent = count;

                }

            }, 1000);

        }, 2000);

    });

}
