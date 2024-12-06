// frontend/src/store/spots.js

import { csrfFetch } from "./csrf";

const ADD_SPOT = "spots/addSpot";
const LOAD_SPOTS = "spots/loadSpots";
const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";
const REMOVE_SPOT = "spots/deleteSpot";
const UPDATE_SPOT = "spots/updateSpot";

// Action Creators
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

const loadSpotDetails = (spot) => ({
  type: LOAD_SPOT_DETAILS,
  payload: spot,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
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
};

// Thunk Action: Load Spot Details
export const getSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  dispatch(loadSpotDetails(spot));
};

// Thunk Action: Add A Spot
export const createSpot = (spotData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots`, {
      method: "POST",
      body: JSON.stringify(spotData),
    });
    if (!res.ok) throw new Error("Failed to create spot.");
    const newSpot = await res.json();
    // Dispatch action to add the new spot to the Redux store
    dispatch(addSpot(newSpot));
    return newSpot; // Return the new spot to handle navigation or UI feedback
  } catch (err) {
    console.error("Error creating spot:", err);
    throw err;
  }
};

// Thunk Action: Delete A Spot
export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete spot.");
    // Dispatch action to remove spot from Redux store
    dispatch(removeSpot(spotId));
  } catch (err) {
    console.error("Error deleting spot:", err);
    throw err;
  }
};

// Thunk Action: Update A Spot
export const updateSpot = (spotData) => async (dispatch) => {
  const { id } = spotData;
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: "PUT",
    body: JSON.stringify(spotData),
  });

  const updatedSpot = await res.json();
  dispatch(updateSpot(updatedSpot));
  return updatedSpot;
};

// Initial State
const initialState = {
  allSpots: {},
  singleSpot: {
    details: {},
  },
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spotsObj = {};
      action.payload.forEach((spot) => {
        spotsObj[spot.id] = spot;
      });
      return { ...state, allSpots: spotsObj };
    }
    case LOAD_SPOT_DETAILS: {
      const { ...spotDetails } = action.payload;
      return {
        ...state,
        singleSpot: {
          details: spotDetails,
        },
      };
    }
    case ADD_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
        singleSpot: action.spot
      };
    case REMOVE_SPOT: {
      const newSpots = { ...state.allSpots };
      delete newSpots[action.payload];
      return { ...state, allSpots: newSpots, singleSpot: null };
    }
    case UPDATE_SPOT: {
      const updatedSpot = action.payload;
      return {
        ...state,
        allSpots: { ...state.allSpots, [updatedSpot.id]: updatedSpot },
        singleSpot: updatedSpot,
      };
    }
    default:
      return state;
  }
};

export default spotsReducer;