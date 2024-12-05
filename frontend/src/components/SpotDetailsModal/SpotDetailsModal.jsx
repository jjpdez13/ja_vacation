// frontend/src/components/SpotDetailsModal/SpotDetailsModal.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { reviewActions, spotActions } from "../../store";
import ReviewsList from "../ReviewsList";
import "./SpotDetails.css";

function SpotDetailsModal() {
  const { closeModal } = useModal();
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector((state) => state.spots.singleSpot.details);
  const user = useSelector((state) => state.session.user);
  const isOwner = user?.id === spot?.ownerId;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [setError] = useState({});

  // Fetch spot details
  useEffect(() => {
    if (spotId) {
      console.log("Rendering SpotDetailsModal with spotId:", spotId);
      console.log("Spot owner ID:", spot?.ownerId);
      console.log("Current user ID:", user?.id);
      dispatch(spotActions.getSpotDetails(spotId));
      dispatch(reviewActions.getReviews(spotId));
    }
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) {
      setName(spot.name || "");
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setState(spot.state || "");
      setCountry(spot.country || "");
      setLat(spot.lat || "");
      setLng(spot.lng || "");
      setPrice(spot.price || "");
      setDescription(spot.description || "");
    }
  }, [spot]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSpot = {
      name,
      address,
      city,
      state,
      country,
      lat,
      lng,
      price,
      description,
    };

    try {
      await dispatch(spotActions.updateSpot({ ...updatedSpot, id: spot.id }));
      setIsEditing(false); // Exit editing mode after successful update
      setError(null);
    } catch (err) {
      console.error("Failed to update spot:", err);
      setError("Failed to update spot. Please try again.");
    }
  };

  if (!spot || !spot.id) {
    return <div>Loading...</div>;
  }

  const handleClose = () => {
    closeModal();
    navigate("/spots");
  };

  const handleDelete = () => {
    dispatch(spotActions.deleteSpot(spotId))
      .then(() => {
        console.log("Spot deleted:", spotId);
        closeModal(); // Close the modal
        navigate("/spots"); // Navigate back to the spots list page
      })
      .catch((err) => console.error("Failed to delete spot:", err));
  };

  return (
    <div className="spot-details-modal">
      <button className="close-modal" onClick={handleClose}>
        Close Details
      </button>
      {isEditing ? (
        <>
          <h1>Edit Spot</h1>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-content">
              <label>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Address
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
              <label>
                City
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <label>
                State
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </label>
              <label>
                Country
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </label>
              <label>
                Latitude
                <input
                  type="number"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </label>
              <label>
                Longitude
                <input
                  type="number"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </label>
              <label>
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>{name}</h1>
          <p>
            <strong>Owner:</strong> {spot.Owner?.firstName}{" "}
            {spot.Owner?.lastName}
          </p>
          <p>
            <strong>Address:</strong> {address}, {city}, {state}, {country}
          </p>
          <p>
            <strong>Latitude:</strong> {lat}
          </p>
          <p>
            <strong>Longitude:</strong> {lng}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Price:</strong> ${price}
          </p>
          {isOwner && (
            <>
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Spot
              </button>
              <button className="delete-button" onClick={handleDelete}>
                Delete Spot
              </button>
            </>
          )}
          <h2>Reviews</h2>
          <ReviewsList spotId={spotId} ownerId={spot?.ownerId} />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default SpotDetailsModal;
