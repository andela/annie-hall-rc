import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { Reaction } from "/client/api";
import startIntro from "../../../../included/tour/tour";

class Brand extends Component {
  static propTypes = {
    logo: PropTypes.string,
    title: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    Reaction.Router.go("/");
  }
  startIntroBtn = (event) => {
    event.preventDefault();
    startIntro.startManualTour();
  }
  renderTourButton() {
    return (
      <div className="tourBtn">
        <a href="#" className="take-tour" onClick={this.startIntroBtn}>Take a Tour</a>
      </div>
    );
  }
  render() {
    return (
      <a className="brand" onClick={this.handleClick}>
        {this.props.logo &&
          <div className="logo">
            <img src={this.props.logo} />
          </div>
        }
        <img src="/resources/rc-logo.png" width="70" />
        <div className="tourBtn">
          <a href="#" className="take-tour" onClick={this.startIntroBtn}>Take a Tour</a>
        </div>
      </a>
    );
  }
}

registerComponent("Brand", Brand);

export default Brand;
