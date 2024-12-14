// frontend/src/components/Navigation/Navigation.jsx

import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  // Use `useLocation` to check the current route
  const location = useLocation();
  const isOnSpotFormPage = location.pathname === "/spots/spot";

  return (
    <nav className="navbar">
      {/* Logo */}
      <NavLink to="/" className="navbar-logo">
        <img src="https://i.imgur.com/unBQo5T.png" alt="Website Logo" />
      </NavLink>

      {/* Navigation Links */}
      <div className="navbar-links">
        <NavLink to="/" className="navbar-link">
          Home
        </NavLink>
        <NavLink to="/spots" className="navbar-link">
          Spots
        </NavLink>
      </div>

      {/* Create a Spot Button */}
      {sessionUser && !isOnSpotFormPage && (
        <NavLink to="/spots/spot" className="navbar-create-spot">
          Create a Spot
        </NavLink>
      )}

      {/* Profile Button */}
      {isLoaded && <ProfileButton user={sessionUser} />}
    </nav>
  );
}

export default Navigation;