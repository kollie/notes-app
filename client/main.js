import { Meteor } from "meteor/meteor";
import ReactDOM from "react-dom";
import { Tracker } from "meteor/tracker";
import { Session } from "meteor/session";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

const history = createHistory();

window.browserHistory = history;

import { onAuthChange, routes } from "../imports/routes/routes";
import "../imports/startup/simple-schema-config";

Tracker.autorun(() => {
  const isAuthenticated = !!Meteor.userId();

  onAuthChange(isAuthenticated);
});

Tracker.autorun(() => {
  const selectedNoteId = Session.get("selectedNoteId");

  if (selectedNoteId) {
    browserHistory.replace(`/dashboard/${selectedNoteId}`);
  }
});

Meteor.startup(() => {
  Session.set("selectedNoteId", undefined);
  ReactDOM.render(routes, document.getElementById("app"));
});
