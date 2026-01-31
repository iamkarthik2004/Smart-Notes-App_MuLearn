let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentEditIndex = null;

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

/* ---------- DISPLAY ---------- */
function displayNotes(filteredNotes = null) {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";

  const list = filteredNotes || [...notes].sort((a, b) => b.pinned - a.pinned);

  list.forEach(note => {
    const index = notes.indexOf(note);

    container.innerHTML += `
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

/* ---------- ADD ---------- */
function addNote() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!content) return alert("Note content cannot be empty!");

  notes.push({
    title,
    content,
    pinned: false,
    date: new Date().toISOString().slice(0, 10)
  });

  saveNotes();
  displayNotes();

  titleInput.value = "";
  contentInput.value = "";
}

/* ---------- SEARCH ---------- */
function searchNotes() {
  const query = searchInput.value.toLowerCase();

  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query)
  );

  displayNotes(filtered);
}

/* ---------- PIN ---------- */
function togglePin(index) {
  notes[index].pinned = !notes[index].pinned;
  saveNotes();
  searchNotes();
}

/* ---------- DELETE ---------- */
function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  searchNotes();
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
  const title = editTitle.value.trim();
  const content = editContent.value.trim();

  if (!content) return alert("Note content cannot be empty!");

  notes[currentEditIndex].title = title;
  notes[currentEditIndex].content = content;

  saveNotes();
  closeModal();
  searchNotes();
}

/* ---------- DOWNLOAD ---------- */
function downloadNote(index) {
  const note = notes[index];
  const fileName =
    (note.title ? note.title.replace(/\s+/g, "_") : "note_" + note.date) + ".txt";

  const blob = new Blob([note.content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
}

/* ---------- LOAD ---------- */
displayNotes();
