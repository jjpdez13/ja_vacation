// frontend/src/store/index.js

// Export the configureStore function as default
export { default as configureStore } from "./store";

// Export additional utility functions, if any
export * from "./csrf";

// Export all actions and thunks from session.js
export * as sessionActions from "./session";
export { default as sessionReducer } from "./session";

// export the default name from store...I'm not sure why the above code doesn't do that
export { default } from './store';