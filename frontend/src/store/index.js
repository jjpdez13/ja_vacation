// frontend/src/store/index.js

// Export the configureStore function as default
export { default as configureStore } from "./store";

// Export all actions and thunks from session.js
export * as sessionActions from "./session";
export { default as sessionReducer } from "./session";

// Export additional utility functions, if any
export * from "./csrf";

// Export all actions and thunks from spots.js
export * as spotActions from "./spots";
export { default as spotsReducer } from "./spots";