# 🚀 Quick Start Guide

## Important: MongoDB Installation Required

MongoDB is not currently installed on your system. You need to install it first.

### Option 1: Install MongoDB Locally (Recommended for Development)

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows version
   - Download and install

2. **Start MongoDB**
   ```bash
   # MongoDB should start automatically after installation
   # Or manually start it with:
   mongod
   ```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**
   - Create a free M0 cluster
   - Set up database user and password
   - Whitelist your IP (or use 0.0.0.0/0 for development)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/note-app
   ```

## Running the Application

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Step 2: Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 3: Open Browser
Navigate to `http://localhost:3000`

## First Time Setup

1. Click "Register here" to create a new account
2. Fill in your name, email, and password
3. After registration, you'll be automatically logged in
4. Start creating notes!

## Testing Features

### Authentication
- ✅ Register with name, email, password
- ✅ Login with email and password
- ✅ Logout functionality
- ✅ Protected routes (try accessing /dashboard without login)

### Notes CRUD
- ✅ Create note with title, content, tags, priority, color
- ✅ Edit existing notes
- ✅ Delete notes (moves to trash)
- ✅ View all notes

### Advanced Features
- ✅ Pin important notes (they appear at top)
- ✅ Archive notes (separate archive page)
- ✅ Search notes (with debounce)
- ✅ Filter by priority
- ✅ Grid/List view toggle
- ✅ Dark mode toggle
- ✅ Restore from trash
- ✅ Permanent delete from trash

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify .env file configuration

### Frontend won't start
- Make sure you ran `npm install` in frontend directory
- Check if port 3000 is available

### Can't login/register
- Make sure backend server is running
- Check browser console for errors
- Verify MongoDB connection in backend terminal

## Default Ports
- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017` (if local)

Enjoy your note-taking app! 📝✨
