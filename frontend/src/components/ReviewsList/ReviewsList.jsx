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
  const hasReviewed = reviewsArr.some((review) => review.userId === user?.id);

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

  if (!spotId || isNaN(Number(spotId))) {
    console.error("Invalid spotId provided:", spotId);
    return null;
  }

  function formatReviewDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
    });
  }

  return (
    <ul className="reviews-list">
      {user && user?.id !== ownerId && !hasReviewed && (
        <li>
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<ReviewsFormModal spotId={spotId} />}
          />
        </li>
      )}
      {reviewsArr.length === 0 ? (
        <li>
          <p>No reviews yet. Be the first to leave one!</p>
        </li>
      ) : (
        reviewsArr.map((review) => (
          <li key={`${review.id}-${spotId}`}>
            <strong>
              {review.User?.firstName} {review.User?.lastName[0]}.
            </strong>
            <p>{formatReviewDate(review.createdAt)}</p>
            <p>{review.review || "No review content"}</p>
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
    </ul>
  );
};

export default ReviewsList;
