// frontend/src/store/reviews.js

import { csrfFetch } from "./csrf";

const LOAD_USERS = "reviews/loadUsers";
const ADD_REVIEW = "reviews/addReview";
const LOAD_REVIEWS = "reviews/loadReviews";
const LOAD_REVIEW_DETAILS = "reviews/loadReviewDetails";
const REMOVE_REVIEW = "reviews/deleteReview";
const UPDATE_REVIEW = "reviews/updateReview";

// Action Creators
const loadUsers = (users) => ({
  type: LOAD_USERS,
  payload: users,
});
const loadReviews = (spotId, reviews) => ({
  type: LOAD_REVIEWS,
  payload: {spotId, reviews},
});

const loadReviewDetails = (review) => ({
  type: LOAD_REVIEW_DETAILS,
  payload: review,
});

const addReview = (reviewData) => ({
  type: ADD_REVIEW,
  payload: reviewData,
});

const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  payload: reviewId,
});

const reviseReview = (review) => ({
  type: UPDATE_REVIEW,
  payload: review,
});

// Thunk Action: Load Users
export const getUsers = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const list = await res.json();
  dispatch(loadUsers(list.reviews));
};

// Thunk Action: Load Reviews
export const getReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const list = await res.json();
  dispatch(loadReviews(list));
};

// Thunk Action: Load Review Details
export const getReviewDetails = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`);

  const review = await res.json();
  dispatch(loadReviewDetails(review));
  return review;
};

// Thunk Action: Add A Review
export const createReview = (reviewData) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewData),
  });

  const review = await res.json();
  dispatch(addReview(review));
  return review;
};

// Thunk Action: Delete A Review
export const deleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  dispatch(removeReview(res));
};

// Thunk Action: Update A Review
export const updateReview = (reviewData) => async (dispatch) => {
  const { id, ...data } = reviewData;
  const res = await csrfFetch(`/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });

  const updatedReview = await res.json();
  dispatch(reviseReview(updatedReview));
  return updatedReview;
};

// Initial State
const initialState = {
  allReviews: {},
  singleReview: null,
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USERS: {
      return { ...state, users };
    }
    case LOAD_REVIEWS: {
      const reviewsObj = {};
      const reviewsArray = action.payload.Reviews; // Access the array from the Reviews key
      reviewsArray.forEach((review) => {
        reviewsObj[review.id] = review; // Populate the object
      });
      return { ...state, allReviews: reviewsObj };
    }
    case LOAD_REVIEW_DETAILS:
      return { ...state, singleReview: action.payload };
    case ADD_REVIEW:
      return { ...state, singleReview: action.payload };
    case REMOVE_REVIEW: {
      const newReviews = { ...state.allReviews };
      delete newReviews[action.payload];
      return { ...state, allReviews: newReviews, singleReview: null };
    }
    case UPDATE_REVIEW: {
      const updatedReview = action.payload;
      return {
        ...state,
        allReviews: { ...state.allReviews, [updatedReview.id]: updatedReview },
        singleReview: updatedReview,
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
