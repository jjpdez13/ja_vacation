import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import {
  configureStore,
  sessionActions,
  restoreCSRF,
  csrfFetch,
} from "./store";
import { ModalProvider, Modal } from "./context/modal";

// create the store by calling configure store
const store = configureStore();

// call for csrf restoration within store exposition in dev mode
if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
