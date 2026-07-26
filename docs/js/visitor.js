function todayKey() {

    const d = new Date();

    return d.getFullYear() + "-" +
           (d.getMonth()+1) + "-" +
           d.getDate();

}

function loadStatistics() {

    const key = "mv-ai-lab-last-visit";

    const today = todayKey();

    const firstVisitToday =
        localStorage.getItem(key) !== today;

    const method = firstVisitToday ? "POST" : "GET";

    fetch(
        "https://mv-ai-lab-counter.guoping-tan.workers.dev/counter",
        {
            method: method
        }
    )
    .then(r => r.json())
    .then(data => {

        document.getElementById("visitor-count").textContent =
            Number(data.visitors).toLocaleString();

        document.getElementById("github-stars").textContent =
            Number(data.stars).toLocaleString();

        document.getElementById("github-forks").textContent =
            Number(data.forks).toLocaleString();

        if(firstVisitToday){

            localStorage.setItem(key, today);

        }

    })
    .catch(console.error);

}

if(typeof document$ !== "undefined"){

    document$.subscribe(loadStatistics);

}else{

    loadStatistics();

}