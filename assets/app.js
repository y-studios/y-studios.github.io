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

  const render = (products) => {
    countEl.textContent = `(${products.length})`;

    if (products.length === 0) {
      grid.innerHTML = `<div class="empty">まだ何も置かれていません。<br>URL を渡してもらえれば、ここに並んでいきます。</div>`;
      return;
    }

    products
      .slice()
      .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
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
        grid.appendChild(card);
      });
  };

  fetch("data/products.json")
    .then((r) => r.json())
    .then(render)
    .catch(() => {
      grid.innerHTML = `<div class="empty">プロダクト一覧を読み込めませんでした。</div>`;
    });
})();
