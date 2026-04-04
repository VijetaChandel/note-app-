const express = require('express');
const router = express.Router();
const { processNoteWithAI } = require('../controllers/aiController');

router.post('/process', processNoteWithAI);

module.exports = router;
