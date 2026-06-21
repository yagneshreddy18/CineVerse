import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLE_LABELS, ROLES } from "../utils/constants.js";
import Button from "./Button.jsx";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <NavLink to="/dashboard" className="brand">
        <span className="brand-mark">CV</span>
        <span>CineVerse</span>
      </NavLink>
      <nav className="nav-links">
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/movies">Movies</NavLink>
            {user.role !== ROLES.THEATRE_OWNER && <NavLink to="/booking">Booking</NavLink>}
            {(user.role === ROLES.ADMIN || user.role === ROLES.THEATRE_OWNER) && <NavLink to="/manage">Manage</NavLink>}
          </>
        )}
      </nav>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="role-chip">{ROLE_LABELS[user.role]}</span>
            <Button variant="ghost1" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
      </div>
    </header>
  );
}
