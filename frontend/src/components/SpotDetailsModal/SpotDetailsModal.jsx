// frontend/src/components/SpotDetailsModal/SpotDetailsModal.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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


  useEffect(() => {
    if (spotId) {
      dispatch(spotActions.getSpotDetails(spotId));
      dispatch(reviewActions.getReviews(spotId));
    }
  }, [dispatch, spotId]);

  if (!spot || !spot.id) {
    return <div>Loading...</div>;
  }

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

  const handleClose = () => {
    closeModal();
    navigate("/spots");
  };

  return (
    <div className="spot-details-modal">
      <button className="close-modal" onClick={handleClose}>
        Close Details
      </button>
      <div className="spot-info">
        <h1>{spot.name}</h1>
        <p>
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </div>
      <div className="spot-images">
        <img
          src={spot.SpotImages?.[0]?.url || "/placeholder.jpg"}
          alt="Main"
          className="main-image"
        />
        <div className="secondary-images">
          {spot.SpotImages?.slice(1).map((image, index) => (
            <img
              key={index}
              src={image.url || "/placeholder.jpg"}
              alt={`Spot Image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="spot-details-content">
        <div className="spot-info-2">
          <p>
            <strong>Hosted By:</strong> {spot.Owner?.firstName}{" "}
            {spot.Owner?.lastName}
          </p>
          <p>{spot.description}</p>
        </div>
        <div className="reserve-section">
          <div className="reserve-container">
            <div className="price-and-rating">
              <p className="price">
                ${spot.price} <span>/ night</span>
              </p>
              <p className="rating">
                ★ {spot.avgRating ? spot.avgRating.toFixed(1) : "New"} •{" "}
                {spot.numReviews || 0} reviews
              </p>
            </div>
            <button className="reserve-button" onClick={handleReserveClick}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      <h2>Reviews</h2>
      <ReviewsList spotId={spotId} ownerId={spot?.ownerId} />
    </div>
  );
}

export default SpotDetailsModal;