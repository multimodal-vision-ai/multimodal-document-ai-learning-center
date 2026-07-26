function loadStatistics() {

    fetch("https://mv-ai-lab-counter.guoping-tan.workers.dev/counter")
        .then(response => response.json())
        .then(data => {

            const visitors = Number(data.visitors ?? 0);
            const stars = Number(data.stars ?? 0);
            const forks = Number(data.forks ?? 0);

            document.getElementById("visitor-count").textContent =
                visitors.toLocaleString();

            document.getElementById("github-stars").textContent =
                stars.toLocaleString();

            document.getElementById("github-forks").textContent =
                forks.toLocaleString();

        })
        .catch(error => {

            console.error(error);

            document.getElementById("visitor-count").textContent = "--";
            document.getElementById("github-stars").textContent = "--";
            document.getElementById("github-forks").textContent = "--";

        });

}

document.addEventListener("DOMContentLoaded", loadStatistics);

if (typeof document$ !== "undefined") {
    document$.subscribe(loadStatistics);
}