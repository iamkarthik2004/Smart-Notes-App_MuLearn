let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* ---------- SAVE ---------- */
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* ---------- DISPLAY ---------- */
function displayNotes() {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";

  notes.forEach((note, index) => {
    container.innerHTML += `
      <div class="note-card">
        <h3>${note.title || "Untitled Note"}</h3>
        <p>${note.content}</p>
        <div class="note-actions">
          <button class="edit" onclick="editNote(${index})">Edit</button>
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

  if (!content) {
    alert("Note content cannot be empty!");
    return;
  }

  notes.push({
    title: title,
    content: content,
    date: new Date().toISOString().slice(0, 10)
  });

  saveNotes();
  displayNotes();

  titleInput.value = "";
  contentInput.value = "";
}

/* ---------- DELETE ---------- */
function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  displayNotes();
}

/* ---------- EDIT ---------- */
function editNote(index) {
  const newTitle = prompt("Edit title:", notes[index].title);
  const newContent = prompt("Edit content:", notes[index].content);

  if (newContent && newContent.trim()) {
    notes[index].title = newTitle;
    notes[index].content = newContent;
    saveNotes();
    displayNotes();
  }
}

/* ---------- DOWNLOAD ---------- */
function downloadNote(index) {
  const note = notes[index];

  const fileName =
    (note.title
      ? note.title.replace(/\s+/g, "_")
      : "note_" + note.date) + ".txt";

  const blob = new Blob([note.content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
}

/* ---------- LOAD ---------- */
displayNotes();
