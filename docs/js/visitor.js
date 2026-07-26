function loadStatistics() {

    const visitor = document.getElementById("visitor-count");
    const stars = document.getElementById("github-stars");
    const forks = document.getElementById("github-forks");

    fetch("https://mv-ai-lab-counter.guoping-tan.workers.dev/counter")
        .then(response => response.json())
        .then(data => {

            if (visitor)
                visitor.textContent = Number(data.visitors).toLocaleString();

            if (stars)
                stars.textContent = Number(data.stars).toLocaleString();

            if (forks)
                forks.textContent = Number(data.forks).toLocaleString();

        })
        .catch(error => {

            console.error(error);

            if (visitor) visitor.textContent = "--";
            if (stars) stars.textContent = "--";
            if (forks) forks.textContent = "--";

        });

}

/* 页面首次加载 */
document.addEventListener("DOMContentLoaded", loadStatistics);

/* Material Instant Navigation */
if (typeof document$ !== "undefined") {
    document$.subscribe(loadStatistics);
}