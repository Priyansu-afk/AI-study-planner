const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;
    const note = new Note({
      userId: req.user.userId,
      title,
      content,
      isPinned
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, isPinned, updatedAt: Date.now() },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};
