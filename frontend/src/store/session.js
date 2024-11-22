// frontend/src/store/session.js
import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const SIGNUP_USER = "session/signUpUser";

// Action creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

// Thunk Action: Log In
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

// Thunk Action: Restore User
export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/session");
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

// Thunk Action: Sign Up
export const signup = (user) => async dispatch => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
}

// Thunk Action: Log Out
export const logout = () => async dispatch => {
  const res = await csrfFetch("/api/session", {
    method: "DELETE"
  });
  dispatch(removeUser());
  return res;
};

// Initial State
const initialState = { user: null };

// Reducer
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case SIGNUP_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default sessionReducer;
