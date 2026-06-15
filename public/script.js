const API = "https://memovault-rwa5.onrender.com/api/notes";

const modal = document.getElementById("noteModal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");

// OPEN MODAL
addBtn.onclick = () => {
  modal.style.display = "flex";
};

// CLOSE MODAL
closeBtn.onclick = () => {
  modal.style.display = "none";
};

// LOAD NOTES
async function loadNotes() {
  try {
    const res = await fetch(API);
    const notes = await res.json();

    notesContainer.innerHTML = "";

    notes.forEach((note) => {
      const div = document.createElement("div");
      div.className = "note";

      const category = note.category ? note.category.toLowerCase() : "general";

      div.innerHTML = `
        <span class="badge ${category}">
          ${note.category || "General"}
        </span>

        <h3>${note.title}</h3>

        <p>${note.content}</p>

        <div class="actions">
          <button onclick="deleteNote(${note.id})">Delete</button>
          <button onclick="pinNote(${note.id})">📌</button>
        </div>
      `;

      notesContainer.appendChild(div);
    });

  } catch (err) {
    console.error("Load notes failed:", err);
    notesContainer.innerHTML = "<p>Failed to load notes</p>";
  }
}

// SAVE NOTE
saveBtn.onclick = async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const category = document.getElementById("category").value;

  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content, category })
    });

    modal.style.display = "none";
    loadNotes();

  } catch (err) {
    console.error("Save failed:", err);
  }
};

// DELETE NOTE
async function deleteNote(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    loadNotes();
  } catch (err) {
    console.error("Delete failed:", err);
  }
}

// PIN NOTE
async function pinNote(id) {
  try {
    await fetch(`${API}/${id}/pin`, {
      method: "PATCH"
    });

    loadNotes();
  } catch (err) {
    console.error("Pin failed:", err);
  }
}

// SEARCH
searchInput.addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();

  const res = await fetch(API);
  const notes = await res.json();

  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(term)
  );

  notesContainer.innerHTML = "";

  filtered.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";

    const category = note.category ? note.category.toLowerCase() : "general";

    div.innerHTML = `
      <span class="badge ${category}">
        ${note.category || "General"}
      </span>

      <h3>${note.title}</h3>

      <p>${note.content}</p>
    `;

    notesContainer.appendChild(div);
  });
});

// INIT
window.onload = loadNotes;