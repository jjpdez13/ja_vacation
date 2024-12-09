// frontend/src/components/Navigation/Navigation.jsx

import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar">
      <li>
              <NavLink to="/">| Home |</NavLink>
              <NavLink to="/spots"> Spots |</NavLink>
      </li>
          {isLoaded && <ProfileButton user={sessionUser} />}
    </ul>
  );
}

export default Navigation;
