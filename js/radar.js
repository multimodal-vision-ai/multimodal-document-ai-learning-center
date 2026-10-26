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

    const pagination = document.getElementById("radar-archive-pagination");
    const previous = document.getElementById("radar-archive-prev");
    const next = document.getElementById("radar-archive-next");
    const pageLabel = document.getElementById("radar-archive-page");
    const pageSize = 6;
    let page = 1;

    const refresh = () => {
      const keyword = search.value.trim().toLowerCase();
      const typeValue = type.value;
      const yearValue = year.value;
      const matched = items.filter(item => {
        const searchable = (item.dataset.archiveText || item.textContent || "").toLowerCase();
        return (!keyword || searchable.includes(keyword)) &&
          (!typeValue || item.dataset.archiveType === typeValue) &&
          (!yearValue || item.dataset.archiveYear === yearValue);
      });
      const pages = Math.max(1, Math.ceil(matched.length / pageSize));
      page = Math.min(page, pages);
      const pageItems = new Set(matched.slice((page - 1) * pageSize, page * pageSize));
      items.forEach(item => { item.hidden = !pageItems.has(item); });
      document.querySelectorAll(".radar-archive-section").forEach(section => {
        const sectionItems = Array.from(section.querySelectorAll(".radar-archive-item"));
        const typeMatches = !typeValue || typeValue === section.dataset.archiveSection;
        section.hidden = !typeMatches || (sectionItems.length > 0 &&
          !sectionItems.some(item => !item.hidden));
      });
      const count = document.getElementById("radar-archive-count");
      if (count) {
        count.textContent = (keyword || typeValue || yearValue ? "匹配 " : "共 ") +
          matched.length + " 条历史档案" +
          (matched.length ? " · 当前显示 " + Math.min(pageSize, matched.length - (page - 1) * pageSize) + " 期" : "");
      }
      const noResults = document.getElementById("radar-archive-no-results");
      if (noResults) noResults.hidden = matched.length !== 0 || !(keyword || typeValue || yearValue);
      if (pagination && previous && next && pageLabel) {
        pagination.hidden = matched.length <= pageSize;
        previous.disabled = page <= 1;
        next.disabled = page >= pages;
        pageLabel.textContent = "第 " + page + " / " + pages + " 页";
      }
    };

    [search, type, year].forEach(control => {
      if (control.dataset.radarArchiveAttached) return;
      control.addEventListener(control === search ? "input" : "change", () => {
        page = 1;
        refresh();
      });
      control.dataset.radarArchiveAttached = "1";
    });
    if (previous && !previous.dataset.radarArchiveAttached) {
      previous.addEventListener("click", () => { page = Math.max(1, page - 1); refresh(); });
      previous.dataset.radarArchiveAttached = "1";
    }
    if (next && !next.dataset.radarArchiveAttached) {
      next.addEventListener("click", () => { page += 1; refresh(); });
      next.dataset.radarArchiveAttached = "1";
    }
    refresh();
  }

  function setup() {
    setupProjectFilter();
    setupArchiveSearch();
  }

  if (typeof document$ !== "undefined") document$.subscribe(setup);
  else document.addEventListener("DOMContentLoaded", setup);
})();
