async function loadObjects() {
  try {
    const response = await fetch('/api/objects');
    const objects = await response.json();

    const list = document.getElementById('objects-list');
    list.innerHTML = '';

    objects.forEach(obj => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="object-id">ID: ${obj.id}</div>
        <div class="object-name">Name: ${obj.name}</div>
      `;
      li.addEventListener('click', () => showItem(obj.id));
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading objects:', err);
  }
}

async function showItem(id) {
  try {
    const response = await fetch(`https://api.restful-api.dev/objects/${id}`);
    const item = await response.json();

    document.getElementById('modal-name').textContent = item.name;
    document.getElementById('modal-id').textContent = `ID: ${item.id}`;

    const dataDiv = document.getElementById('modal-data');
    dataDiv.innerHTML = '';
    if (item.data) {
      for (const [key, value] of Object.entries(item.data)) {
        dataDiv.innerHTML += `<div><strong>${key}:</strong> ${value}</div>`;
      }
    }

    document.getElementById('item-modal').style.display = 'block';
  } catch (err) {
    console.error('Error loading item:', err);
  }
}

// Close modal
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('item-modal').style.display = 'none';
});

// Load on page open
window.onload = loadObjects;
document.getElementById('refresh-btn').addEventListener('click', loadObjects);