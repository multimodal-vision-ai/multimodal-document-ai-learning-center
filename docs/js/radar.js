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
    const searchSubmit = document.getElementById("radar-archive-search-submit");
    const type = document.getElementById("radar-archive-type");
    const year = document.getElementById("radar-archive-year");
    const period = document.getElementById("radar-archive-period");
    if (!search || !searchSubmit || !type || !year || !period) return;

    let submittedKeyword = "";
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

    function clearArchiveHighlights(root) {
      if (!root) return;
      root.querySelectorAll("mark.radar-archive-highlight").forEach(mark => {
        mark.replaceWith(document.createTextNode(mark.textContent || ""));
      });
      root.normalize();
    }

    function highlightArchiveKeyword(root, keyword) {
      if (!root || !keyword) return 0;
      const escaped = keyword
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/[{}]/g, "\\$&"))
        .join("\\s+");
      if (!escaped) return 0;

      const pattern = new RegExp(escaped, "gi");
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (parent.closest("script, style, noscript, textarea, button, mark, .radar-archive-search-help")) {
            return NodeFilter.FILTER_REJECT;
          }
          pattern.lastIndex = 0;
          return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });

      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      let total = 0;
      nodes.forEach(node => {
        const value = node.nodeValue || "";
        pattern.lastIndex = 0;
        let match;
        let cursor = 0;
        const fragment = document.createDocumentFragment();
        while ((match = pattern.exec(value)) !== null) {
          if (match.index > cursor) {
            fragment.appendChild(document.createTextNode(value.slice(cursor, match.index)));
          }
          const mark = document.createElement("mark");
          mark.className = "radar-archive-highlight";
          mark.textContent = match[0];
          fragment.appendChild(mark);
          cursor = match.index + match[0].length;
          total += 1;
        }
        if (cursor < value.length) {
          fragment.appendChild(document.createTextNode(value.slice(cursor)));
        }
        if (cursor > 0) node.parentNode.replaceChild(fragment, node);
      });
      return total;
    }

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

    function refresh() {
      const keyword = submittedKeyword.trim().toLowerCase().replace(/\s+/g, " ");
      const terms = keyword.split(/\s+/).filter(Boolean);
      const typeValue = type.value;
      const yearValue = year.value;
      const periodValue = period.value;
      const hasYearAndType = Boolean(yearValue && typeValue);

      items.forEach(item => {
        clearArchiveHighlights(item);
        item.hidden = true;
      });
      sections.forEach(section => { section.hidden = true; });

      if (!hasYearAndType) {
        const message = !yearValue
          ? "请先选择年份。"
          : "请选择周报或月报。";
        if (count) count.textContent = message;
        if (noResults) {
          noResults.textContent = message + " 选择年份和报告类型后，可选择期次查看，或输入关键词搜索。";
          noResults.hidden = false;
        }
        return;
      }

      if (period.disabled) {
        const message = typeValue === "weekly"
          ? "该年份暂无可展示的周报。"
          : "该年份暂无可展示的月报。";
        if (count) count.textContent = message;
        if (noResults) {
          noResults.textContent = message;
          noResults.hidden = false;
        }
        return;
      }

      // If a period is selected, restrict the search to it. Otherwise, a submitted
      // keyword searches every period of the selected year and report type.
      if (!periodValue && terms.length === 0) {
        const message = "请选择期次，或输入关键词后点击搜索。";
        if (count) count.textContent = message;
        if (noResults) {
          noResults.textContent = message;
          noResults.hidden = false;
        }
        return;
      }

      const scopedItems = items.filter(item =>
        item.dataset.archiveYear === yearValue &&
        item.dataset.archiveType === typeValue &&
        (!periodValue || item.dataset.archivePeriod === periodValue)
      );

      // Multiple saved revisions may exist for a period. Keep only the newest one,
      // which is the first matching archive card in document order.
      const seenPeriods = new Set();
      const latestItems = scopedItems.filter(item => {
        const value = item.dataset.archivePeriod;
        if (!value || seenPeriods.has(value)) return false;
        seenPeriods.add(value);
        return true;
      });

      const matches = latestItems.filter(item => {
        if (terms.length === 0) return true;
        const searchable = (item.textContent || "").toLowerCase().replace(/\s+/g, " ");
        return terms.every(term => searchable.includes(term));
      });

      let keywordCount = 0;
      matches.forEach(item => {
        item.hidden = false;
        if (terms.length) {
          terms.forEach(term => {
            keywordCount += highlightArchiveKeyword(item, term);
          });
        }
      });

      if (matches.length > 0) {
        const section = sections.find(value => value.dataset.archiveSection === typeValue);
        if (section) section.hidden = false;
        if (count) {
          const reportLabel = typeValue === "weekly" ? "周报" : "月报";
          const scopeLabel = periodValue
            ? "第 " + periodValue + (typeValue === "weekly" ? " 周" : " 月")
            : yearValue + " 年全部" + reportLabel;
          count.textContent = "当前范围：" + yearValue + " 年 · " + scopeLabel +
            (terms.length
              ? " · 匹配 " + matches.length + " 期 · 高亮 " + keywordCount + " 处关键词"
              : " · 显示 1 期");
        }
        if (noResults) noResults.hidden = true;
      } else {
        if (count) count.textContent = "未找到匹配的历史报告";
        if (noResults) {
          noResults.textContent = terms.length
            ? "在所选年份和报告类型的" + (periodValue ? "该期报告" : "历史报告") +
              "中，未找到同时包含关键词“" + terms.join("、") +
              "”的内容。请尝试更换关键词或选择其他年份、报告类型。"
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

    function submitSearch() {
      submittedKeyword = search.value.trim().replace(/\s+/g, " ").toLowerCase();
      refresh();
    }
    if (!searchSubmit.dataset.radarArchiveAttached) {
      searchSubmit.addEventListener("click", submitSearch);
      searchSubmit.dataset.radarArchiveAttached = "1";
    }
    if (!search.dataset.radarArchiveAttached) {
      search.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submitSearch();
        }
      });
      search.addEventListener("input", () => {
        search.style.height = "auto";
        search.style.height = Math.min(search.scrollHeight, 128) + "px";
      });
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
