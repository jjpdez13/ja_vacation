import { useState, useEffect, useCallback } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./SignupForm.css";
import { useModal } from "../../context/Modal";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { closeModal } = useModal();

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  const resetForm = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setIsButtonDisabled(true);
  };

  const isEmailValid = (email) => {
    return email.includes("@") && email.includes(".") && email.indexOf("@") < email.lastIndexOf(".");
  };

  const isFormValid = useCallback(() => {
    return (
      username.length >= 4 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      isEmailValid(email) &&
      password.length >= 6 &&
      confirmPassword.length > 0
    );
  }, [username, firstName, lastName, email, password, confirmPassword]);

  useEffect(() => {
    const newErrors = {};
    if (username.length > 0 && username.length < 4) {
      newErrors.username = "Username must be at least 4 characters long";
    }
    if (email.length > 0 && !isEmailValid(email)) {
      newErrors.email = "Please provide a valid email address";
    }
    if (password.length > 0 && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Confirm password must be the same as Password";
    }
    setErrors(newErrors);
    setIsButtonDisabled(!isFormValid());
  }, [username, email, password, firstName, lastName, confirmPassword, isFormValid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Confirm Password must match Password",
      });
      return;
    }

    try {
      await dispatch(
        sessionActions.signup({
          username,
          firstName,
          lastName,
          email,
          password,
        })
      );
      handleClose();
    } catch (res) {
      const data = await res.json();
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors({
          general: "An unknown error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="error-message">{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="error-message">{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error-message">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
        {errors.general && <p className="error-message">{errors.general}</p>}
        <button type="submit" disabled={isButtonDisabled}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;