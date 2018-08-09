import React from "react";
import propTypes from "prop-types";
import { Accounts } from "meteor/accounts-base";
import { withTracker } from "meteor/react-meteor-data";

export const PrivateHeader = props => {
  return (
    <div className="header">
      <div className="header__content">
        <h1 className="header__title">{props.title}</h1>
        <button
          className="button button--link-text"
          onClick={() => {
            props.handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

PrivateHeader.prototype = {
  title: propTypes.string.isRequired,
  handleLogout: propTypes.func.isRequired
};

export default withTracker(() => {
  return {
    handleLogout: () => Accounts.logout()
  };
})(PrivateHeader);
