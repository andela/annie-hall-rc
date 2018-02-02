import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Reaction } from "/server/api";

import { Wallets, WalletHistories } from "/lib/collections";

Meteor.methods({

  /**
   * Creates wallet for a user on account creation
   * @return {String} ownerEmail
   */
  "wallet/create-user-wallet": function (ownerEmail) {
    console.log("createeeeee", ownerEmail);
    check(ownerEmail, String);

    Wallets.insert({ ownerEmail });
  },
  // /**
  //  * Create a refund
  //  * @param  {Object} paymentMethod object
  //  * @param  {Number} amount The amount to be refunded
  //  * @return {Object} result
  //  */
  // "wallet/refund/create": function (paymentMethod, amount) {
  //   check(paymentMethod, Reaction.Schemas.PaymentMethod);
  //   check(amount, Number);
  //   const { transactionId } = paymentMethod;
  //   const response = PaystackApi.methods.refund.call({
  //     transactionId: transactionId,
  //     amount: amount
  //   });
  //   const results = {
  //     saved: true,
  //     response: response
  //   };
  //   return results;
  // },

  "wallet/get-user-walletId": function (ownerEmail) {
    check(ownerEmail, String);
    // console.log(ownerEmail);
    const wallet = Wallets.findOne({ ownerEmail });
    if (!wallet) {
      throw new Meteor.Error("Error", "User not found for the provided email address");
    }

    return wallet._id;
  },

  "wallet/insert-transaction": function (transaction) {
    check(transaction, Object);
    WalletHistories.insert(transaction);
  },

  "wallet/update-balance": async function (transaction) {
    check(transaction, Object);
    const {
      amount,
      to,
      from,
      transactionType
    } = transaction;

    const updateBalance = (currentBalance, updateAmount, ownerEmail) => {
      try {
        Wallets.update({ ownerEmail }, {
          $set: {
            balance: currentBalance + updateAmount
          }
        });
        return 1;
      } catch (error) {
        return 0;
      }
    };

    let updateResult;

    if (to === from) {
      const wallet = Wallets.findOne({ ownerEmail: from });
      const currentBalance = wallet.balance;
      updateResult = updateBalance(currentBalance, amount, from);
    } else {
      if (transactionType === "credit") {
        const receiverWallet = Wallets.findOne({ ownerEmail: to });
        const currentBalance = receiverWallet.balance;
        updateResult = updateBalance(currentBalance, amount, to);
      } else {
        const senderWallet = Wallets.findOne({ ownerEmail: from });
        const currentBalance = senderWallet.balance;
        updateResult = updateBalance(currentBalance, -amount, from);
      }
    }
    return updateResult;
  }
});
