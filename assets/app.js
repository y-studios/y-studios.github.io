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

  const renderInto = (list, gridEl, countEl2) => {
    countEl2.textContent = `(${list.length})`;

    if (list.length === 0) {
      gridEl.innerHTML = `<div class="empty">まだ何も置かれていません。<br>URL を渡してもらえれば、ここに並んでいきます。</div>`;
      return;
    }

    // 登録日の新しい順。同じ日なら後から足したもの(配列の後ろ)を先に出す
    list
      .map((p, i) => ({ p, i }))
      .sort((a, b) => b.p.registeredAt.localeCompare(a.p.registeredAt) || b.i - a.i)
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

  // GitHub Pagesは10分キャッシュ(max-age=600)のため、登録直後でも常に最新を取る
  const load = (path, gridEl, countEl2) => {
    fetch(`${path}?t=${Date.now()}`)
      .then((r) => r.json())
      .then((list) => renderInto(list, gridEl, countEl2))
      .catch(() => {
        gridEl.innerHTML = `<div class="empty">一覧を読み込めませんでした。</div>`;
      });
  };

  load("data/products.json", grid, countEl);
  load("data/services.json", document.getElementById("service-grid"), document.getElementById("service-count"));
})();
