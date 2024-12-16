// frontend/src/components/SpotsListPage/SpotsListPage.jsx

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store";
import { NavLink } from "react-router-dom";
import "./SpotsList.css";

const SpotsListPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(spotActions.getSpots());
  }, [dispatch]);

  const spotsArr = Object.values(spots || {});

  useEffect(() => {
    if (spotsArr.length > 0) {
      console.log("Spot IDs being shown:", spotsArr.map((spot) => spot.id));
    }
  }, [spotsArr]);
  
  return (
    <div className="spots-list-container">
      <header className="spots-list-header">
        <h1>All the Spots</h1>
      </header>
      <ul className="spots-grid">
        {spotsArr.map((spot) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotsListPage;
