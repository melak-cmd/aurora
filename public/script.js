document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("objects-list");
  const refreshBtn = document.getElementById("refresh-btn");

  const modal = document.getElementById("item-modal");
  const closeModal = document.getElementById("close-modal");
  const modalName = document.getElementById("modal-name");
  const modalId = document.getElementById("modal-id");
  const modalData = document.getElementById("modal-data");

  // Escape HTML to prevent XSS from API-provided values
  const esc = s =>
    String(s).replace(/[&<>"']/g, c => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));

  // Pretty formatter for objects
  function renderObjectData(data) {
    if (!data || typeof data !== "object") return "<em>No data</em>";

    return Object.entries(data)
      .map(([key, value]) => {
        const display = value !== null && typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
        return `
          <div class="data-row">
            <span class="data-key">${esc(key)}:</span>
            <span class="data-value">${esc(display)}</span>
          </div>
        `;
      })
      .join("");
  }

  async function fetchObjects() {
    try {
      const res = await fetch("/api/objects");

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      renderObjects(await res.json());
    } catch (err) {
      console.error("Failed to load objects:", err);
      listEl.innerHTML = '<li class="load-error">Failed to load objects. Try refreshing.</li>';
    }
  }

  function renderObjects(objects) {
    if (!Array.isArray(objects)) {
      console.error("Unexpected /api/objects response:", objects);
      return;
    }

    listEl.innerHTML = "";

    objects.forEach(obj => {
      const li = document.createElement("li");

      // Background color from data.color (if exists)
      if (obj.data && obj.data.color) {
        li.style.backgroundColor = obj.data.color;
      }

      li.innerHTML = `
        <div class="object-id">ID: ${esc(obj.id)}</div>
        <div class="object-name">${esc(obj.name)}</div>
        <div class="object-data">
          ${renderObjectData(obj.data)}
        </div>
      `;

      li.addEventListener("click", () => {
        modal.style.display = "block";

        modalName.textContent = obj.name;
        modalId.textContent = `ID: ${obj.id}`;
        modalData.innerHTML = renderObjectData(obj.data);

        // Modal background color
        const modalBox = modal.querySelector(".modal-content");
        modalBox.style.backgroundColor = obj.data?.color || "#fff";
      });

      listEl.appendChild(li);
    });
  }

  refreshBtn.addEventListener("click", fetchObjects);
  
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Initial load
  fetchObjects();
});
