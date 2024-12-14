// frontend/src/components/ReviewsFormModal/ReviewsFormModal.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { reviewActions } from "../../store";
import { useParams } from "react-router";
import "./ReviewsForm.css";

function ReviewsFormModal({ review = {}, spotId: propSpotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { spotId: paramSpotId } = useParams();
  const spotId = propSpotId || paramSpotId;
  const user = useSelector((state) => state.session.user);
  const [content, setContent] = useState(review?.review || "");
  const [rating, setRating] = useState(review?.stars || 0); // Default to 0 stars
  const [image] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      review: content,
      stars: rating,
      reviewImage: image,
      user,
    };

    try {
      if (review?.id) {
        await dispatch(
          reviewActions.updateReview({ ...reviewData, id: review.id })
        );
      } else {
        await dispatch(reviewActions.createReview(spotId, reviewData));
      }
      closeModal();
      window.location.reload();
    } catch (error) {
      if (error.response) {
        // Validation errors
        const backendErrors = error.response.data.errors || {};
        setErrors(backendErrors);
      } else {
        setErrors({ review: "An unexpected error occurred." });
      }
    }
  };

  const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);
  
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <div
              key={index}
              className="star-container"
              onMouseEnter={() => setHover(starValue)} // Highlight stars up to hovered one
              onMouseLeave={() => setHover(0)} // Remove highlight when not hovering
              onClick={() => setRating(starValue)} // Set rating on click
            >
              <img
                src="https://cdn.discordapp.com/emojis/1175836866696724580.webp?size=240"
                alt={`${starValue} star`}
                className={`star ${starValue <= (hover || rating) ? "filled" : ""}`}
              />
              <div
                className={`highlight ${
                  starValue <= hover ? "active-highlight" : ""
                }`}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <h1>{review?.id ? "Edit Your Review" : "How was your stay?"}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {errors.review && <p className="error">{errors.review}</p>}
        {errors.stars && <p className="error">{errors.stars}</p>}
        <div className="form-content">
          <label>
            Review
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Leave your review here..."
            />
          </label>
          <label>
            <StarRating rating={rating} setRating={setRating} /><p>Stars</p>
          </label>
        </div>
        {Object.values(errors).map((error, idx) => (
          <p key={idx} className="error">
            {error}
          </p>
        ))}
        <button type="submit">
          {review.id ? "Update Review" : "Submit Your Review"}
        </button>
      </form>
    </>
  );
}

export default ReviewsFormModal;