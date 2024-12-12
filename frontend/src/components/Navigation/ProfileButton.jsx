import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import SpotFormModal from "../SpotFormModal";
import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }

  useEffect(() => {
    if (!showMenu && !showUserMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, showUserMenu]);

  const closeMenu = () => {
    setShowMenu(false);
    setShowUserMenu(false);
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "show" : "");
  const userMenuClassName = "user-menu-dropdown" + (showUserMenu ? "show" : "");

  return (
    <>
      <button
        className="profile-button"
        onClick={toggleMenu}
        style={{ background: "none", cursor: "pointer" }}
      >
        <img
          src="https://i.imgur.com/XjDUd6i.png"
          alt="Profile"
          style={{ width: "55px", height: "55px" }}
        />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}!</li>
            <li>email: {user.email}</li>
            <li>
              <button className="user-menu-button" onClick={toggleUserMenu}>
                User Menu
              </button>
              <ul className={userMenuClassName}>
                <li>
                  <button onClick={logout}>Log Out</button>
                </li>
                <li>
                  <OpenModalButton
                    buttonText="Create Spot"
                    modalComponent={<SpotFormModal />}
                  />
                </li>
              </ul>
            </li>
          </>
        ) : (
          <>
            <li className="login-button">
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li className="signup-button">
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
