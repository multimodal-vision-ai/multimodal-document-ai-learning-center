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
    const searchButton = document.getElementById("radar-archive-search-button");
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

    function resizeArchiveSearch() {
      // Keep the field within its grid cell; grow vertically and wrap long queries.
      const maxHeight = 160;
      search.style.height = "auto";
      const contentHeight = search.scrollHeight;
      search.style.height = Math.min(contentHeight, maxHeight) + "px";
      search.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
    }

    if (!search.dataset.radarAutoResizeAttached) {
      search.addEventListener("input", resizeArchiveSearch);
      search.dataset.radarAutoResizeAttached = "1";
    }
    resizeArchiveSearch();

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
      const hasYear = Boolean(yearValue);
      const hasType = Boolean(typeValue);
      period.disabled = !hasYear || !hasType || available.length === 0;
      if (!hasYear && !hasType) {
        period.options[0].textContent = "先选择年份和报告类型";
      } else if (!hasYear) {
        period.options[0].textContent = "先选择年份";
      } else if (!hasType) {
        period.options[0].textContent = "先选择报告类型";
      } else if (available.length) {
        period.options[0].textContent = "选择期次";
      } else {
        period.options[0].textContent = typeValue === "weekly" ? "该年份暂无周报" : "该年份暂无月报";
      }
      period.value = available.includes(oldValue) ? oldValue : "";
    }

    function clearKeywordHighlights() {
      items.forEach(item => {
        item.querySelectorAll("mark.radar-search-hit").forEach(mark => {
          mark.replaceWith(document.createTextNode(mark.textContent || ""));
        });
        item.normalize();
      });
    }

    function highlightKeywordMatches() {
      const keyword = search.value.trim();
      if (!keyword) return 0;
      const needle = keyword.toLocaleLowerCase();
      const visibleItems = items.filter(item => !item.hidden);
      let matchCount = 0;
      let firstHit = null;

      visibleItems.forEach(item => {
        const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const parent = node.parentElement;
          if (!node.nodeValue || !node.nodeValue.toLocaleLowerCase().includes(needle)) continue;
          if (parent && parent.closest("script,style,textarea,select,button,mark")) continue;
          textNodes.push(node);
        }

        textNodes.forEach(node => {
          const original = node.nodeValue || "";
          const lower = original.toLocaleLowerCase();
          const fragment = document.createDocumentFragment();
          let cursor = 0;
          let index = lower.indexOf(needle, cursor);
          while (index !== -1) {
            if (index > cursor) fragment.appendChild(document.createTextNode(original.slice(cursor, index)));
            const mark = document.createElement("mark");
            mark.className = "radar-search-hit";
            mark.textContent = original.slice(index, index + keyword.length);
            fragment.appendChild(mark);
            if (!firstHit) firstHit = mark;
            matchCount += 1;
            cursor = index + keyword.length;
            index = lower.indexOf(needle, cursor);
          }
          if (cursor < original.length) fragment.appendChild(document.createTextNode(original.slice(cursor)));
          if (node.parentNode) node.parentNode.replaceChild(fragment, node);
        });
      });

      if (firstHit) {
        firstHit.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (count && matchCount > 0) {
        count.textContent += " · 已定位 " + matchCount + " 处关键词";
      }
      return matchCount;
    }

    function runKeywordSearch() {
      clearKeywordHighlights();
      refresh();
      highlightKeywordMatches();
    }

    function refresh() {
      const keyword = search.value.trim().toLowerCase();
      const typeValue = type.value;
      const yearValue = year.value;
      const periodValue = period.value;
      const completeSelection = Boolean(yearValue && typeValue && periodValue);

      items.forEach(item => { item.hidden = true; });
      sections.forEach(section => { section.hidden = true; });

      // A keyword can search the archive even before a specific period is selected.
      // Any selected year/type narrows the search; a fully selected period uses the
      // single-period behavior below.
      if (keyword && !completeSelection) {
        const matches = items.filter(item => {
          if (yearValue && item.dataset.archiveYear !== yearValue) return false;
          if (typeValue && item.dataset.archiveType !== typeValue) return false;
          const searchable = (item.dataset.archiveText || item.textContent || "").toLowerCase();
          return searchable.includes(keyword);
        });
        matches.forEach(item => {
          item.hidden = false;
          const section = sections.find(value => value.dataset.archiveSection === item.dataset.archiveType);
          if (section) section.hidden = false;
        });
        if (count) {
          const scope = yearValue || typeValue
            ? "符合当前筛选条件的历史报告"
            : "全部历史报告";
          count.textContent = "关键词匹配 " + matches.length + " 期（" + scope + "）";
        }
        if (noResults) {
          noResults.textContent = matches.length
            ? "已显示匹配的历史报告；可继续选择年份、报告类型或期次缩小范围。"
            : "没有找到匹配的历史报告，请尝试其他关键词或调整筛选条件。";
          noResults.hidden = matches.length > 0;
        }
        return;
      }

      if (!completeSelection) {
        let message;
        if (!yearValue) {
          message = "请先选择年份。";
        } else if (!typeValue) {
          message = "请选择周报或月报。";
        } else if (period.disabled) {
          message = typeValue === "weekly" ? "该年份暂无可展示的周报。" : "该年份暂无可展示的月报。";
        } else {
          message = "请选择期次。";
        }
        if (count) count.textContent = message;
        if (noResults) {
          noResults.textContent = message + " 选择完成后，将只显示该期报告。";
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
        period.value = "";
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
      search.addEventListener("input", () => {
        clearKeywordHighlights();
        refresh();
      });
      // Enter runs the search instead of inserting an unintended newline.
      // Shift+Enter remains available when a multiline query is deliberately needed.
      search.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          runKeywordSearch();
        }
      });
      search.dataset.radarArchiveAttached = "1";
    }
    if (searchButton && !searchButton.dataset.radarArchiveAttached) {
      searchButton.addEventListener("click", runKeywordSearch);
      searchButton.dataset.radarArchiveAttached = "1";
    }
  }

  function setup() {
    setupProjectFilter();
    setupArchiveSearch();
  }

  if (typeof document$ !== "undefined") document$.subscribe(setup);
  else document.addEventListener("DOMContentLoaded", setup);
})();
