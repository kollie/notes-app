import React from "react";
import expect from "expect";
import { Meteor } from "meteor/meteor";
import { mount } from "enzyme";

import { NoteListItem } from "../imports/ui/NoteListItem";
import { notes } from "./fixtures/fixtures";

if (Meteor.isClient) {
  describe("NoteListItem", function() {
    let Session;

    beforeEach(() => {
      Session = {
        set: expect.createSpy()
      };
    });
    it("should title and timestamp", function() {
      const wrapper = mount(<NoteListItem note={notes[0]} Session={Session} />);

      expect(wrapper.find("h5").text()).toBe(notes[0].title);
      expect(wrapper.find("p").text()).toBe("8/09/18");
    });

    it("should set default if no title set", function() {
      const wrapper = mount(<NoteListItem note={notes[1]} Session={Session} />);

      expect(wrapper.find("h5").text()).toBe("Untitled Note");

      it("should call set onclick", function() {
        const wrapper = mount(
          <NoteListItem note={notes[0]} Session={Session} />
        );

        wrapper.find("div").simulate("click");
        expect(Session.set).toHaveBeenCalledWith(
          "selectedNoteId",
          notes[0]._id
        );
      });
    });
  });
}
