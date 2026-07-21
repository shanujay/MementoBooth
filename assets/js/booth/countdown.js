// Countdown
function startCountdown(seconds){

    return new Promise(resolve=>{

        let count = seconds;


        countdown.classList.remove("hidden");

        countdown.textContent = count;


        const timer = setInterval(()=>{


            count--;


            if(count === 0){

                clearInterval(timer);

                countdown.classList.add("hidden");

                resolve();

            }
            else{

                countdown.textContent = count;

            }


        },1000);


    });

}
