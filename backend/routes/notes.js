const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(auth);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', async (req, res) => {
    console.log('POST /api/notes called');
    console.log('req.userId:', req.userId);
    console.log('req.body:', req.body);
    try {
        const { title, content, tags, priority, backgroundColor } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        const note = new Note({
            userId: req.userId,
            title,
            content,
            tags: tags || [],
            priority: priority || 'Low',
            backgroundColor: backgroundColor || '#ffffff'
        });

        await note.save();

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note
        });
    } catch (error) {
        console.error('Create note error full stack:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/notes
// @desc    Get all notes with filters
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { search, tag, priority, archived, deleted } = req.query;

        // Build query
        let query = { userId: req.userId };

        // Filter by archived status
        if (archived === 'true') {
            query.isArchived = true;
            query.isDeleted = false;
        } else if (deleted === 'true') {
            query.isDeleted = true;
        } else {
            query.isArchived = false;
            query.isDeleted = false;
        }

        // Search in title and content
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by tag
        if (tag) {
            query.tags = tag;
        }

        // Filter by priority
        if (priority) {
            query.priority = priority;
        }

        const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

        res.json({
            success: true,
            count: notes.length,
            notes
        });
    } catch (error) {
        console.error('Get notes error full stack:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            note
        });
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, priority, backgroundColor } = req.body;

        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        // Update fields
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags !== undefined) note.tags = tags;
        if (priority) note.priority = priority;
        if (backgroundColor) note.backgroundColor = backgroundColor;

        await note.save();

        res.json({
            success: true,
            message: 'Note updated successfully',
            note
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/notes/:id/pin
// @desc    Toggle pin status
// @access  Private
router.put('/:id/pin', async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        res.json({
            success: true,
            message: note.isPinned ? 'Note pinned' : 'Note unpinned',
            note
        });
    } catch (error) {
        console.error('Pin note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/notes/:id/archive
// @desc    Toggle archive status
// @access  Private
router.put('/:id/archive', async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        note.isArchived = !note.isArchived;
        await note.save();

        res.json({
            success: true,
            message: note.isArchived ? 'Note archived' : 'Note unarchived',
            note
        });
    } catch (error) {
        console.error('Archive note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/notes/:id
// @desc    Soft delete (move to trash)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        note.isDeleted = true;
        await note.save();

        res.json({
            success: true,
            message: 'Note moved to trash',
            note
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/notes/:id/permanent
// @desc    Permanent delete
// @access  Private
router.delete('/:id/permanent', async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            message: 'Note permanently deleted'
        });
    } catch (error) {
        console.error('Permanent delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/notes/:id/restore
// @desc    Restore note from trash
// @access  Private
router.put('/:id/restore', async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        note.isDeleted = false;
        await note.save();

        res.json({
            success: true,
            message: 'Note restored successfully',
            note
        });
    } catch (error) {
        console.error('Restore note error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
