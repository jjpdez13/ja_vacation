import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <img src="https://i.imgur.com/unBQo5T.png" alt="Website Logo" />
        </NavLink>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/" className="navbar-link">| Home |</NavLink>
          <NavLink to="/spots" className="navbar-link">| Spots |</NavLink>
        </div>

        {/* Profile Button */}
        {isLoaded && <ProfileButton user={sessionUser} />}
    </nav>
  );
}

export default Navigation;