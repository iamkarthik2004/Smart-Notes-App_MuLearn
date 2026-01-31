let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentEditIndex = null;
let sortOrder = localStorage.getItem("sortOrder") || "newest";

document.getElementById("sortSelect").value = sortOrder;

/* ---------- THEME ---------- */
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* ---------- STORAGE ---------- */
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* ---------- SORT ---------- */
function changeSort() {
  sortOrder = sortSelect.value;
  localStorage.setItem("sortOrder", sortOrder);
  applyFilters();
}

/* ---------- DISPLAY ---------- */
function displayNotes(list) {
  notesContainer.innerHTML = "";

  list.forEach(note => {
    const index = notes.indexOf(note);

    notesContainer.innerHTML += `
      <div class="note-card ${note.pinned ? "pinned" : ""}">
        ${note.pinned ? '<span class="pin-icon">📌</span>' : ""}
        <h3>${note.title || "Untitled Note"}</h3>
        <p>${note.content}</p>
        <div class="note-actions">
          <button class="pin" onclick="togglePin(${index})">
            ${note.pinned ? "Unpin" : "Pin"}
          </button>
          <button class="edit" onclick="openEdit(${index})">Edit</button>
          <button class="delete" onclick="deleteNote(${index})">Delete</button>
          <button class="download" onclick="downloadNote(${index})">Download</button>
        </div>
      </div>
    `;
  });
}

/* ---------- FILTER + SORT ---------- */
function applyFilters() {
  const query = searchInput.value.toLowerCase();

  let filtered = notes.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.content.toLowerCase().includes(query)
  );

  // separate pinned & unpinned
  const pinned = filtered.filter(n => n.pinned);
  let unpinned = filtered.filter(n => !n.pinned);

  unpinned.sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  displayNotes([...pinned, ...unpinned]);
}

/* ---------- ADD ---------- */
function addNote() {
  if (!contentInput.value.trim()) return alert("Note content cannot be empty!");

  notes.push({
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    pinned: false,
    date: new Date().toISOString()
  });

  saveNotes();
  titleInput.value = "";
  contentInput.value = "";
  applyFilters();
}

/* ---------- PIN ---------- */
function togglePin(index) {
  notes[index].pinned = !notes[index].pinned;
  saveNotes();
  applyFilters();
}

/* ---------- DELETE ---------- */
function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  applyFilters();
}

/* ---------- EDIT ---------- */
function openEdit(index) {
  currentEditIndex = index;
  editTitle.value = notes[index].title;
  editContent.value = notes[index].content;
  editModal.style.display = "flex";
}

function closeModal() {
  editModal.style.display = "none";
}

function saveEdit() {
  if (!editContent.value.trim()) return alert("Note content cannot be empty!");

  notes[currentEditIndex].title = editTitle.value.trim();
  notes[currentEditIndex].content = editContent.value.trim();

  saveNotes();
  closeModal();
  applyFilters();
}

/* ---------- DOWNLOAD ---------- */
function downloadNote(index) {
  const note = notes[index];
  const name =
    (note.title ? note.title.replace(/\s+/g, "_") : "note") + ".txt";

  const blob = new Blob([note.content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

/* ---------- LOAD ---------- */
applyFilters();
