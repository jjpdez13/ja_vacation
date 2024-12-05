// frontend/src/components/ReviewsFormModal/ReviewsFormModal.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { reviewActions } from "../../store";
import "./ReviewsForm.css";

function ReviewsFormModal({ review = {} }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const author = useSelector((state) => {
  const user = state.session.user;
  return `${user.firstName} ${user.lastName[0]}.`;
});
  const [content, setContent] = useState(review?.review || "");
  const [rating, setRating] = useState(review?.stars || "");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      content,
      stars: rating,
      reviewImage: image,
    };

    try {
      if (review?.id) {
        await dispatch(
          reviewActions.updateReview({ ...reviewData, id: review.id })
        );
      } else {
        await dispatch(reviewActions.createReview(reviewData));
      }
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <>
      <h1>{review?.id ? "Edit Your Review" : "Write A Review"}</h1>
      <form onSubmit={handleSubmit} className="form-container">
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
