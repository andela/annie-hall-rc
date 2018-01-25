import { Meteor } from "meteor/meteor";
import request from "request";
import { Packages } from "/lib/collections";

const getPaystackHeader = (secretKey) => {
  return {
    "Authorization": `Bearer ${secretKey}`,
    "Content-Type": "application/json"
  };
};

export const Paystack = {
  accountOptions: function () {
    const settings = Packages.findOne({
      name: "reaction-paymentmethod"
    }).settings;
    if (!settings.sKey && !settings.pkey) {
      throw new Meteor.Error("403", "Invalid Credentials");
    }
    return { secretKey: settings.sKey,
      publicKey: settings.pkey };
  },

  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("paystackSubmit", "authorize", cardInfo, paymentInfo, callback);
  },

  verify: (referenceNumber, secretKey, callback) => {
    const referenceId = referenceNumber;
    const headers = getPaystackHeader(secretKey);
    const paystackUrl = `https://api.paystack.co/transaction/verify/${referenceId}`;
    request.get(paystackUrl, {
      headers
    }, (error, response, body) => {
      const responseBody = JSON.parse(body);
      if (responseBody.status) {
        callback(null, responseBody);
      } else {
        callback(responseBody, null);
      }
    });
  }
};
