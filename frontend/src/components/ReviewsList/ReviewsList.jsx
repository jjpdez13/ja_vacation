// frontend/src/components/ReviewsList/ReviewsList.jsx

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reviewActions } from "../../store";
import OpenModalButton from "../OpenModalButton";
import ReviewsFormModal from "../ReviewsFormModal";
import "./ReviewsList.css";

const ReviewsList = ({ spotId, ownerId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.allReviews[spotId]);
  const user = useSelector((state) => state.session.user);
  const reviewsArr = Object.values(reviews || {});

  const handleDelete = (reviewId) => {
    dispatch(reviewActions.deleteReview(reviewId))
      .then(() => {
        console.log("Review deleted: ", reviewId);
        dispatch(reviewActions.getReviews(spotId));
      })
      .catch((err) => console.error("Failed to delete review: ", err));
  };

  useEffect(() => {
    if (spotId) {
      console.log("Fetching reviews for spotId:", spotId);
      dispatch(reviewActions.getReviews(spotId));
    }
  }, [dispatch, spotId]);

  if (!spotId) {
    console.log("No spotId provided. Not rendering ReviewsList.");
    return null;
  }

  return (
    <ul className="reviews-list">
      {reviewsArr.length === 0 ? (
        <li>
          <p>No reviews yet. Be the first to leave one!</p>
        </li>
      ) : (
        reviewsArr.map((review) => (
          <li key={`${review.id}-${spotId}`}>
            <p>Review: {review.review || "No review content"}</p>
            <p>Rating: {review.stars || "No rating"}</p>
            <p>
              By: {review.User?.firstName} {review.User?.lastName[0]}.
            </p>
            {user?.id === review.userId && (
              <>
                <OpenModalButton
                  buttonText="Edit Review"
                  modalComponent={<ReviewsFormModal review={review} />}
                />
                <button
                  className="delete-button"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete Review
                </button>
              </>
            )}
          </li>
        ))
      )}
      {reviewsArr.length === 0 && user?.id !== ownerId && (
        <li>
          <OpenModalButton
            buttonText="Create A Review"
            modalComponent={<ReviewsFormModal spotId={ spotId } />}
          />
        </li>
      )}
    </ul>
  );
};

export default ReviewsList;
