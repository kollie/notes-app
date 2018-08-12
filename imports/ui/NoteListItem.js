import React from "react";
import moment from "moment";
import propTypes from "prop-types";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";

export const NoteListItem = props => {
  return (
    <div
      onClick={() => {
        props.Session.set("selectedNoteId", props.note._id);
      }}
    >
      <h5>{props.note.title || "Untitled Note"}</h5>
      <p>{moment(props.updatedAt).format("M/DD/YY")}</p>
    </div>
  );
};

Notification.propTypes = {
  note: propTypes.object.isRequired,
  Session: propTypes.object.isRequired
};

export default withTracker(() => {
  return { Session };
})(NoteListItem);
