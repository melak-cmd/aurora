document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("objects-list");
  const refreshBtn = document.getElementById("refresh-btn");
  const searchInput = document.getElementById("search");
  const resultCount = document.getElementById("result-count");
  const modal = document.getElementById("item-modal");
  const closeModal = document.getElementById("close-modal");
  const modalName = document.getElementById("modal-name");
  const modalId = document.getElementById("modal-id");
  const modalData = document.getElementById("modal-data");
  let objects = [];
  let lastTrigger = null;

  const esc = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function renderObjectData(data) {
    if (!data || typeof data !== "object" || Array.isArray(data) || !Object.keys(data).length) {
      return '<div class="data-row"><span class="data-value">No additional details</span></div>';
    }
    return Object.entries(data).map(([key, value]) => {
      const display = value !== null && typeof value === "object" ? JSON.stringify(value) : String(value);
      return `<div class="data-row"><span class="data-key">${esc(key)}</span><span class="data-value">${esc(display)}</span></div>`;
    }).join("");
  }

  function showState(title, message, error = false) {
    listEl.innerHTML = `<li class="state${error ? " error" : ""}"><strong>${esc(title)}</strong>${esc(message)}</li>`;
    resultCount.textContent = "";
  }

  function openDetails(object, trigger) {
    lastTrigger = trigger;
    modalName.textContent = object.name || "Unnamed object";
    modalId.textContent = `ID: ${object.id ?? "Unknown"}`;
    modalData.innerHTML = renderObjectData(object.data);
    modal.classList.add("open");
    closeModal.focus();
  }

  function closeDetails() {
    modal.classList.remove("open");
    if (lastTrigger) lastTrigger.focus();
  }

  function renderObjects() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = objects.filter(object => {
      const searchable = [object.id, object.name, JSON.stringify(object.data ?? "")].join(" ").toLowerCase();
      return searchable.includes(query);
    });
    resultCount.textContent = query
      ? `${filtered.length} of ${objects.length} ${objects.length === 1 ? "object" : "objects"}`
      : `${objects.length} ${objects.length === 1 ? "object" : "objects"}`;

    if (!filtered.length) {
      showState(query ? "No matches" : "No objects yet", query ? "Try a different search term." : "There are no objects to display.");
      return;
    }

    listEl.innerHTML = filtered.map((object, index) => {
      const color = typeof object.data?.color === "string" ? object.data.color : "";
      const swatch = color ? `<span class="swatch" style="background-color:${esc(color)}" aria-label="Color: ${esc(color)}"></span>` : "";
      return `<li class="object-card" tabindex="0" role="button" data-index="${index}">
        <div class="card-top"><span class="object-id">ID · ${esc(object.id ?? "Unknown")}</span>${swatch}</div>
        <h3 class="object-name">${esc(object.name || "Unnamed object")}</h3>
        <div class="object-data">${renderObjectData(object.data)}</div>
      </li>`;
    }).join("");
    listEl.querySelectorAll(".object-card").forEach((card, index) => {
      const open = () => openDetails(filtered[index], card);
      card.addEventListener("click", open);
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });
  }

  async function fetchObjects() {
    refreshBtn.disabled = true;
    refreshBtn.textContent = "Loading…";
    showState("Loading objects", "Fetching the latest collection…");
    try {
      const response = await fetch("/api/objects");
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("The server returned an unexpected response.");
      objects = data;
      renderObjects();
    } catch (error) {
      console.error("Failed to load objects:", error);
      showState("Couldn't load objects", "Check your connection and try refreshing.", true);
    } finally {
      refreshBtn.disabled = false;
      refreshBtn.textContent = "↻  Refresh";
    }
  }

  searchInput.addEventListener("input", renderObjects);
  refreshBtn.addEventListener("click", fetchObjects);
  closeModal.addEventListener("click", closeDetails);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeDetails();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeDetails();
  });
  fetchObjects();
});
