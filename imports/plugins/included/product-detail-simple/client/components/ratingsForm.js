import React from "react";
import ReactStars from "react-stars";
import PropTypes from "prop-types";

const RatingsForm = ({
  showReviewForm,
  displayForm,
  saveReview,
  handleUserInput,
  addReviewBtn,
  getStarValue,
  cancelReview,
  value,
  reviews
}) => {
  // Get total rating
  let totalRating = 0;
  reviews.forEach(review => {
    totalRating += parseFloat(review.rating);
  });
  //  Calculate average ratings
  const averageRating = totalRating / reviews.length;

  return (
    <div className="row rating-wrapper">
      <div>
        <h3>Product Ratings & Reviews</h3>
      </div>
      <div className="rating-holder">
        <div className="row">
          <img src="/resources/ratingStar.png" alt="star rating"/>
          <h6 className="rating-fig">{reviews.length === 0 ? "0.0" : averageRating.toFixed(1)}</h6>
        </div>
      </div>
      <div className="row add-review">
        {
          !addReviewBtn
            ?
            null
            :
            <button className="btn" id="add-review-button" onClick={showReviewForm}>Add Review</button>
        }
        {/* Form */}
        {
          displayForm
            ?
            <div className="row review-form">
              <h4>Add New Review</h4>
              <ReactStars
                count={5}
                onChange={getStarValue}
                size={24}
                value={value}
              />
              <form onSubmit={saveReview}>
                {/* Stars for rating */}
                <div className="form-group stars">
                  <label>Rate this product</label>
                  <br/>
                </div>

                {/* textarea */}
                <div className="form-group">
                  <label>Review</label>
                  <textarea
                    cols="10"
                    rows="6"
                    className="form-control"
                    name="review"
                    placeholder="Enter your review"
                    onChange={handleUserInput}
                  />
                </div>

                <div className="form-group form-buttons">
                  <button className="btn btn-success">
                    Post Review
                  </button>
                  <button onClick={cancelReview} className="btn btn-danger">
                    cancel
                  </button>
                </div>
              </form>
            </div>
            :
            null
        }
      </div>
      <div className="review-holder">
        <div className="row reviews">
          {
            reviews.length === 0
              ?
              <h5 style={{ color: "maroon" }}>This product has no reviews yet.</h5>
              :
              reviews.map((review, key) => {
                return <div key={key}>
                  <h4>{review.reviewer}</h4>
                  <p>{review.review}</p>
                  <div className="ratings">
                    <ReactStars
                      count={5}
                      size={10}
                      value={parseFloat(review.rating)}
                      edit={false}
                    />
                  </div>
                </div>;
              })
          }
        </div>
      </div>
    </div>
  );
};

RatingsForm.propTypes = {
  addReviewBtn: PropTypes.bool,
  cancelReview: PropTypes.func,
  displayForm: PropTypes.bool,
  getStarValue: PropTypes.func,
  handleUserInput: PropTypes.func,
  reviews: PropTypes.array,
  saveReview: PropTypes.func,
  showReviewForm: PropTypes.func,
  value: PropTypes.number
};

export default RatingsForm;
