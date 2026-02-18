const mongoose = require('mongoose');
const Note = require('./models/Note');
require('dotenv').config();

async function testFetchNotes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        console.log('Attempting to fetch notes...');
        // Mock query similar to notes.js
        const query = { userId: new mongoose.Types.ObjectId() };
        const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
        console.log('Fetched successfully! Count:', notes.length);

        process.exit(0);
    } catch (error) {
        console.error('DIAGNOSTIC ERROR:', error);
        process.exit(1);
    }
}

testFetchNotes();
