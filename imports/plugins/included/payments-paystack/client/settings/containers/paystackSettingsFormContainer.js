import React, { Component } from "react";
import PropTypes from "prop-types";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Packages } from "/lib/collections";
import { TranslationProvider } from "/imports/plugins/core/ui/client/providers";
import { Reaction, i18next } from "/client/api";
import { PaystackSettingsForm } from "../components";

class PaystackSettingsFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sKey: "278302390293",
      pKey: "278302390293"
    };
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      sKey: e.target.value,
      pkey: e.target.value
    });
  }

  handleSubmit = (settings) => {
    const packageId = this.props.packageData._id;
    const { settingsKey } = this.props.packageData.registry[0];

    const fields = [{
      property: "sKey",
      value: settings.sKey
    }, {
      property: "pKey",
      value: settings.pKey
    }, {
      property: "support",
      value: settings.support
    }];

    this.saveUpdate(fields, packageId, settingsKey);
  }

  saveUpdate = (fields, id, settingsKey) => {
    Meteor.call("registry/update", id, settingsKey, fields, (err) => {
      if (err) {
        return Alerts.toast(i18next.t("admin.settings.saveFailed"), "error");
      }
      return Alerts.toast(i18next.t("admin.settings.saveSuccess"), "success");
    });
  }

  render() {
    const { settingsKey } = this.props.packageData.registry[0];
    return (
      <TranslationProvider>
        <PaystackSettingsForm
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          settings={this.props.packageData.settings[settingsKey]}
        />
      </TranslationProvider>
    );
  }
}

PaystackSettingsFormContainer.propTypes = {
  packageData: PropTypes.object
};

const composer = ({ }, onData) => {
  const subscription = Meteor.subscribe("Packages", Reaction.getShopId());
  if (subscription.ready()) {
    const packageData = Packages.findOne({
      name: "paystack-paymentmethod",
      shopId: Reaction.getShopId()
    });
    onData(null, { packageData });
  }
};

export default composeWithTracker(composer)(PaystackSettingsFormContainer);
