function loadStatistics(){

    fetch("https://mv-ai-lab-counter.guoping-tan.workers.dev/counter")

    .then(r=>r.json())

    .then(data=>{

        document.getElementById("visitor-count").textContent =
            Number(data.visitors).toLocaleString();

        document.getElementById("github-stars").textContent =
            Number(data.stars).toLocaleString();

        document.getElementById("github-forks").textContent =
            Number(data.forks).toLocaleString();

    })

    .catch(console.error);

}

document.addEventListener(
    "DOMContentLoaded",
    loadStatistics
);

if(typeof document$!=="undefined"){

    document$.subscribe(loadStatistics);

}