const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (req, h) => {
	const { title, tags, body } = req.payload;
	const id = nanoid(16);
	const createdAt = new Date().toISOString();
	const updatedAt = new Date().toISOString();

	const newNote = { id, title, tags, body, createdAt, updatedAt };

	notes.push(newNote);

	const isSucces = notes.filter((note) => note.id === id).length > 0;

	if (isSucces) {
		const resp = h.response({
			status: "success",
			message: "Catatan Berhasil Ditambahkan !",
			data: { noteId: id },
		});
		resp.code(201);
		return resp;
	}

	const resp = h.response({
		status: "fail",
		message: "Catatan Gagal Ditambahkan!",
	});
	resp.code(500);
	return resp;
};

const getAllNotesHandler = () => ({
	status: "success",
	data: {
		notes,
	},
});

const getNoteById = (req, h) => {
	const { id } = req.params;
	const note = notes.filter((note) => note.id === id)[0];

	if (note !== undefined) {
		return {
			status: "success",
			data: {
				note,
			},
		};
	}

	const resp = h.response({
		status: "fail",
		message: "Note Tidak Ditemukan",
	});
	resp.code(404);
	return resp;
};

const editNoteHandler = (req, h) => {
	const { id } = req.params;
	const { title, body, tags } = req.payload;
	const noteIndex = notes.findIndex((n) => n.id === id);
	const updatedAt = new Date().toISOString();

	if (noteIndex !== -1) {
		notes[noteIndex] = {
			...notes[noteIndex],
			title,
			tags,
			body,
			updatedAt,
		};
		const resp = h.response({
			status: "success",
			message: "Berhasil Mengedit Note",
		});
		resp.code(200);
		return resp;
	}

	const resp = h.response({
		status: "fail",
		message: "Gagal mengedit Note, id tidak ditemukan",
	});
	resp.code(404);
	return resp;
};

const deleteNoteHandler = (req, h) => {
	const { id } = req.params;
	const noteIndex = notes.findIndex((n) => n.id === id);

	if (noteIndex !== -1) {
		notes.splice(noteIndex, 1);
		const resp = h.response({
			status: "success",
			message: "Berhasil Menghapus Catatan",
		});
		resp.code(200);
		return resp;
	}

	const resp = h.response({
		status: "fail",
		message: "Gagal Menghapus Note, Id tidak ditemukan",
	});
	resp.code(404);
	return resp;
};

module.exports = {
	addNoteHandler,
	getAllNotesHandler,
	getNoteById,
	editNoteHandler,
	deleteNoteHandler,
};
