import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import * as Collections from "/lib/collections";
import { Reaction } from "/client/api";
import { TextField, Button, IconButton, SortableTableLegacy } from "@reactioncommerce/reaction-ui";
import ProductGridContainer from "/imports/plugins/included/product-variant/containers/productGridContainer";
import { accountsTable } from "../helpers";

class SearchModal extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    allProducts: PropTypes.array,
    handleAccountClick: PropTypes.func,
    handleChange: PropTypes.func,
    handleClick: PropTypes.func,
    handleTagClick: PropTypes.func,
    handleToggle: PropTypes.func,
    products: PropTypes.array,
    siteName: PropTypes.string,
    tags: PropTypes.array,
    unmountMe: PropTypes.func,
    value: PropTypes.string
  }
  state = {
    allProducts: [],
    productsBeforeSortAndFilter: [],
    productsAfterSortAndFilter: [],
    displaySortAndFilter: "",
    showAllProducts: null,
    lowPriceFilter: 0,
    highPriceFilter: 0
  };
  componentWillMount() {
    const allProducts = Collections.Products.find({ ancestors: [] }, { sort: { createdAt: -1 }, limit: 10 }).fetch();
    let bool = false;
    if (!this.props.value && allProducts.length > 0) {
      bool = true;
    }
    this.setState({
      allProducts,
      productsBeforeSortAndFilter: this.props.value ? this.props.products : [],
      productsAfterSortAndFilter: this.props.value ? this.props.products : allProducts,
      displaySortAndFilter: this.props.products.length > 1 ? "inline-block" : "none",
      showAllProducts: bool
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      productsBeforeSortAndFilter: nextProps.products,
      productsAfterSortAndFilter: nextProps.products,
      displaySortAndFilter: nextProps.products.length > 1 ? "inline-block" : "none",
      showAllProducts: this.props.value < 1
    });
  }

  handleSortByPrice = event => {
    const selected = event.target.value;
    const unsorted = [...this.state.productsAfterSortAndFilter];
    let sortedProducts = [];
    if (selected === "highest-price") {
      sortedProducts = _.orderBy(unsorted, ["price.max"], ["desc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    } else if (selected === "lowest-price") {
      sortedProducts = _.orderBy(unsorted, ["price.max"], ["asc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    } else {
      this.setState({ productsAfterSortAndFilter: this.state.productsBeforeSortAndFilter });
    }
  }

  handleSortByName = event => {
    const selected = event.target.value;
    const unsorted = [...this.state.productsAfterSortAndFilter];
    let sortedProducts = [];
    if (selected === "asc") {
      sortedProducts = _.orderBy(unsorted, ["title"], ["asc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    }
    if (selected === "desc") {
      sortedProducts = _.orderBy(unsorted, ["title"], ["desc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    } else {
      this.setState({ productsAfterSortAndFilter: this.state.productsBeforeSortAndFilter });
    }
  }
  handlePriceChange = event => {
    if (event.target.name === "lowest") {
      this.setState({ lowPriceFilter: event.target.value });
    }
    if (event.target.name === "highest") {
      this.setState({ highPriceFilter: event.target.value });
    }
  }

  handleFilterByPrice = event => {
    event.preventDefault();
    const filtered = this.state.productsBeforeSortAndFilter.filter(
      (product) => product.price.max >= this.state.lowPriceFilter && product.price.max <= this.state.highPriceFilter);
    this.setState({ productsAfterSortAndFilter: filtered });
  }

  renderSortByPrice() {
    return (
      <div className="select-input col-md-3">
        <p>Sort By Price</p>
        <div className="rui select">
          <select name="sort" id="product-sort" onChange={this.handleSortByPrice}>
            <option value="all" defaultValue>--Sort By--</option>
            <option value="highest-price">Highest price</option>
            <option value="lowest-price">Lowest Price</option>
          </select>
        </div>
      </div>
    );
  }

  renderSortByName() {
    return (
      <div className="select-input col-md-3">
        <p>Sort By Name</p>
        <div className="rui select">
          <select name="" id="product-filter" onChange={this.handleSortByName}>
            <option value="all" defaultValue>--Sort Order--</option>
            <option value="asc" >Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    );
  }

  renderFilterByPrice() {
    return (
      <div className="price-input col-md-3">
        <span>Filter By Price Range:</span>
        <form className="form-input">
          <input type="number" name="lowest" onChange={this.handlePriceChange} className="input-field" />
          <span className="input-text"> to </span>
          <input type="number" name="highest" onChange={this.handlePriceChange} className="input-field" />
          <button className="price-filter-btn" onClick={this.handleFilterByPrice} >Filter</button>
        </form>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      productsBeforeSortAndFilter: [],
      productsAfterSortAndFilter: [],
      displaySortAndFilter: "",
      showAllProducts: null,
      lowPriceFilter: 0,
      highPriceFilter: 0
    };
  }
  componentWillMount() {
    const allProducts = Collections.Products.find({ ancestors: [] }, { sort: { createdAt: -1 }, limit: 10 }).fetch();
    let bool = false;
    if (!this.props.value && allProducts.length > 0) {
      bool = true;
    }
    this.setState({
      allProducts,
      productsBeforeSortAndFilter: this.props.value ? this.props.products : [],
      productsAfterSortAndFilter: this.props.value ? this.props.products : allProducts,
      displaySortAndFilter: this.props.products.length > 1 ? "inline-block" : "none",
      showAllProducts: bool
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      productsBeforeSortAndFilter: nextProps.products,
      productsAfterSortAndFilter: nextProps.products,
      displaySortAndFilter: nextProps.products.length > 1 ? "inline-block" : "none",
      showAllProducts: this.props.value < 1
    });
  }

  handleSortByPrice = event => {
    const selected = event.target.value;
    const unsorted = [...this.state.productsAfterSortAndFilter];
    let sortedProducts = [];
    if (selected === "highest-price") {
      sortedProducts = _.orderBy(unsorted, ["price.max"], ["desc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    } else if (selected === "lowest-price") {
      sortedProducts = _.orderBy(unsorted, ["price.max"], ["asc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    } else {
      this.setState({ productsAfterSortAndFilter: this.state.productsBeforeSortAndFilter });
    }
  }

  handleSortByName = event => {
    const selected = event.target.value;
    const unsorted = [...this.state.productsAfterSortAndFilter];
    let sortedProducts = [];
    if (selected === "asc") {
      sortedProducts = _.orderBy(unsorted, ["title"], ["asc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    }
    if (selected === "desc") {
      sortedProducts = _.orderBy(unsorted, ["title"], ["desc"]);
      this.setState({ productsAfterSortAndFilter: sortedProducts });
    } else {
      this.setState({ productsAfterSortAndFilter: this.state.productsBeforeSortAndFilter });
    }
  }
  handlePriceChange = event => {
    if (event.target.name === "lowest") {
      this.setState({ lowPriceFilter: event.target.value });
    }
    if (event.target.name === "highest") {
      this.setState({ highPriceFilter: event.target.value });
    }
  }

  handleFilterByPrice = event => {
    event.preventDefault();
    const filtered = this.state.productsBeforeSortAndFilter.filter(
      (product) => product.price.max >= this.state.lowPriceFilter && product.price.max <= this.state.highPriceFilter);
    this.setState({ productsAfterSortAndFilter: filtered });
  }

  renderSortByPrice() {
    return (
      <div className="select-input col-md-3">
        <p>Sort By Price</p>
        <div className="rui select">
          <select name="sort" id="product-sort" onChange={this.handleSortByPrice}>
            <option value="all" defaultValue>--Sort By--</option>
            <option value="highest-price">Highest price</option>
            <option value="lowest-price">Lowest Price</option>
          </select>
        </div>
      </div>
    );
  }

  renderSortByName() {
    return (
      <div className="select-input col-md-3">
        <p>Sort By Name</p>
        <div className="rui select">
          <select name="" id="product-filter" onChange={this.handleSortByName}>
            <option value="all" defaultValue>--Sort Order--</option>
            <option value="asc" >Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    );
  }

  renderFilterByPrice() {
    return (
      <div className="price-input col-md-3">
        <span>Filter By Price Range:</span>
        <form className="form-input">
          <input type="number" name="lowest" onChange={this.handlePriceChange} className="input-field" />
          <span className="input-text"> to </span>
          <input type="number" name="highest" onChange={this.handlePriceChange} className="input-field" />
          <button className="price-filter-btn" onClick={this.handleFilterByPrice} >Filter</button>
        </form>
      </div>
    );
  }

  renderSearchInput() {
    return (
      <div className="rui search-modal-input">
        <label data-i18n="search.searchInputLabel">Search {this.props.siteName}</label>
        <i className="fa fa-search search-icon" />
        <TextField
          className="search-input"
          textFieldStyle={{ marginBottom: 0 }}
          onChange={this.props.handleChange}
          value={this.props.value}
        />
        <Button
          className="search-clear"
          i18nKeyLabel="search.clearSearch"
          label="Clear"
          containerStyle={{ fontWeight: "normal" }}
          onClick={this.props.handleClick}
        />
      </div>
    );
  }

  renderSearchTypeToggle() {
    if (Reaction.hasPermission("admin")) {
      return (
        <div className="rui search-type-toggle">
          <div
            className="search-type-option search-type-active"
            data-i18n="search.searchTypeProducts"
            data-event-action="searchCollection"
            data-event-value="products"
            onClick={() => this.props.handleToggle("products")}
          >
            Products
          </div>
          {Reaction.hasPermission("accounts") &&
            <div
              className="search-type-option"
              data-i18n="search.searchTypeAccounts"
              data-event-action="searchCollection"
              data-event-value="accounts"
              onClick={() => this.props.handleToggle("accounts")}
            >
              Accounts
            </div>
          }
        </div>
      );
    }
  }

  renderProductSearchTags() {
    return (
      <div className="rui search-modal-tags-container">
        <p className="rui suggested-tags" data-i18n="search.suggestedTags">Suggested tags</p>
        <div className="rui search-tags">
          {this.props.tags.map((tag) => (
            <span
              className="rui search-tag"
              id={tag._id} key={tag._id}
              onClick={() => this.props.handleTagClick(tag._id)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  render() {
    let { productsAfterSortAndFilter } = this.state;
    const { displaySortAndFilter, showAllProducts, allProducts } = this.state;
    if (this.props.value < 1 && allProducts.length > 1) {
      productsAfterSortAndFilter = [...allProducts];
    }
    return (
      <div>
        <div className="rui search-modal-close"><IconButton icon="fa fa-times" onClick={this.props.unmountMe} /></div>
        <div className="rui search-modal-header">
          {this.renderSearchInput()}
          {this.renderSearchTypeToggle()}

          <div className="sort-filter row" style={{ display: displaySortAndFilter }}>
            {this.renderSortByPrice()}
            {this.renderSortByName()}
            {this.renderFilterByPrice()}
          </div>

          {this.props.tags.length > 0 && this.renderProductSearchTags()}
          {this.props.value.length >= 3 && productsAfterSortAndFilter.length < 1 && <h2>No product(s) found</h2>}
          <div className="rui search-modal-results-container">
            {showAllProducts && <h2 style={{ textAlign: "center" }}> Lastest Products</h2>}
            {productsAfterSortAndFilter.length > 0 &&
            <ProductGridContainer
              products={productsAfterSortAndFilter}
              unmountMe={this.props.unmountMe}
              isSearch={true}
            />
            }
            {this.props.accounts.length > 0 &&
            <div className="data-table">
              <div className="table-responsive">
                <SortableTableLegacy
                  data={this.props.accounts}
                  columns={accountsTable()}
                  onRowClick={this.props.handleAccountClick}
                />
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default SearchModal;
