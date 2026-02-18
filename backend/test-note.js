const mongoose = require('mongoose');
const Note = require('./models/Note');
const User = require('./models/User');
require('dotenv').config();

async function testCreateNote() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // Find a user or create a temp one
        let user = await User.findOne();
        if (!user) {
            user = new User({ name: 'Temp', email: 'temp@example.com', password: 'password123' });
            await user.save();
        }

        console.log('Attempting to create note for user:', user._id);
        const note = new Note({
            userId: user._id,
            title: 'Test Note ' + Date.now(),
            content: 'This is a test note.'
        });

        await note.save();
        console.log('Note saved successfully!');

        await Note.deleteOne({ _id: note._id });
        console.log('Test note cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('DIAGNOSTIC ERROR:', error);
        process.exit(1);
    }
}

testCreateNote();
