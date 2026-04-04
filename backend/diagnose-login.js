const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function diagnoseLogin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const email = 'vijetachandel1709@gmail.com';
        const passwordToTest = 'password123';

        console.log(`Searching for user: ${email}...`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('FAIL: User not found in database.');
            process.exit(1);
        }

        console.log('User found. Hashed password in DB:', user.password);

        console.log(`Testing password: "${passwordToTest}"...`);
        const isMatch = await user.comparePassword(passwordToTest);

        if (isMatch) {
            console.log('SUCCESS: Password matches correctly using user.comparePassword()');
        } else {
            console.log('FAIL: Password does NOT match.');

            // Manual test
            const manualMatch = await bcrypt.compare(passwordToTest, user.password);
            console.log('Manual bcrypt.compare result:', manualMatch);
        }

        process.exit(0);
    } catch (error) {
        console.error('DIAGNOSTIC ERROR:', error);
        process.exit(1);
    }
}

diagnoseLogin();
