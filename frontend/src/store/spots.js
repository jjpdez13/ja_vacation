// frontend/src/store/session.js
import { csrfFetch } from "./csrf";

const ADD_SPOT = "spots/addSpot";
const LOAD_SPOTS = "spots/loadSpots";
const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";
const REMOVE_SPOT = "spots/deleteSpot";

// Action Creators
const loadSpots = (spotsList) => ({
  type: LOAD_SPOTS,
  payload: spotsList,
});

const loadSpotDetails = (spot) => ({
  type: LOAD_SPOT_DETAILS,
  payload: spot,
});

const addSpot = (spotData) => ({
  type: ADD_SPOT,
  payload: spotData,
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  payload: spotId,
});

// Thunk Action: Load Spots
export const getSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  const list = await res.json();
  dispatch(loadSpots(list.Spots));
  return list;
};

// Thunk Action: Load Spot Details
export const getSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  const spot = await res.json();
  dispatch(loadSpotDetails(spot));
  return spot;
};

// Thunk Action: Add A Spot
export const createSpot = (spotData) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots`, {
    method: "POST",
    body: JSON.stringify(spotData),
  });

  const spot = await res.json();
  dispatch(addSpot(spot));
  return spot;
};

// Thunk Action: Delete A Spot
export const deleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  dispatch(removeSpot(res));
};

// Initial State
const initialState = {
  spots: {},
  spot: null,
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spotsObj = {};
      action.payload.forEach((spot) => {
        spotsObj[spot.id] = spot;
      });
      return { ...state, spots: spotsObj };
    }
    case LOAD_SPOT_DETAILS:
      return { ...state, spot: action.payload };
    case ADD_SPOT:
      return { ...state, spot: action.payload };
    case REMOVE_SPOT: {
      const newSpots = { ...state.spots };
      delete newSpots[action.payload];
      return { ...state, spots: newSpots, spot: null };
    }
    default:
      return state;
  }
};

export default spotsReducer;
