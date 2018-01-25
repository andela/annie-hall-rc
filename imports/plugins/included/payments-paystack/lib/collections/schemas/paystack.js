import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";
import { registerSchema } from "@reactioncommerce/reaction-collections";

export const PaystackPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.mode": {
      type: Boolean,
      defaultValue: true
    },
    "settings.sKey": {
      type: String,
      label: "Secret Key",
      optional: true
    },
    "settings.pKey": {
      type: String,
      label: "Public Key",
      optional: true
    }
  }
]);

registerSchema("PaystackPackageConfig", PaystackPackageConfig);

export const PaystackPayment = new SimpleSchema({
  payerName: {
    type: String,
    label: "Full name"
  },
  email: {
    type: String,
    label: "Email"
  }
});

registerSchema("PaystackPayment", PaystackPayment);
