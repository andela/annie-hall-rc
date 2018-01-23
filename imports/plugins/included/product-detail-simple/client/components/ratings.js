import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { setTimeout } from "timers";
import RatingsForm from "./ratingsForm";
import { Reaction } from "/client/api";

/**
 *
 * @class Ratings
 * @classdesc product ratings and reviews component
 * @extends {Component}
 */
class Ratings extends Component {
  constructor(props) {
    super(props);
    this.productInfo = { ...this.props };
    this.state = {
      displayForm: false,
      addReviewBtn: true,
      review: "",
      rating: 0,
      reviews: []
    };
    this.showReviewForm = this.showReviewForm.bind(this);
    this.saveToDatabase = this.saveToDatabase.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelReview = this.cancelReview.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.getStarValue = this.getStarValue.bind(this);
  }

  /**
   *
   * @returns { object } updated state or error
   * @memberof Ratings
   */
  componentWillMount() {
    // admins or guests cant review products
    if (Reaction.hasPermission("admin") || Meteor.user().emails.length === 0) {
      this.setState({ displayForm: false, addReviewBtn: false });
    }

    Meteor.call("fetchRatings", this.productInfo.product._id, (error, response) => {
      if (error) {
        Alerts.toast(error, "error");
      }
      this.setState({ reviews: response });
    });
  }

  /**
   *@description displays the review form when a particular click event is performed
   * @returns {object} updated state
   * @memberof Ratings
   */
  showReviewForm() {
    this.setState({ displayForm: true, addReviewBtn: false });
  }

  /**
   * @param { object } event event on target element
   * @memberof Ratings
   * @desc cancels review and sets state to initial state
   */
  cancelReview() {
    this.setState({
      displayForm: false,
      addReviewBtn: true,
      review: "",
      rating: 0 });
  }

  /**
   * @param { object } ratingsObject object to save to database
   * @memberof Ratings
   */
  saveToDatabase(ratingsObject) {
    Meteor.call("saveRatings", ratingsObject, (error, reply) => {
      if (error) {
        Alerts.toast(error, "error");
      }
      this.setState({ reviews: reply });
      Alerts.toast("Your Ratings have beeen saved", "success");
      setTimeout(() => {
        this.cancelReview();
      }, 1000);
    });
  }

  /**
   * @description saves user reviews to database
   * @param { object } event - event on target element event
   * @memberof Ratings
   */
  handleSubmit(event) {
    event.preventDefault();
    let ratingsObject = {};

    // Check if no star is selected and also if there is no review text
    // Throw error if there's (no star and no review) or (no star, only review)
    if (((this.state.rating === 0) && (!this.state.review)) || ((this.state.rating === 0) && (this.state.review))) {
      Alerts.toast("Please select a rating star", "error");
    } else if ((this.state.rating) > 0 && (!this.state.review)) {
      // Check if there is rating but no review text
      // Compose rating and review object using details from users input
      ratingsObject = {
        reviewer: Meteor.user().name,
        rating: this.state.rating,
        review: "No review yet",
        productId: this.productInfo.product._id
      };

      //  Save ratings to the database
      this.saveToDatabase(ratingsObject);
    } else {
      // Compose rating and review object using details from users input if otherwise
      ratingsObject = {
        reviewer: Meteor.user().name,
        rating: this.state.rating,
        review: this.state.review,
        productId: this.productInfo.product._id
      };

      //  Save ratings to the database
      this.saveToDatabase(ratingsObject);
    }
  }
  /**
   * @param { object } event event on target element
   * @memberof Ratings
   * @desc accepts user inputs and saves it in state
   */
  handleUserInput(event) {
    event.preventDefault();
    this.setState({ [ event.target.name ]: event.target.value });
  }

  /**
   * @param { object } event event on target element
   * @memberof Ratings
   * @desc gets the value of rating star
   */
  getStarValue(event) {
    this.setState({ rating: event });
  }

  render() {
    return (
      <RatingsForm
        showReviewForm={this.showReviewForm}
        displayForm={this.state.displayForm}
        saveReview={this.handleSubmit}
        handleUserInput={this.handleUserInput}
        addReviewBtn={this.state.addReviewBtn}
        getStarValue={this.getStarValue}
        cancelReview={this.cancelReview}
        value={this.state.rating}
        reviews={this.state.reviews}
      />
    );
  }
}

export default Ratings;
