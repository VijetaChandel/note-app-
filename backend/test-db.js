const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testRegistration() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const testEmail = 'test' + Date.now() + '@example.com';
        console.log('Attempting to save user with email:', testEmail);

        const user = new User({
            name: 'Test User',
            email: testEmail,
            password: 'password123'
        });

        await user.save();
        console.log('User saved successfully!');

        await User.deleteOne({ email: testEmail });
        console.log('Test user cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('DIAGNOSTIC ERROR:', error);
        process.exit(1);
    }
}

testRegistration();
