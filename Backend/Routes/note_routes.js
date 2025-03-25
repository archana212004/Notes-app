const express = require('express');
const router = express.Router();
const Note = require('../Models/note_model');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: "Access denied. No token provided." 
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ 
            success: false,
            error: "Invalid token." 
        });
    }
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all notes for a user
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId })
            .sort({ isPinned: -1, createdOn: -1 });
        
        res.json({ 
            success: true,
            message: "Notes fetched successfully",
            notes,
            count: notes.length
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ 
            success: false,
            error: "Error fetching notes",
            details: error.message 
        });
    }
});

// Create a new note
router.post('/', async (req, res) => {
    try {
        const { title, content, tags, isPinned } = req.body;
        
        if (!title?.trim()) {
            return res.status(400).json({ 
                success: false,
                error: "Title is required" 
            });
        }
        if (!content?.trim()) {
            return res.status(400).json({ 
                success: false,
                error: "Content is required" 
            });
        }

        const note = new Note({
            title: title.trim(),
            content: content.trim(),
            tags: tags || [],
            userId: req.user.userId,
            isPinned: isPinned || false,
            createdOn: new Date()
        });

        const savedNote = await note.save();
        
        res.status(201).json({ 
            success: true,
            message: "Note created successfully",
            note: savedNote
        });
    } catch (error) {
        console.error('Error creating note:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                error: error.message 
            });
        }
        res.status(500).json({ 
            success: false,
            error: "Error creating note",
            details: error.message 
        });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, isPinned } = req.body;
        
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ 
                success: false,
                error: "Title and content are required" 
            });
        }

        const note = await Note.findOne({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });
        
        if (!note) {
            return res.status(404).json({ 
                success: false,
                error: "Note not found" 
            });
        }

        note.title = title.trim();
        note.content = content.trim();
        note.tags = tags || [];
        note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;
        
        const updatedNote = await note.save();
        
        res.json({ 
            success: true,
            message: "Note updated successfully",
            note: updatedNote
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ 
            success: false,
            error: "Error updating note",
            details: error.message 
        });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });

        if (!note) {
            return res.status(404).json({ 
                success: false,
                error: "Note not found" 
            });
        }

        res.json({ 
            success: true,
            message: "Note deleted successfully",
            noteId: req.params.id
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ 
            success: false,
            error: "Error deleting note",
            details: error.message 
        });
    }
});

// Toggle pin status
router.patch('/:id/pin', async (req, res) => {
    try {
        const note = await Note.findOne({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });

        if (!note) {
            return res.status(404).json({ 
                success: false,
                error: "Note not found" 
            });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        res.json({ 
            success: true,
            message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
            note
        });
    } catch (error) {
        console.error('Error toggling pin status:', error);
        res.status(500).json({ 
            success: false,
            error: "Error updating pin status",
            details: error.message 
        });
    }
});

module.exports = router; 