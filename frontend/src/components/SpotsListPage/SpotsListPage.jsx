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
                src={spot.previewImage}
                alt={spot.name}
                className="spot-image"
              />
              <div className="spot-info">
                <h2>{spot.name}</h2>
                <p>{spot.location}</p>
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
