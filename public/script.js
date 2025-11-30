document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("objects-list");
  const refreshBtn = document.getElementById("refresh-btn");

  const modal = document.getElementById("item-modal");
  const closeModal = document.getElementById("close-modal");
  const modalName = document.getElementById("modal-name");
  const modalId = document.getElementById("modal-id");
  const modalData = document.getElementById("modal-data");

  async function fetchObjects() {
    const res = await fetch("/api/objects");
    const objects = await res.json();

    listEl.innerHTML = "";
    objects.forEach(obj => {
      const li = document.createElement("li");

      // Bind background color if data has a "color" property
      if (obj.data && obj.data.color) {
        li.style.backgroundColor = obj.data.color;
      }

      li.innerHTML = `
        <div class="object-id">ID: ${obj.id}</div>
        <div class="object-name">${obj.name}</div>
        <div class="object-data">${JSON.stringify(obj.data)}</div>
      `;

      li.addEventListener("click", () => {
        modal.style.display = "block";
        modalName.textContent = obj.name;
        modalId.textContent = `ID: ${obj.id}`;
        modalData.textContent = JSON.stringify(obj.data, null, 2);

        // Also bind modal background color
        if (obj.data && obj.data.color) {
          modal.querySelector(".modal-content").style.backgroundColor = obj.data.color;
        } else {
          modal.querySelector(".modal-content").style.backgroundColor = "#fff";
        }
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