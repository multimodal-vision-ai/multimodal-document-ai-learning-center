(function () {
  function setupProjectFilter() {
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
      if (control.dataset.radarProjectAttached) return;
      control.addEventListener(control === search ? "input" : "change", refresh);
      control.dataset.radarProjectAttached = "1";
    });
    refresh();
  }

  function setupArchiveSearch() {
    const search = document.getElementById("radar-archive-search");
    const type = document.getElementById("radar-archive-type");
    const year = document.getElementById("radar-archive-year");
    if (!search || !type || !year) return;

    const items = Array.from(document.querySelectorAll(".radar-archive-item"));
    const yearValues = [...new Set(
      items.map(item => item.dataset.archiveYear).filter(Boolean)
    )].sort((a, b) => Number(b) - Number(a));

    if (year.dataset.radarArchiveYears !== yearValues.join(",")) {
      while (year.options.length > 1) year.remove(1);
      yearValues.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        year.appendChild(option);
      });
      year.dataset.radarArchiveYears = yearValues.join(",");
    }

    const refresh = () => {
      const keyword = search.value.trim().toLowerCase();
      const typeValue = type.value;
      const yearValue = year.value;
      let visibleCount = 0;

      items.forEach(item => {
        const searchable = (item.dataset.archiveText || item.textContent || "").toLowerCase();
        const matches = (!keyword || searchable.includes(keyword)) &&
          (!typeValue || item.dataset.archiveType === typeValue) &&
          (!yearValue || item.dataset.archiveYear === yearValue);
        item.hidden = !matches;
        if (matches) visibleCount++;
      });

      document.querySelectorAll(".radar-archive-section").forEach(section => {
        const sectionType = section.dataset.archiveSection;
        const sectionItems = Array.from(section.querySelectorAll(".radar-archive-item"));
        const typeMatches = !typeValue || typeValue === sectionType;
        const hasArchiveItems = sectionItems.length > 0;
        const hasVisibleItems = sectionItems.some(item => !item.hidden);
        section.hidden = !typeMatches || (hasArchiveItems && !hasVisibleItems);
      });

      const count = document.getElementById("radar-archive-count");
      if (count) {
        count.textContent = keyword || typeValue || yearValue
          ? "匹配 " + visibleCount + " 条 / 共 " + items.length + " 条档案"
          : "共 " + items.length + " 条历史档案";
      }

      const noResults = document.getElementById("radar-archive-no-results");
      if (noResults) {
        const filtering = Boolean(keyword || typeValue || yearValue);
        noResults.hidden = !(filtering && visibleCount === 0);
      }
    };

    [search, type, year].forEach(control => {
      if (control.dataset.radarArchiveAttached) return;
      control.addEventListener(control === search ? "input" : "change", refresh);
      control.dataset.radarArchiveAttached = "1";
    });
    refresh();
  }

  function setup() {
    setupProjectFilter();
    setupArchiveSearch();
  }

  if (typeof document$ !== "undefined") document$.subscribe(setup);
  else document.addEventListener("DOMContentLoaded", setup);
})();
