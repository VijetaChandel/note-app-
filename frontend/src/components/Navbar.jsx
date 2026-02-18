import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    📝 NoteApp
                </Link>

                <div className="navbar-links">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/archive" className="nav-link">Archive</Link>
                    <Link to="/trash" className="nav-link">Trash</Link>
                </div>

                <div className="navbar-actions">
                    <button onClick={toggleDarkMode} className="btn-icon mode-toggle" title="Toggle Dark Mode">
                        <span style={{ fontSize: '1.4rem' }}>{darkMode ? '💡' : '🌑'}</span>
                        <span style={{ fontSize: '0.6rem', display: 'block', color: darkMode ? '#cbd5e1' : '#64748b', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap' }}>
                            {darkMode ? 'Switch Light Mode' : 'Switch Dark Mode'}
                        </span>
                    </button>

                    <div className="user-menu">
                        <div className="user-profile-badge">
                            <span className="user-initials">{user?.name?.charAt(0) || 'U'}</span>
                            <span className="user-name">{user?.name}</span>
                        </div>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
