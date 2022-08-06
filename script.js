class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.title = "";
        this.tagline = "";
        this.text = "";
        this.id = "";

        this.form = document.querySelector('#form');
        this.noteTitle = document.querySelector('#note-title');
        this.noteText = document.querySelector('#note-text');
        this.noteTagline = document.querySelector('#note-tagline');
        this.formButtons = document.querySelector('#form-buttons');
        this.$notes = document.querySelector('#notes');
        this.formCloseButton = document.querySelector('#form-close-button');
        this.modal = document.querySelector('.modal');
        this.modalTitle = document.querySelector('.modal-title');
        this.modalTagline = document.querySelector('.modal-tagline');
        this.modalText = document.querySelector('.modal-text');
        this.modalCloseButton = document.querySelector('.modal-close-button');
        this.colorToolTip = document.querySelector('#color-tooltip');
        this.info = document.querySelector('#info');

        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        document.body.addEventListener('click', event => {
            this.handleFormClick(event);
            this.deleteNote(event);
            this.selectNote(event);
            this.openModal(event);
        })

        this.form.addEventListener('submit', event => {
            event.preventDefault();
            const title = this.noteTitle.value;
            const text = this.noteText.value;
            const tagline = this.noteTagline.value;
            const hasNotes = title || text || tagline
            if(hasNotes) {
                this.addNote({ title, tagline, text })
            }

            this.noteTitle.value = ''
            this.noteTagline.value = ''
            this.noteText.value = ''
            console.log(this.notes)
        })

        this.formCloseButton.addEventListener('click', event => {
            event.stopPropagation();
            this.closeForm();
        })

        this.modalCloseButton.addEventListener('click', event => {
            this.closeModal(event);
        })

        document.body.addEventListener('mouseover', event => {
            this.openToolTip(event);
        })

        document.body.addEventListener('mouseout', event => {
            this.closeToolTip(event);
        })

        this.colorToolTip.addEventListener('mouseover', function() {
            this.style.display = "flex";
        })

        this.colorToolTip.addEventListener('mouseout', function() {
            this.style.display = "none";
        })

        this.colorToolTip.addEventListener('click', event => {
            const color = event.target.dataset.color;
            if(color) {
                this.editNoteColor(color)
            }
        });
    }

    handleFormClick(event) {
        const isFormClicked = this.form.contains(event.target)
        console.log(isFormClicked)
        const title = this.noteTitle.value;
        const tagline = this.noteTagline.value;
        const text = this.noteText.value;
        const hasNotes = title || text || tagline

        if(isFormClicked) {
            this.openForm()
        } else if(hasNotes) {
            this.addNote({ title, tagline, text })
        } else {
            this.closeForm()
        }
    }

    openForm() {
        this.form.classList.add('form-open');
        this.noteTitle.style.display = 'block';
        this.noteTagline.style.display = 'block';
        this.formButtons.style.display = 'block';
    }

    closeForm() {
        this.form.classList.remove('form-open');
        this.noteTitle.style.display = 'none';
        this.noteTagline.style.display = 'none';
        this.formButtons.style.display = 'none';
        this.noteTitle.value = '';
        this.noteTagline.value = '';
        this.noteText.value = '';
    }

    openModal(event) {
        if(event.target.matches('.toolbar-delete')) return
        if(event.target.matches('.toolbar-color')) return
        if(event.target.closest('.note')) {
            this.modal.classList.toggle('open-modal')
            this.modalTitle.value = this.title;
            this.modalTagline.value = this.tagline;
            this.modalText.value = this.text;
        }
    }

    closeModal(event) {
        this.editNote();
        this.modal.classList.toggle('open-modal');
    }

    addNote({ title, tagline, text }) {
        const newNote = {
            id: this.notes.length > 0 ? this.notes.length + 1 : 1,
            title,
            tagline,
            text,
            color: 'white'
        }
        this.notes = [...this.notes, newNote]
        this.render();
        this.closeForm();
    }

    editNote() {
        const title = this.modalTitle.value;
        const tagline = this.modalTagline.value;
        const text = this.modalText.value;
        this.notes = this.notes.map(note => note.id === Number(this.id) ? {...note, title, tagline, text} : note);
        this.render();
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note => note.id === Number(this.id) ? {...note, color} : note)
        this.render();
    }

    deleteNote(event) {
        event.stopPropagation();
        if(!event.target.matches('.toolbar-delete')) return
        const id = event.target.dataset.id
        console.log(id)
        this.notes = this.notes.filter(note => note.id !== Number(id));
        this.render();
    }

    selectNote(event) {
        const selectedNote = event.target.closest('.note')
        if(!selectedNote) return
        const [noteTitle, noteTagline, noteText] = selectedNote.children;
        this.title = noteTitle.innerText;
        this.tagline = noteTagline.innerText;
        this.text = noteText.innerText;
        this.id = selectedNote.dataset.id;
    }

    openToolTip(event) {
        if(!event.target.matches('.toolbar-color')) return
        this.id = event.target.nextElementSibling.dataset.id;
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = noteCoords.left;
        const vertical = window.scrollY - 22;
        this.colorToolTip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.colorToolTip.style.display = "flex";
    }

    closeToolTip(event) {
        if (!event.target.matches(".toolbar-color")) return;
        this.colorToolTip.style.display = "none";
    }

    render() {
        this.saveNotes();
        this.displayNotes();
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }

    displayNotes() {
        const hasNotes = this.notes.length > 0
        this.info.style.display = hasNotes ? 'none' : 'flex';
        
        this.$notes.innerHTML = this.notes.map(note => `
        <div class="note" style="background: ${note.color}" data-id="${note.id}">
            <div class="${note.title} && note-title">
                ${note.title}
            </div>
            <div class="note-tagline">
                ${note.tagline}
            </div>
            <div class="note-text">
                ${note.text}
            </div>
            <div class="toolbar-container">
                <div class="toolbar">
                    <img src="./assets/palette.png" data-id=${note.id} class="toolbar-color">
                    <img src="./assets/delete.png" data-id=${note.id} class="toolbar-delete">
                </div>
            </div>
        </div>
        `).join('');
    }

    
}

new App();