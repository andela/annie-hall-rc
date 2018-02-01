import React from "react";
import PropTypes from "prop-types";

const CancelOrderButton = ({ cancelOrder, order }) => {
	  return (
    <div>
      {
        order.workflow.status !== "coreOrderWorkflow/canceled" ?
          (
            <div>
	    				<div className="cancel-order-button">
	     				 <button
  								className="btn-warning btn btn-block"
  								onClick={cancelOrder}
	      				>
							Cancel order
	      			</button>
	    				</div>
            </div>
          ) :
          " "
      }
    </div>
	  );
};

CancelOrderButton.propTypes = {
  cancelOrder: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired
};
export default CancelOrderButton;
