import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Ratings } from "../../../lib/collections";

/**
 * @description Methods for saving and fetching product reviews and ratings
 * @returns {Object} Ratings
 */

Meteor.methods({
  saveRatings(userObject) {
    check(userObject, Object);
    Ratings.insert(userObject);
    return Ratings.find({ productId: userObject.productId }).fetch();
  },
  fetchRatings(id) {
    check(id, String);
    return Ratings.find({ productId: id }).fetch();
  }
});
