import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <div className="navbar-logo">
          <NavLink to="/">BlogApp</NavLink>
        </div>

        <nav className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>

          <NavLink
            to="/posts"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Posts
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
