(function () {
  function setup() {
    const search = document.getElementById("radar-search");
    const category = document.getElementById("radar-category");
    const size = document.getElementById("radar-size");
    const gpu = document.getElementById("radar-gpu");
    const table = document.getElementById("radar-project-table");
    if (!search || !category || !size || !gpu || !table) return;
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const refresh = () => {
      const term = search.value.trim().toLowerCase();
      const maxSize = size.value ? Number(size.value) : null;
      let count = 0;
      for (const row of rows) {
        const number = Number(row.dataset.size);
        const sizeOK = maxSize === null || (row.dataset.size && number <= maxSize);
        const isVisible = (!term || row.textContent.toLowerCase().includes(term)) &&
          (!category.value || row.dataset.category === category.value) &&
          sizeOK && (!gpu.value || row.dataset.gpu === gpu.value);
        row.hidden = !isVisible;
        if (isVisible) count++;
      }
      const label = document.getElementById("radar-filter-count");
      if (label) label.textContent = count + " 条记录";
    };
    [search, category, size, gpu].forEach(control => {
      if (control.dataset.radarAttached) return;
      control.addEventListener(control === search ? "input" : "change", refresh);
      control.dataset.radarAttached = "1";
    });
    refresh();
  }
  if (typeof document$ !== "undefined") document$.subscribe(setup);
  else document.addEventListener("DOMContentLoaded", setup);
})();
