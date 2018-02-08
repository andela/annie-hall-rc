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
    check(ownerEmail, String);

    Wallets.insert({ ownerEmail });
  },

  "wallet/get-user-walletId": function (ownerEmail) {
    check(ownerEmail, String);
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
