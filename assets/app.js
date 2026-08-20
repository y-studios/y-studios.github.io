(() => {
  const grid = document.getElementById("product-grid");
  const countEl = document.getElementById("product-count");
  const modal = document.getElementById("modal");
  const modalIcon = document.getElementById("modal-icon");
  const modalName = document.getElementById("modal-name");
  const modalTagline = document.getElementById("modal-tagline");
  const modalDesc = document.getElementById("modal-desc");
  const modalDate = document.getElementById("modal-date");
  const modalTags = document.getElementById("modal-tags");
  const modalLink = document.getElementById("modal-link");

  const formatDate = (iso) => iso.replaceAll("-", ".");

  const openModal = (p) => {
    modalIcon.src = p.icon;
    modalName.textContent = p.name;
    modalTagline.textContent = p.tagline || "";
    modalDesc.textContent = p.description || "";
    modalDate.textContent = `登録日 ${formatDate(p.registeredAt)}`;
    modalTags.textContent = (p.tags || []).map((t) => `#${t}`).join("  ");
    modalLink.href = p.url;
    modal.hidden = false;
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  const renderCards = (list, gridEl, emptyMessage) => {
    gridEl.innerHTML = "";

    if (list.length === 0) {
      gridEl.innerHTML = `<div class="empty">${emptyMessage}</div>`;
      return;
    }

    // 登録日の新しい順。同じ日なら後から足したもの(配列の先頭に近いもの)を先に出す
    list
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p.registeredAt.localeCompare(a.p.registeredAt) || a.i - b.i)
      .map(({ p }) => p)
      .forEach((p) => {
        const card = document.createElement("button");
        card.className = "card";
        card.type = "button";
        card.innerHTML = `
          <div class="card-visual"><img src="${p.icon}" alt="" loading="lazy"></div>
          <div class="card-body">
            <div class="card-name"></div>
            <p class="card-tagline"></p>
            <span class="card-date">${formatDate(p.registeredAt)}</span>
          </div>`;
        card.querySelector(".card-name").textContent = p.name;
        card.querySelector(".card-tagline").textContent = p.tagline || "";
        card.addEventListener("click", () => openModal(p));
        gridEl.appendChild(card);
      });
  };

  // タグの出現数が少ない(1件だけ)ものは一覧が長くなりすぎるので、
  // ある程度母数があるセクションでは2件以上のタグだけをフィルタ候補にする
  const buildFilterTags = (list) => {
    const counts = {};
    list.forEach((p) => (p.tags || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const all = Object.keys(counts);
    const frequent = all.filter((t) => counts[t] >= 2);
    return (frequent.length >= 4 ? frequent : all).sort(
      (a, b) => counts[b] - counts[a] || a.localeCompare(b)
    );
  };

  const setupSection = (path, gridEl, countEl2, tagsEl) => {
    fetch(`${path}?t=${Date.now()}`)
      .then((r) => r.json())
      .then((list) => {
        if (list.length === 0) {
          countEl2.textContent = "(0)";
          renderCards([], gridEl, "まだ何も置かれていません。<br>URL を渡してもらえれば、ここに並んでいきます。");
          return;
        }

        let activeTag = null;

        const applyFilter = () => {
          const filtered = activeTag
            ? list.filter((p) => (p.tags || []).includes(activeTag))
            : list;
          countEl2.textContent = `(${filtered.length})`;
          renderCards(filtered, gridEl, "該当するタグのプロダクトはありません。");
        };

        const tags = buildFilterTags(list);
        if (tags.length > 0) {
          const pills = [{ label: "すべて", tag: null }, ...tags.map((t) => ({ label: `#${t}`, tag: t }))];
          pills.forEach(({ label, tag }) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "tag-pill";
            btn.textContent = label;
            if (tag === null) btn.classList.add("active");
            btn.addEventListener("click", () => {
              // 同じタグをもう一度押したら解除して「すべて」に戻す
              activeTag = activeTag === tag ? null : tag;
              tagsEl.querySelectorAll(".tag-pill").forEach((b) => b.classList.remove("active"));
              const active = activeTag === null ? tagsEl.querySelector(".tag-pill") : btn;
              active.classList.add("active");
              applyFilter();
            });
            tagsEl.appendChild(btn);
          });
        }

        applyFilter();
      })
      .catch(() => {
        renderCards([], gridEl, "一覧を読み込めませんでした。");
      });
  };

  // GitHub Pagesは10分キャッシュ(max-age=600)のため、登録直後でも常に最新を取る
  setupSection("data/products.json", grid, countEl, document.getElementById("product-tags"));
  setupSection(
    "data/services.json",
    document.getElementById("service-grid"),
    document.getElementById("service-count"),
    document.getElementById("service-tags")
  );
})();
