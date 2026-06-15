const API = "http://localhost:3000/api/notes";

const modal = document.getElementById("noteModal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");

addBtn.onclick = () => {
  modal.style.display = "flex";
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

async function loadNotes() {
  const res = await fetch(API);
  const notes = await res.json();

  notesContainer.innerHTML = "";

  notes.forEach((note) => {

    const div = document.createElement("div");
    div.className = "note";

    div.innerHTML = `
      <span class="badge ${note.category.toLowerCase()}">
        ${note.category}
      </span>

      <h3>${note.title}</h3>

      <p>${note.content}</p>

      <div class="actions">
        <button onclick="deleteNote(${note.id})">
          Delete
        </button>

        <button onclick="pinNote(${note.id})">
          📌
        </button>
      </div>
    `;

    notesContainer.appendChild(div);
  });
}

saveBtn.onclick = async () => {

  const title =
    document.getElementById("title").value;

  const content =
    document.getElementById("content").value;

  const category =
    document.getElementById("category").value;

  await fetch(API,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      title,
      content,
      category
    })
  });

  modal.style.display = "none";

  loadNotes();
};

async function deleteNote(id){
  await fetch(`${API}/${id}`,{
    method:"DELETE"
  });

  loadNotes();
}

async function pinNote(id){
  await fetch(`${API}/${id}/pin`,{
    method:"PATCH"
  });

  loadNotes();
}

searchInput.addEventListener(
  "input",
  async (e)=>{
    const term =
      e.target.value.toLowerCase();

    const res =
      await fetch(API);

    const notes =
      await res.json();

    const filtered =
      notes.filter(
        note =>
          note.title
          .toLowerCase()
          .includes(term)
      );

    notesContainer.innerHTML="";

    filtered.forEach(note=>{

      const div =
        document.createElement("div");

      div.className="note";

      div.innerHTML=`
        <span class="badge ${note.category.toLowerCase()}">
          ${note.category}
        </span>

        <h3>${note.title}</h3>

        <p>${note.content}</p>
      `;

      notesContainer.appendChild(div);
    });
  }
);

loadNotes();