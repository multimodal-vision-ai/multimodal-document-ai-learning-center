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
    const period = document.getElementById("radar-archive-period");
    if (!search || !type || !year || !period) return;

    const items = Array.from(document.querySelectorAll(".radar-archive-item"));
    const sections = Array.from(document.querySelectorAll(".radar-archive-section"));
    const yearValues = [...new Set(items.map(item => item.dataset.archiveYear).filter(Boolean))]
      .sort((a, b) => Number(b) - Number(a));

    if (year.dataset.radarArchiveYears !== yearValues.join(",")) {
      while (year.options.length > 1) year.remove(1);
      yearValues.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value + " 年";
        year.appendChild(option);
      });
      year.dataset.radarArchiveYears = yearValues.join(",");
    }

    const count = document.getElementById("radar-archive-count");
    const noResults = document.getElementById("radar-archive-no-results");

    function updatePeriodOptions() {
      const oldValue = period.value;
      const yearValue = year.value;
      const typeValue = type.value;
      const available = [...new Set(items
        .filter(item => item.dataset.archiveYear === yearValue &&
          item.dataset.archiveType === typeValue)
        .map(item => item.dataset.archivePeriod)
        .filter(Boolean))]
        .sort((a, b) => Number(b) - Number(a));

      while (period.options.length > 1) period.remove(1);
      available.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = typeValue === "weekly" ? "第 " + value + " 周" : "第 " + value + " 月";
        period.appendChild(option);
      });
      period.disabled = !yearValue || !typeValue || available.length === 0;
      period.options[0].textContent = !yearValue || !typeValue
        ? "请先选择年份和类型"
        : (available.length ? "选择具体期次" : "该年份暂无此类报告");
      period.value = available.includes(oldValue) ? oldValue : "";
    }

    function refresh() {
      const keyword = search.value.trim().toLowerCase();
      const typeValue = type.value;
      const yearValue = year.value;
      const periodValue = period.value;
      const completeSelection = Boolean(yearValue && typeValue && periodValue);

      items.forEach(item => { item.hidden = true; });
      sections.forEach(section => { section.hidden = true; });

      if (!completeSelection) {
        if (count) count.textContent = "请选择年份、报告类型和具体期次";
        if (noResults) {
          noResults.textContent = "请依次选择年份、报告类型和具体期次；页面将只展示对应的一份历史报告。";
          noResults.hidden = false;
        }
        return;
      }

      const periodItems = items.filter(item =>
        item.dataset.archiveYear === yearValue &&
        item.dataset.archiveType === typeValue &&
        item.dataset.archivePeriod === periodValue
      );
      // A period may have archived revisions. Display only its newest saved record.
      const selected = periodItems[0];
      const searchable = selected
        ? (selected.dataset.archiveText || selected.textContent || "").toLowerCase()
        : "";
      const keywordMatches = !keyword || searchable.includes(keyword);
      const visible = selected && keywordMatches;

      if (visible) {
        selected.hidden = false;
        const section = sections.find(value => value.dataset.archiveSection === typeValue);
        if (section) section.hidden = false;
        if (count) {
          count.textContent = "当前选择：" + yearValue + " 年 · " +
            (typeValue === "weekly" ? "第 " + periodValue + " 周报" : "第 " + periodValue + " 月报") +
            " · 显示 1 期";
        }
        if (noResults) noResults.hidden = true;
      } else {
        if (count) count.textContent = "当前期次未找到匹配报告";
        if (noResults) {
          noResults.textContent = keyword
            ? "所选报告中没有匹配该关键词的内容，请清除关键词后重试。"
            : "所选期次暂时没有可展示的历史报告。";
          noResults.hidden = false;
        }
      }
    }

    updatePeriodOptions();
    refresh();

    [year, type].forEach(control => {
      if (control.dataset.radarArchiveAttached) return;
      control.addEventListener("change", () => {
        updatePeriodOptions();
        refresh();
      });
      control.dataset.radarArchiveAttached = "1";
    });
    if (!period.dataset.radarArchiveAttached) {
      period.addEventListener("change", refresh);
      period.dataset.radarArchiveAttached = "1";
    }
    if (!search.dataset.radarArchiveAttached) {
      search.addEventListener("input", refresh);
      search.dataset.radarArchiveAttached = "1";
    }
  }

  function setup() {
    setupProjectFilter();
    setupArchiveSearch();
  }

  if (typeof document$ !== "undefined") document$.subscribe(setup);
  else document.addEventListener("DOMContentLoaded", setup);
})();
