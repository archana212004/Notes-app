const express = require('express');
const router = express.Router();
const Note = require('../Models/note_model');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token." });
    }
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all notes for a user
router.get('/', async (req, res) => {
    try {
        console.log('📝 Fetching notes for user:', req.user.userId);
        const notes = await Note.find({ userId: req.user.userId })
            .sort({ isPinned: -1, createdOn: -1 });
        console.log(`✅ Found ${notes.length} notes`);
        res.json({ notes });
    } catch (error) {
        console.error('❌ Error fetching notes:', error);
        res.status(500).json({ error: "Error fetching notes" });
    }
});

// Create a new note
router.post('/', async (req, res) => {
    try {
        console.log('📝 Creating new note:', req.body);
        const { title, content, tags } = req.body;
        
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const note = new Note({
            title: title.trim(),
            content: content.trim(),
            tags: tags || [],
            userId: req.user.userId,
            isPinned: false,
            createdOn: new Date()
        });

        const savedNote = await note.save();
        console.log('✅ Note created successfully:', savedNote._id);
        res.status(201).json({ 
            message: "Note created successfully",
            note: savedNote
        });
    } catch (error) {
        console.error('❌ Error creating note:', error);
        res.status(500).json({ error: "Error creating note" });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        console.log('📝 Updating note:', req.params.id);
        const { title, content, tags } = req.body;
        
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const note = await Note.findOne({ _id: req.params.id, userId: req.user.userId });
        
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        note.title = title.trim();
        note.content = content.trim();
        note.tags = tags || [];
        
        const updatedNote = await note.save();
        console.log('✅ Note updated successfully:', updatedNote._id);
        res.json({ 
            message: "Note updated successfully",
            note: updatedNote
        });
    } catch (error) {
        console.error('❌ Error updating note:', error);
        res.status(500).json({ error: "Error updating note" });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        console.log('🗑️ Deleting note:', req.params.id);
        const note = await Note.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        console.log('✅ Note deleted successfully:', req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error('❌ Error deleting note:', error);
        res.status(500).json({ error: "Error deleting note" });
    }
});

// Toggle pin status
router.patch('/:id/pin', async (req, res) => {
    try {
        console.log('📌 Toggling pin status for note:', req.params.id);
        const note = await Note.findOne({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        console.log('✅ Pin status updated successfully:', note._id, note.isPinned);
        res.json({ 
            message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
            note
        });
    } catch (error) {
        console.error('❌ Error toggling pin status:', error);
        res.status(500).json({ error: "Error updating pin status" });
    }
});

module.exports = router; 