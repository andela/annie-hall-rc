/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { AutoForm } from "meteor/aldeed:autoform";
import { $ } from "meteor/jquery";
import { Cart } from "/lib/collections";
import { Paystack } from "../../lib/api";
import { PaystackPayment } from "../../lib/collections/schemas";
import { Random } from "meteor/random";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";

import "./paystack.html";

let submitting = false;

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

function paymentAlert(errorMessage) {
  return $(".alert").removeClass("hidden").text(errorMessage);
}

// function hidePaymentAlert() {
//   return $(".alert").addClass("hidden").text("");
// }

function handlePaystackSubmitError(error) {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}

const enableButton = (template, buttonText) => {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
};

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit(doc) {
    Meteor.call("paystack/loadApiKeys", (err, keys) => {
      if (keys) {
        const {
          pKey,
          sKey
        } = keys;
        const packageData = Packages.findOne({
          name: "paystack-paymentmethod",
          shopId: Reaction.getShopId()
        });
        const cart = Cart.findOne();
        const amount = Math.round(cart.cartTotal()) * 100;
        const template = this.template;
        const details = {
          key: pKey,
          name: doc.payerName,
          email: doc.email,
          reference: Random.id(),
          amount,
          callback(response) {
            if (response.reference) {
              Paystack.verify(response.reference, sKey, (error, res) => {
                if (error) {
                  handlePaystackSubmitError(template, error);
                  enableButton(template, "Resubmit payment");
                } else {
                  submitting = false;
                  const transaction = res.data;
                  const paymentMethod = {
                    paymentPackageId: packageData._id,
                    paymentSettingsKey: packageData.registry[0].settingsKey,
                    method: "credit",
                    processor: "Paystack",
                    storedCard: transaction.authorization.card_type,
                    transactionId: transaction.reference,
                    currency: transaction.currency,
                    amount: transaction.amount / 100,
                    status: "passed",
                    mode: "authorize",
                    createdAt: new Date(),
                    transactions: []
                  };
                  Alerts.toast("Transaction successful");
                  paymentMethod.transactions.push(transaction.authorization);
                  Meteor.call("cart/submitPayment", paymentMethod);
                }
              });
            }
          },
          onClose() {
            enableButton(template, "Complete payment");
          }
        };
        try {
          PaystackPop.setup(details).openIframe();
        } catch (error) {
          handlePaystackSubmitError(template, error);
          enableButton(template, "Complete payment");
        }
      }
    });
    return false;
  },
  endSubmit: function () {
    if (!submitting) {
      return uiEnd(this.template, "Complete your order");
    }
  }
});

// AutoForm.addHooks("paystack-payment-form", {
//   onSubmit: function (doc) {
//     submitting = true;
//     const template = this.template;
//     hidePaymentAlert();
//     const form = {
//       name: doc.payerName,
//       email: doc.email
//     };
//     // const storedCard = form.type.charAt(0).toUpperCase() + form.type.slice(1) + " " + doc.cardNumber.slice(-4);
//     Meteor.subscribe("Packages", Reaction.getShopId());
//     const packageData = Packages.findOne({
//       name: "paystack-paymentmethod",
//       shopId: Reaction.getShopId()
//     });

//     PaystackPop.setup({
//       key: "pk_test_3e29eeb73fd3622146141f4420caf388184604ed",
//       email: form.email,
//       amount: 100000,
//       container: "paystackEmbedContainer",
//       callback: function (response) {
//         console.log(response);
//         alert("successfully subscribed. transaction ref is ' + response.reference");

//         Paystack.authorize(form, {
//           total: Cart.findOne().getTotal(),
//           currency: Shops.findOne().currency
//         }, function (error, transaction) {
//           submitting = false;
//           let paymentMethod;
//           if (error) {
//             handlePaystackSubmitError(error);
//             uiEnd(template, "Resubmit payment");
//           } else {
//             if (transaction.saved === true) {
//               submitting = false;
//               paymentMethod = {
//                 processor: "Paystack",
//                 paymentPackageId: packageData._id,
//                 paymentSettingsKey: packageData.registry[0].settingsKey,
//                 // storedCard: storedCard,
//                 method: "credit",
//                 transactionId: transaction.transactionId,
//                 riskLevel: transaction.riskLevel,
//                 currency: transaction.currency,
//                 amount: transaction.amount,
//                 status: transaction.status,
//                 mode: "authorize",
//                 createdAt: new Date(),
//                 transactions: []
//               };
//               paymentMethod.transactions.push(transaction.response);
//               Meteor.call("cart/submitPayment", paymentMethod);
//             } else {
//               handlePaystackSubmitError(transaction.error);
//               uiEnd(template, "Resubmit payment");
//             }
//           }
//         });
//       }
//     }).openIframe();
//     return false;
//   },
//   beginSubmit: function () {
//     this.template.$(":input").attr("disabled", true);
//     this.template.$("#btn-complete-order").text("Submitting ");
//     return this.template.$("#btn-processing").removeClass("hidden");
//   },
//   endSubmit: function () {
//     if (!submitting) {
//       return uiEnd(this.template, "Complete your order");
//     }
//   }
// });
