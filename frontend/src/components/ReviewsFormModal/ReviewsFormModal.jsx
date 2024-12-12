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
  const author = `${user.firstName} ${user.lastName[0]}.`;
  const [content, setContent] = useState(review?.review || "");
  const [rating, setRating] = useState(review?.stars || "");
  const [image, setImage] = useState(null);
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

  return (
    <>
      <h1>{review?.id ? "Edit Your Review" : "Write A Review"}</h1>
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
              placeholder="Write your review here..."
            />
          </label>
          <label>
            Rating
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </label>
          <label>
            Author
            <input type="text" value={author} readOnly required />
          </label>
          <label>
            Review Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required={!review.id}
            />
          </label>
        </div>
        {Object.values(errors).map((error, idx) => (
          <p key={idx} className="error">
            {error}
          </p>
        ))}
        <button type="submit">
          {review.id ? "Update Review" : "Create Review"}
        </button>
      </form>
    </>
  );
}

export default ReviewsFormModal;
