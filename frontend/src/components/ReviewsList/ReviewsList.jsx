import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reviewActions } from "../../store";
import { NavLink, useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
// import ReviewFormModal from "../ReviewFormModal";
import "./ReviewsList.css";

const ReviewsList = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.allReviews);
  const users = useSelector((state) => state.users);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (spotId) {
      dispatch(reviewActions.getReviews(spotId));
      dispatch(reviewActions.getUsers());
    }
  }, [dispatch, spotId]);

  const reviewsArr = Object.values(reviews || {});

  return (
    <div className="reviews-list-container">
      <header className="reviews-list-header">
        <h1>Reviews</h1>
        {user && (
          <OpenModalButton
            buttonText="Create Review"
            modalComponent={<ReviewFormModal />}
          />
        )}
      </header>
      <ul className="reviews-grid">
        {reviewsArr.map((review) => {
          const author = users[review.userId];
          return (
            <li key={review.id} className="review-card">
              <NavLink to={`/reviews/${review.id}`}>
                <div className="review-info">
                  <h2>{review.review}</h2>
                  {author && (
                    <p className="review-author">
                      {author.firstName} {author.lastName[0]}.
                    </p>
                  )}
                  <p>Rating: {review.stars}</p>
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReviewsList;
