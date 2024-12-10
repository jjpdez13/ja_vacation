// frontend/src/components/SpotsListPage/SpotsListPage.jsx

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SpotFormModal from "../SpotFormModal";
import "./SpotsList.css";

const SpotsListPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.allSpots);
  const user = useSelector((state) => state.session.user);

  const handleDelete = (spotId) => {
    dispatch(spotActions.deleteSpot(spotId))
      .then(() => {
        console.log("Spot deleted:", spotId);
      })
      .catch((err) => console.error("Failed to delete spot:", err));
  };

  useEffect(() => {
    dispatch(spotActions.getSpots());
  }, [dispatch]);

  const spotsArr = Object.values(spots || {});

  return (
    <div className="spots-list-container">
      <header className="spots-list-header">
        <h1>All the Spots</h1>
        {user && (
          <OpenModalButton
            buttonText="Create Spot"
            modalComponent={<SpotFormModal />}
          />
        )}
      </header>
      <ul className="spots-grid">
        {spotsArr.map((spot) => (
          <li key={spot.id} className="spot-card">
            <NavLink to={`/spots/${spot.id}`}>
              <img
                src={spot.previewImage || "/placeholder.jpg"}
                alt={spot.name}
                className="spot-image"
              />
              <div className="spot-info">
                <h2>{spot.name}</h2>
                <p>{spot.city}</p>
                <p>{spot.state}</p>
                <p>${spot.price} / night</p>
              </div>
            </NavLink>
            {user?.id === spot.ownerId && (
              <div className="spot-actions">
                <OpenModalButton
                  buttonText="Edit Spot"
                  modalComponent={<SpotFormModal spot={spot} />}
                />
                <button
                  className="delete-button"
                  onClick={() => handleDelete(spot.id)}
                >
                  Delete Spot
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotsListPage;
