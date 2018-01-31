import React from "react";

class CancelOrderButton extends React.Component {
	click = (event) => {
	  event.preventDefault();
	}
	render() {
	  return (
	    <div className="cancel-order-button">
	      <button
	        className="btn-warning btn btn-large"
	        onClick={this.click}
	      >
					Cancel order
	      </button>
	    </div>
	  );
	}
}
export default CancelOrderButton;
