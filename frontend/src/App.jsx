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
import {
  Navigation,
  SpotDetailsPage,
  SpotsListPage,
  ReviewsList,
  SpotFormPage,
  ManageSpotsPage
} from "./components";

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
        <Route path="/" element={<SpotsListPage />} />
        <Route path="/spots" element={<SpotsListPage />} />
        <Route path="/spots/spot" element={<SpotFormPage />} />
        <Route path="/spots/:spotId" element={<SpotDetailsPage />}>
          <Route path="" element={<ReviewsList />} />
        </Route>
        <Route path="/manage-spots" element={<ManageSpotsPage />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
