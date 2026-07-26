function loadVisitorCounter() {

    const counter = document.getElementById("visitor-count");

    if (!counter) return;

    fetch("https://mv-ai-lab-counter.guoping-tan.workers.dev/counter")
        .then(response => response.json())
        .then(data => {
            counter.textContent =
                Number(data.value).toLocaleString();
        })
        .catch(() => {
            counter.textContent = "--";
        });

}

/* 首次加载 */
document.addEventListener("DOMContentLoaded", loadVisitorCounter);

/* Material Instant Navigation */
if (typeof document$ !== "undefined") {
    document$.subscribe(() => {
        loadVisitorCounter();
    });
}