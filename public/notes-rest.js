const SERVER = axios.create({
    baseURL: 'http://localhost:3000'
})

async function loadNotes() {
    let res = await SERVER.get("/notes")
    let notes = res.data.map((note, idx)=>`
        <li>
            ${note.text} - order: ${note.order} 
            <a onclick="deleteNote('${note._id}')" style="cursor: pointer;font-size:small">&#128686;</a>
            <a onclick="sentToTop('${note._id}')" style="cursor: pointer;font-size:small; border: 1px solid">send to top</a>
        </li>
    `).join("");
    document.getElementById("placeholder").innerHTML = `
        <ul>${notes}</ul>
    `;
}

async function addNote() {
    let noteInput = document.getElementById("noteText");
    let noteText = noteInput.value;
    await SERVER.post("/notes", {text:noteText})
    noteInput.value = "";
    await loadNotes();
}

async function deleteNote(idx) {
    await SERVER.delete(`/notes/${idx}`);
    await loadNotes();
}

async function sentToTop(idx) {
    await SERVER.get(`/notes/send-to-top/${idx}`);
    await loadNotes();
}

loadNotes();
