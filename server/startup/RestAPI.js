import {
  Shops,
  Products,
  Orders,
  Cart,
  Inventory,
  Emails,
  Accounts,
  Logs,
  Groups,
  Assets,
  Packages,
  Shipping,
  Tags
} from "../../lib/collections";

import Reaction from "../../server/api";

const hasPermission = (user, role) => {
  return user.roles[Reaction.getShopId()].includes(role);
};

/**
 * Configure CRUD operation for restful apis
 */
export default () => {
  const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    defaultHeaders: {
      "Content-Type": "application/json"
    }
  });

  const getRestApiOps = (nameOfCollection) => {
    return {
      routeOptions: {
        authRequired: true
      },

      endpoints: {
        /**
           * Post request
           */
        post: {
          action() {
            if (!(hasPermission(this.user, "admin") ||
               hasPermission(this.user, "owner"))) {
              return {
                status: 403,
                success: false,
                message: "You are forbidden to post a collection"
              };
            }
            if (hasPermission(this.user, "admin") ||
            hasPermission(this.user, "owner")) {
              const isPosted = nameOfCollection.insert(this.bodyParams);
              if (!isPosted) {
                return {
                  status: 500,
                  success: false,
                  message: "An error occurred on your post request"
                };
              }
              return {
                status: 201,
                success: true,
                postedData: isPosted
              };
            }
          }
        },

        /**
         * Get request
         */
        get: {
          action() {
            if (hasPermission(this.user, "admin") ||
                  hasPermission(this.user, "owner") ||
                  hasPermission(this.user, "guest")) {
              const records = nameOfCollection.findOne(this.urlParams.id);
              if (!records) {
                return {
                  status: 404,
                  success: false,
                  message: "Records does not exist"
                };
              }
              return {
                status: 200,
                success: true,
                records: records
              };
            }
          }
        },

        /**
         * Update request
         */
        update: {
          action() {
            if (!(hasPermission(this.user, "admin") ||
                hasPermission(this.user, "owner"))) {
              return {
                status: 403,
                success: false,
                message: "You are forbidden to update a collection"
              };
            }
            if (hasPermission(this.user, "admin") ||
             hasPermission(this.user, "owner")) {
              const isUpdated = nameOfCollection.upsert({ _id: this.urlParams.id }, {
                $set: this.bodyParams
              });
              if (!isUpdated) {
                return {
                  status: 500,
                  success: false,
                  message: "An error occurred on your update request"
                };
              }
              return {
                status: 200,
                success: true,
                updatedData: isUpdated
              };
            }
          }
        },

        /**
         * Delete Request
         */
        delete: {
          action() {
            if (!(hasPermission(this.user, "admin") ||
                hasPermission(this.user, "owner"))) {
              return {
                status: 403,
                success: false,
                message: "You are forbidden to update a collection"
              };
            }
            if (nameOfCollection._name === "Products") {
              const collection = nameOfCollection.findOne(this.urlParams.id);
              // update isDeleted field in db
              collection.isDeleted = true;
              const deletedCollection = nameOfCollection.upsert({ _id: this.urlParams.id }, {
                $set: collection
              });
              return {
                status: 200,
                deletedData: deletedCollection,
                message: "This product has been archived"
              };
            }
            const deletedCollection = nameOfCollection.remove({ _id: this.urlParams.id });
            return {
              status: 204,
              deletedData: deletedCollection,
              message: "Collection has been deleted"
            };
          }
        }
      }
    };
  };

  /**
   * Add collections
   */
  Api.addCollection(Shops, getRestApiOps(Shops));
  Api.addCollection(Products, getRestApiOps(Products));
  Api.addCollection(Orders, getRestApiOps(Orders));
  Api.addCollection(Cart, getRestApiOps(Cart));
  Api.addCollection(Inventory, getRestApiOps(Inventory));
  Api.addCollection(Emails, getRestApiOps(Emails));
  Api.addCollection(Accounts, getRestApiOps(Accounts));
  Api.addCollection(Logs, getRestApiOps(Logs));
  Api.addCollection(Groups, getRestApiOps(Groups));
  Api.addCollection(Assets, getRestApiOps(Assets));
  Api.addCollection(Tags, getRestApiOps(Tags));
  Api.addCollection(Shipping, getRestApiOps(Shipping));
  Api.addCollection(Packages, getRestApiOps(Packages));
};
