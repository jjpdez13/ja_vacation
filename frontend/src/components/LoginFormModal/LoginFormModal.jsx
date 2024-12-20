import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const resetForm = () => {
    setCredential("");
    setPassword("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(sessionActions.login({ credential, password }));
      handleClose();
    } catch (data) {
      if (data?.message) {
        setErrors({ credential: data.message });
      } else {
        setErrors({ credential: "The provided credentials were invalid." });
      }
    }
  };

  const handleDemoLogin = async () => {
    try {
      await dispatch(
        sessionActions.login({
          credential: "JohnnyPeace12",
          password: "PeaceLove&Chicken1324***",
        })
      );
      handleClose();
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        {errors.credential && <p>{errors.credential}</p>}
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={credential.length < 4 || password.length < 6}>
          Log In
        </button>
      </form>
      <button onClick={handleDemoLogin} className="demo-user-button">
        Log in as Demo User
      </button>
    </>
  );
}

export default LoginFormModal;