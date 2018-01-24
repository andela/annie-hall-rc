import React, { Component } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Components } from "@reactioncommerce/reaction-components";

class ProductGrid extends Component {
  static propTypes = {
    products: PropTypes.array
  }
  constructor(props) {
    super(props);
    this.state = {
      allProducts: props.products,
      nextProducts: [],
      lastIndex: 12,
      hasMore: true
    };
    // this.generateProducts = this.generateProducts.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.allProducts.length > 12) {
      this.setState({ nextProducts: nextProps.products.slice(0, this.state.lastIndex) });
    } else {
      this.setState({ nextProducts: this.state.allProducts });
    }
  }

  generateProducts = () => {
    const moreProducts = this.state.allProducts.slice(this.state.lastIndex, this.state.lastIndex + 12);
    const currentProducts = this.state.nextProducts.concat(moreProducts);
    setTimeout(() => {
      this.setState({ nextProducts: currentProducts, lastIndex: this.state.lastIndex + 12 }, () => {
        if (this.state.lastIndex > this.state.allProducts.length) {
          this.setState({ hasMore: false });
        }
      });
    }, 100);
  }

  renderProductGridItems = (products) => {
    if (Array.isArray(products)) {
      return products.map((product, index) => {
        return (
          <Components.ProductGridItems
            {...this.props}
            product={product} key={index} index={index}
          />
        );
      });
    }
    return (
      <div className="row">
        <div className="text-center">
          <h3>
            <Components.Translation defaultValue="No Products Found" i18nKey="app.noProductsFound" />
          </h3>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container-main">
        <div className="product-grid">
          <Components.DragDropProvider>
            <InfiniteScroll
              next={this.generateProducts}
              hasMore={this.state.hasMore}
              height={900}
              loader={<Components.Loading />}
            >
              <ul className="product-grid-list list-unstyled" id="product-grid-list">
                {this.renderProductGridItems(this.state.nextProducts)}
              </ul>
            </InfiniteScroll>
          </Components.DragDropProvider>
        </div>
      </div>
    );
  }
}

export default ProductGrid;
