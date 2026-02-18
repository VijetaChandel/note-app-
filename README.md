# 📝 Note Application

A full-stack MERN (MongoDB, Express, React, Node.js) note-taking application with authentication, CRUD operations, and professional features.

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

### 📒 Notes Management
- Create, Read, Update, Delete notes
- Rich note features:
  - Title and content
  - Tags for organization
  - Priority levels (Low, Medium, High)
  - Custom background colors
  - Pin important notes
  - Archive notes
  - Soft delete (Trash)

### 🎨 User Interface
- Modern, responsive design
- Dark mode support
- Grid and List view options
- Search with debounce
- Filter by tags and priority
- Toast notifications
- Smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "c:\Users\lenovo\Desktop\final note application22"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Edit `backend/.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/note-app
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
note-application/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── NoteCard.jsx
    │   │   ├── NoteModal.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Archive.jsx
    │   │   └── Trash.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Notes
- `POST /api/notes` - Create note (protected)
- `GET /api/notes` - Get all notes with filters (protected)
- `GET /api/notes/:id` - Get single note (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `PUT /api/notes/:id/pin` - Toggle pin status (protected)
- `PUT /api/notes/:id/archive` - Toggle archive status (protected)
- `DELETE /api/notes/:id` - Soft delete note (protected)
- `DELETE /api/notes/:id/permanent` - Permanent delete (protected)
- `PUT /api/notes/:id/restore` - Restore from trash (protected)

## 🎯 Usage

1. **Register** a new account or **Login** with existing credentials
2. **Create notes** with title, content, tags, and priority
3. **Pin** important notes to keep them at the top
4. **Archive** notes you want to keep but don't need active
5. **Search** notes by title or content
6. **Filter** by tags or priority
7. **Toggle** between grid and list view
8. **Switch** to dark mode for comfortable viewing
9. **Delete** notes (they go to trash first)
10. **Restore** or permanently delete from trash

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router DOM
- Axios
- React Toastify
- Vite

## 📝 License

This project is open source and available for educational purposes.
