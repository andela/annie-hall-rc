import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";

/**
 * @description Schema structure for product ratings collection
 * @name Ratings
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} reviewer required
 * @property {String} rating required
 * @property {String} review optional
 * @property {String} productId required
 * @property {Date} createdAt required
 * @property {Date} updatedAt required
 */
export const Ratings = new SimpleSchema({
  reviewer: {
    type: String,
    optional: true
  },
  review: {
    type: String,
    optional: true
  },
  rating: {
    type: String,
    optional: true
  },
  productId: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue() {
      return new Date();
    }
  }
});

registerSchema("Ratings", Ratings);
