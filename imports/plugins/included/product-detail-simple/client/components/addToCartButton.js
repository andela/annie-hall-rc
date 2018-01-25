import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components, registerComponent } from "@reactioncommerce/reaction-components";

class AddToCartButton extends Component {
  get hasVariants() {
    return Array.isArray(this.props.variants) && this.props.variants.length > 0;
  }

  handleCartQuantityChange = (event) => {
    if (this.props.onCartQuantityChange) {
      this.props.onCartQuantityChange(event, event.target.value);
    }
  }

  render() {
    if (this.hasVariants) {
      return (
        <div>
          <div className="pdp add-to-cart block">
            <input
              className="form-control input-md"
              id="add-to-cart-quantity"
              min="1"
              name="addToCartQty"
              onChange={this.handleCartQuantityChange}
              type="number"
              value={this.props.cartQuantity}
            />
            <button
              className="input-group-addon add-to-cart-text js-add-to-cart"
              data-i18n="productDetail.addToCart"
              onClick={this.props.onClick || this.props.onAddToCart}
            >
              <Components.Translation defaultValue="Add to cart" i18nKey="productDetail.addToCart" />
            </button>
          </div>
          <br />
          <div>
            <center>
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fanniehallrc%2F&tabs=timeline&width=500&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=100248953877700"
                width="500"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowTransparency="true"
              />
              <br />

              <a href="https://twitter.com/anniehall_rc?ref_src=twsrc%5Etfw"
                className="twitter-btn"
                data-size="large"
                data-show-screen-name="false"
                data-lang="en"
                data-show-count="false"
              >
                <span className="label">
                  <i className="fa fa-twitter fa-lg" aria-hidden="true"/>&nbsp;Follow
                </span>
              </a>
            </center>
          </div>
        </div>
      );
    }

    if (this.props.editable && this.hasVariants === false) {
      return (
        <Components.Alert>
          <Components.Translation defaultValue="Add options to enable 'Add to Cart' button" i18nkey="productVariant.addVariantOptions" />
        </Components.Alert>
      );
    }
    return null;
  }
}

AddToCartButton.propTypes = {
  cartQuantity: PropTypes.number,
  editable: PropTypes.bool,
  onAddToCart: PropTypes.func,
  onCartQuantityChange: PropTypes.func,
  onClick: PropTypes.func,
  variants: PropTypes.arrayOf(PropTypes.object)
};

registerComponent("AddToCartButton", AddToCartButton);

export default AddToCartButton;
