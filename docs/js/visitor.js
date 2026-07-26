document.addEventListener("DOMContentLoaded", function () {
    const el = document.getElementById("visitor-count");
    if (!el) return;

    fetch("https://api.countapi.xyz/hit/mv-ai-lab/learning-center")
        .then(r => r.json())
        .then(data => {
            el.textContent = data.value;
        })
        .catch(() => {
            el.textContent = "--";
        });
});