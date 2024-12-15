// frontend/src/components/ManageSpotsPage/ManageSpotsPage.jsx

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store";
import { NavLink, useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SpotFormPage from "../SpotFormPage";
import "./ManageSpots.css";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.allSpots);
  const user = useSelector((state) => state.session.user);

  // Filter spots owned by the current user
  const userSpots = Object.values(spots || {}).filter(
    (spot) => spot.ownerId === user?.id
  );

  useEffect(() => {
    if (user) {
      dispatch(spotActions.getCurrentUserSpots());
    } else {
      navigate("/login"); // Redirect to login if user is not logged in
    }
  }, [dispatch, user, navigate]);

  return (
    <div className="spots-list-container">
      <header className="spots-list-header">
        <h1>Manage Spots</h1>
      </header>
      {userSpots.length === 0 ? (
        <div className="no-spots-message">
          <p>You have not created any spots yet.</p>
        </div>
      ) : (
        <ul className="spots-grid">
          {userSpots.map((spot) => (
            <li key={spot.id} className="spot-card" title={`${spot.name}`}>
              <NavLink to={`/spots/${spot.id}`}>
                <img
                  src={spot.previewImage || "/placeholder.jpg"}
                  alt={spot.name}
                  className="spot-image"
                />
                <div className="spot-info">
                  <div className="top-spot">
                    <p>
                      {spot.city}, {spot.state}
                    </p>
                    <p className="stars">
                      <img
                        src="https://cdn.discordapp.com/emojis/1175836866696724580.webp?size=240"
                        alt="star"
                        className="star-image"
                      ></img>
                      {typeof spot.avgRating === "number" && spot.avgRating > 0
                        ? Number(spot.avgRating).toFixed(1)
                        : "New"}
                    </p>
                  </div>
                  <p>${spot.price} / night</p>
                </div>
              </NavLink>
              <div className="spot-actions">
                <OpenModalButton
                  buttonText="Update"
                  modalComponent={<SpotFormPage spot={spot} />}
                />
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(spotActions.deleteSpot(spot.id))
                      .then(() => console.log("Spot deleted:", spot.id))
                      .catch((err) =>
                        console.error("Failed to delete spot:", err)
                      );
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageSpots;