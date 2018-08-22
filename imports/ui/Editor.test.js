import { Meteor } from "meteor/meteor";
import React from "react";
import expect from "expect";
import { mount } from "enzyme";

import { Editor } from "./Editor";
import { notes } from "../fixtures/fixtures";

if (Meteor.isClient) {
  describe("Editor", function() {
    let browserHistory;
    let call;

    beforeEach(function() {
      call = expect.createSpy();
      browserHistory = {
        push: expect.createSpy()
      };
    });

    it("should render pick note message", function() {
      const wrapper = mount(
        <Editor browserHistory={browserHistory} call={call} />
      );
      expect(wrapper.find("p").text()).toBe(
        "Pick or create a note to get started."
      );
    });

    it("should render not found message", function() {
      const wrapper = mount(
        <Editor
          browserHistory={browserHistory}
          call={call}
          selectedNoteId={notes[0]._id}
        />
      );
      expect(wrapper.find("p").text()).toBe("Note not found.");
    });

    it("should remove note", function() {
      const wrapper = mount(
        <Editor
          browserHistory={browserHistory}
          call={call}
          selectedNoteId={notes[0]._id}
          note={notes[0]}
        />
      );
      wrapper.find("button").simulate("click");
      expect(browserHistory.push).toHaveBeenCalledWith("/dashboard");
      expect(call).toHaveBeenCalledWith("notes.remove", notes[0]._id);
    });

    it("should update the note body on textarea", function() {
      const newBody = "Hello there";
      const wrapper = mount(
        <Editor
          browserHistory={browserHistory}
          call={call}
          selectedNoteId={notes[0]._id}
          note={notes[0]}
        />
      );

      wrapper.find("textarea").simulate("change", {
        target: {
          body: newBody
        }
      });
      expect(wrapper.state("body")).toBe(newBody);
      expect(call).toHaveBeenCalledWith("notes.update", notes[0]._id, {
        target: newBody
      });

      it("should update the note title on input", function() {
        const title = "Hello";
        const wrapper = mount(
          <Editor
            browserHistory={browserHistory}
            call={call}
            selectedNoteId={notes[0]._id}
            note={notes[0]}
          />
        );

        wrapper.find("input").simulate("change", {
          target: {
            title: title
          }
        });
        expect(wrapper.state("title")).toBe(title);
        expect(call).toHaveBeenCalledWith("notes.update", notes[0]._id, {
          title: title
        });
      });
    });

    it("should set state for new note", function() {
      const wrapper = mount(
        <Editor browserHistory={browserHistory} call={call} />
      );

      wrapper.setProps({
        selectedNoteId: notes[0]._id,
        note: notes[0]
      });

      expect(wrapper.state("title")).toBe(notes[0].title);
      expect(wrapper.state("body")).toBe(notes[0].body);
    });

    it("should not set state if note prop not provided", function() {
      const wrapper = mount(
        <Editor browserHistory={browserHistory} call={call} />
      );

      wrapper.setProps({
        selectedNoteId: notes[0]._id
      });

      expect(wrapper.state("title")).toBe("");
      expect(wrapper.state("body")).toBe("");
    });
  });
}
