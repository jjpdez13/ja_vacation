// frontend/src/App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sessionActions } from "./store";
import { Navigation, SpotDetailsModal, SpotsListPage, ReviewsList } from "./components";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />}>
        <Route path="/" element={<h1>Welcome!</h1>} />
        <Route path="/spots" element={<SpotsListPage />} />
        <Route path="/spots/:spotId" element={<SpotDetailsModal />}>
        <Route path="" element={<ReviewsList />}/>
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
