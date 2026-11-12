function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function renderCount(element, value) {
  const number = Number(value);
  element.textContent = Number.isFinite(number) ? number.toLocaleString() : "—";
}

async function loadStatistics() {
  const visitors = document.getElementById("visitor-count");
  const stars = document.getElementById("github-stars");
  const forks = document.getElementById("github-forks");

  // MkDocs loads this script on every page; only the homepage has these fields.
  if (!visitors || !stars || !forks) return;

  const storageKey = "mv-ai-lab-last-visit";
  const today = todayKey();
  const firstVisitToday = localStorage.getItem(storageKey) !== today;

  try {
    const response = await fetch(
      "https://mv-ai-lab-counter.guoping-tan.workers.dev/counter",
      { method: firstVisitToday ? "POST" : "GET" },
    );

    if (!response.ok) throw new Error(`statistics request failed: ${response.status}`);

    const data = await response.json();
    renderCount(visitors, data.visitors);
    renderCount(stars, data.stars);
    renderCount(forks, data.forks);

    if (firstVisitToday) localStorage.setItem(storageKey, today);
  } catch (error) {
    console.warn("Unable to load site statistics", error);
  }
}

if (typeof document$ !== "undefined") {
  document$.subscribe(loadStatistics);
} else {
  loadStatistics();
}
