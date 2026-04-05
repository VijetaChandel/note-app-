const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');

const createTransporter = () => {
    // If Gmail credentials are missing, use a mock transporter that logs the email instead of sending
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Gmail credentials not set. Skipping real email sending.');
        return {
            sendMail: async (mailOptions) => {
                console.log('Mock email sent:', mailOptions);
                return Promise.resolve();
            },
        };
    }
    // Real Gmail transporter using service: 'gmail'
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendResetEmail = async (email, resetUrl) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'NoteKeeper Password Reset',
        html: `
            <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
                <h2>Password Reset Requested</h2>
                <p>You requested a password reset for your NoteKeeper account.</p>
                <p>Click the link below to set your new password. This link expires in 10 minutes.</p>
                <p><a href="${resetUrl}" style="display:inline-block; padding:10px 16px; background:#1e3a5f; color:#fff; text-decoration:none; border-radius:6px;">Reset Password</a></p>
                <p>If you did not request this, you can safely ignore this email.</p>
            </div>
        `
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        // Validation check for mandatory Env Vars to prevent 500 crashes
        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL ERROR: JWT_SECRET environment variable is missing.');
            return res.status(500).json({
                success: false,
                message: 'Configuration error: JWT_SECRET is missing. Please check your (.env) or Render dashboard.'
            });
        }

        let { name, email, password } = req.body;

        // Trim and lowercase email
        email = email?.trim().toLowerCase();
        name = name?.trim();

        // Validate basic input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields (Name, Email, Password) are required.'
            });
        }

        // Check if user already exists (Manual check)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        // Create new user
        const user = new User({ name, email, password });
        await user.save();

        // Create JWT token — already checked for JWT_SECRET at start of route
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful! You are now logged in.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                dateOfBirth: user.dateOfBirth
            }
        });
    } catch (error) {
        // Specifically handle MongoDB Duplicate Key error (just in case the manual findOne missed a race condition)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered.'
            });
        }

        console.error('SERVER SIDE REGISTER ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Database/Server error during registration. Please try again later.'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        // Trim and lowercase email
        email = email?.trim().toLowerCase();

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login failed: User not found', { email });
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Login failed: Password mismatch', { email });
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                dateOfBirth: user.dateOfBirth
            }
        });
    } catch (error) {
        console.error('Login error full stack:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send reset password email
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        let { email } = req.body;
        email = email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // Return 404 to indicate email not registered
            return res.status(404).json({ success: false, message: 'Email not registered.' });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Build reset URL (frontend will handle the route)
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // Send email using real Gmail credentials
        const transporter = createTransporter();
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: 'NoteKeeper Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
                    <h2>Password Reset Requested</h2>
                    <p>You requested a password reset for your NoteKeeper account.</p>
                    <p>Click the link below to set your new password. This link expires in 10 minutes.</p>
                    <a href="${resetUrl}" style="display:inline-block; padding:10px 16px; background:#1e3a5f; color:#fff; text-decoration:none; border-radius:6px;">Reset Password</a>
                    <p>If you did not request this, you can safely ignore this email.</p>
                </div>
            `,
        });

        return res.json({ success: true, message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ success: false, message: 'Server error while processing password reset.' });
    }
});

// @route   GET /api/auth/reset-password/:token
// @desc    Verify reset password token
// @access  Public
router.get('/reset-password/:token', async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
        }

        res.json({ success: true, message: 'Password reset token is valid.' });
    } catch (error) {
        console.error('Reset token validation error:', error);
        res.status(500).json({ success: false, message: 'Unable to verify reset token.' });
    }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset user password
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both password fields.' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        }

        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Password has been reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Unable to reset password right now. Please try again later.' });
    }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                dateOfBirth: req.user.dateOfBirth,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.userId);

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PATCH /api/auth/update
// @desc    Update user configuration and profile details
// @access  Private
router.patch('/update', auth, async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword, profilePicture, dateOfBirth } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Mandatory field checks
        if (name !== undefined && name.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Name is required (minimum 2 characters)' });
        }

        // Email format validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (email !== undefined && !emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please use a valid email address' });
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'This email is already in use by another account' });
            }
        }

        // Date of Birth age validation (must be at least 13 years old)
        if (dateOfBirth) {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 13) {
                return res.status(400).json({ success: false, message: 'You must be at least 13 years old' });
            }
        }

        // Authentication layer for password changes — bcrypt.compare() verification
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: 'Current password is required to change password' });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Invalid current password provided' });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
            }
            user.password = newPassword;
        }

        if (name) user.name = name.trim();
        if (email) user.email = email.trim().toLowerCase();
        if (profilePicture !== undefined) user.profilePicture = profilePicture;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                dateOfBirth: user.dateOfBirth
            }
        });
    } catch (error) {
        console.error('Patch user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update'
        });
    }
});

module.exports = router;
