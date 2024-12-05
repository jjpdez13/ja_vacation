import { csrfFetch } from "./csrf";

const ADD_REVIEW = "reviews/addReview";
const LOAD_REVIEWS = "reviews/loadReviews";
const REMOVE_REVIEW = "reviews/deleteReview";
const UPDATE_REVIEW = "reviews/updateReview";

// Action Creators
const loadReviews = (spotId, reviews) => ({
  type: LOAD_REVIEWS,
  spotId,
  reviews,
});

const addReview = (reviewData) => ({
  type: ADD_REVIEW,
  payload: reviewData,
});

const removeReview = (reviewId, spotId) => ({
  type: REMOVE_REVIEW,
  payload: { reviewId, spotId },
});

const reviseReview = (review) => ({
  type: UPDATE_REVIEW,
  payload: review,
});

// Thunk Action: Load Reviews
export const getReviews = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews.");
    const list = await res.json();
    dispatch(loadReviews(spotId, list));
  } catch (err) {
    console.error("Error loading reviews:", err);
    throw err;
  }
};

// Thunk Action: Add A Review
export const createReview = (reviewData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("Failed to create review.");
    const review = await res.json();
    dispatch(addReview(review));
    return review;
  } catch (err) {
    console.error("Error creating review:", err);
    throw err;
  }
};

// Thunk Action: Delete A Review
export const deleteReview = (reviewId, spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete review.");
    dispatch(removeReview(reviewId, spotId));
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
};

// Thunk Action: Update A Review
export const updateReview = (reviewData) => async (dispatch) => {
  const { id } = reviewData;
  try {
    const res = await csrfFetch(`/api/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("Failed to update review.");
    const updatedReview = await res.json();
    dispatch(reviseReview(updatedReview));
    return updatedReview;
  } catch (err) {
    console.error("Error updating review:", err);
    throw err;
  }
};

// Initial State
const initialState = {
  allReviews: {},
  singleReview: null,
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
    console.log("Action payload for LOAD_REVIEWS:", action);
  switch (action.type) {
    case LOAD_REVIEWS: {
      return {
        ...state,
        allReviews: {
          ...state.allReviews,
          [action.spotId]: action.reviews.Reviews,
        },
      };
    }
    case ADD_REVIEW: {
      const newReviews = { ...state.allReviews };
      const spotReviews = newReviews[action.payload.spotId] || [];
      return {
        ...state,
        allReviews: {
          ...newReviews,
          [action.payload.spotId]: [...spotReviews, action.payload],
        },
        singleReview: action.payload,
      };
    }
    case REMOVE_REVIEW: {
      const { reviewId, spotId } = action.payload;
      const newReviews = { ...state.allReviews };
      if (newReviews[spotId]) {
        newReviews[spotId] = newReviews[spotId].filter(
          (review) => review.id !== reviewId
        );
      }
      return {
        ...state,
        allReviews: newReviews,
        singleReview: null,
      };
    }
    case UPDATE_REVIEW: {
      const updatedReview = action.payload;
      const newReviews = { ...state.allReviews };
      if (newReviews[updatedReview.spotId]) {
        newReviews[updatedReview.spotId] = newReviews[
          updatedReview.spotId
        ].map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        );
      }
      return {
        ...state,
        allReviews: newReviews,
        singleReview: updatedReview,
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;