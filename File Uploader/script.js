 const dropZone     = document.getElementById('dropZone');
  const fileInput    = document.getElementById('fileInput');
  const previewGrid  = document.getElementById('previewGrid');
  const errorBox     = document.getElementById('errorBox');
  const clearAllBtn  = document.getElementById('clearAll');

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  const STORAGE_KEY   = 'uploadedImages';
  const MAX_SIZE_MB   = 2; // keep localStorage usage reasonable

  // ---------- Load persisted images on page load ----------
  window.addEventListener('DOMContentLoaded', loadFromStorage);

  // ---------- Click to browse ----------
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => handleFiles(e.target.files));

  // ---------- Drag & Drop events ----------
  ['dragenter', 'dragover'].forEach(evt =>
    dropZone.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      dropZone.classList.add('drag-over');
    })
  );

  ['dragleave', 'drop'].forEach(evt =>
    dropZone.addEventListener(evt, e => {
      e.preventDefault(); e.stopPropagation();
      dropZone.classList.remove('drag-over');
    })
  );

  dropZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));

  // Prevent browser from opening files dropped outside the zone
  ['dragover', 'drop'].forEach(evt =>
    window.addEventListener(evt, e => e.preventDefault())
  );

  // ---------- Main file handler ----------
  function handleFiles(files) {
    errorBox.innerHTML = '';
    [...files].forEach(file => validateAndProcess(file));
    fileInput.value = ''; // reset so same file can be re-selected
  }

  function validateAndProcess(file) {
    // Type check (MIME)
    if (!ALLOWED_TYPES.includes(file.type)) {
      showError(`❌ "${file.name}" is not a valid image (JPG, PNG, GIF only).`);
      return;
    }
    // Extra extension check for safety
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      showError(`❌ "${file.name}" has an unsupported extension.`);
      return;
    }
    // Size check (to avoid localStorage quota errors)
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showError(`❌ "${file.name}" is too large (max ${MAX_SIZE_MB}MB for persistence).`);
      return;
    }
    processFile(file);
  }

  // ---------- FileReader + simulated progress ----------
  function processFile(file) {
    const reader = new FileReader();
    const id = 'file-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);

    // Build card UI immediately
    const card = document.createElement('div');
    card.className = 'file-card';
    card.id = id;
    card.innerHTML = `
      <button class="remove-btn" title="Remove">✕</button>
      <img src="" alt="${file.name}" />
      <div class="file-info">
        <div class="file-name" title="${file.name}">${file.name}</div>
        <div class="file-size">${(file.size/1024).toFixed(1)} KB</div>
      </div>
      <div class="progress-container"><div class="progress-bar"></div></div>
      <div class="status">Uploading… 0%</div>
    `;
    previewGrid.prepend(card);

    card.querySelector('.remove-btn').onclick = () => removeFile(id);

    // Read file as data URL
    reader.onload = e => {
      const dataUrl = e.target.result;
      card.querySelector('img').src = dataUrl;
      simulateUpload(dataUrl, file, card, id);
    };
    reader.onerror = () => showError(`❌ Failed to read "${file.name}".`);
    reader.readAsDataURL(file);
  }

  // ---------- Simulated progress bar with setTimeout ----------
  function simulateUpload(dataUrl, file, card, id) {
    let progress = 0;
    const bar    = card.querySelector('.progress-bar');
    const status = card.querySelector('.status');

    const tick = () => {
      progress += Math.random() * 18 + 5; // 5-23% per tick
      if (progress >= 100) {
        progress = 100;
        bar.style.width = '100%';
        bar.classList.add('done');
        status.textContent = '✓ Uploaded';
        // Persist to localStorage
        saveToStorage({ id, name: file.name, size: file.size, dataUrl });
        return;
      }
      bar.style.width = progress + '%';
      status.textContent = `Uploading… ${Math.floor(progress)}%`;
      setTimeout(tick, 150 + Math.random() * 200);
    };
    setTimeout(tick, 200);
  }

  // ---------- Error display ----------
  function showError(msg) {
    const div = document.createElement('div');
    div.className = 'error';
    div.textContent = msg;
    errorBox.appendChild(div);
    setTimeout(() => div.remove(), 5000);
  }

  // ---------- localStorage helpers ----------
  function saveToStorage(image) {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // Avoid duplicates by id
      const existing = list.findIndex(i => i.id === image.id);
      if (existing >= 0) list[existing] = image; else list.push(image);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      updateClearButton();
    } catch (err) {
      showError('⚠️ Storage quota exceeded. Older images may need to be cleared.');
    }
  }

  function loadFromStorage() {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.forEach(img => {
      const card = document.createElement('div');
      card.className = 'file-card';
      card.id = img.id;
      card.innerHTML = `
        <button class="remove-btn" title="Remove">✕</button>
        <img src="${img.dataUrl}" alt="${img.name}" />
        <div class="file-info">
          <div class="file-name" title="${img.name}">${img.name}</div>
          <div class="file-size">${(img.size/1024).toFixed(1)} KB</div>
        </div>
        <div class="progress-container"><div class="progress-bar done" style="width:100%"></div></div>
        <div class="status">✓ Uploaded</div>
      `;
      card.querySelector('.remove-btn').onclick = () => removeFile(img.id);
      previewGrid.appendChild(card);
    });
    updateClearButton();
  }

  function removeFile(id) {
    document.getElementById(id)?.remove();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.filter(i => i.id !== id)));
    updateClearButton();
  }

  function updateClearButton() {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    clearAllBtn.style.display = list.length ? 'block' : 'none';
  }

  clearAllBtn.addEventListener('click', () => {
    if (!confirm('Remove all uploaded images?')) return;
    localStorage.removeItem(STORAGE_KEY);
    previewGrid.innerHTML = '';
    updateClearButton();
  });