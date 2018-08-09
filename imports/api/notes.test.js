import { Meteor } from "meteor/meteor";
import expect from "expect";

import { Notes } from "./notes";

describe("notes", function() {
  const noteOne = {
    _id: "testNoteId1",
    title: "My title",
    body: "My body for note",
    updatedAt: 0,
    userId: "testUserId1"
  };

  const noteTwo = {
    _id: "testNoteId2",
    title: "My title here",
    body: "My body for update",
    updatedAt: 0,
    userId: "testUserId2"
  };

  beforeEach(function() {
    Notes.remove({});

    Notes.insert(noteOne);
    Notes.insert(noteTwo);
  });

  it("should insert new note", function() {
    const userId = "testId";
    const _id = Meteor.server.method_handlers["notes.insert"].apply({ userId });

    expect(Notes.findOne({ _id, userId })).toExist();
  });

  it("should not insert note if not authenticated", function() {
    expect(() => {
      Meteor.server.method_handlers["notes.insert"]();
    }).toThrow();
  });

  it("should remove note", function() {
    Meteor.server.method_handlers["notes.insert"].apply(
      { userId: noteOne.userId },
      [noteOne._id]
    );

    expect(Notes.findOne({ _id: noteOne._id })).toNotExist();
  });

  it("should not remove note if unauthenticated", function() {
    expect(() => {
      Meteor.server.method_handlers["notes.insert"].apply({}, [noteOne._id]);
    }).toThrow();
  });

  it("should not remove if invalid _id", function() {
    expect(() => {
      Meteor.server.method_handlers["notes.insert"].apply({
        userId: noteOne.userId
      });
    }).toThrow();
  });

  it("should update note", function() {
    const title = "updated title";

    Meteor.server.method_handlers["notes.update"].apply(
      {
        userId: noteOne.userId
      },
      [noteOne._id, title]
    );

    const note = Notes.findOne(noteOne._id);

    expect(noteOne.updatedAt).toBeGreaterThan(0);
    expect(note).toInclude({ title, body: noteOne.body });
  });

  it("should throw error if extra update", function() {
    expect(() => {
      Meteor.server.method_handlers["notes.update"].apply(
        { userId: noteOne.userId },
        [noteOne._id, { title: "new title", name: "Kollie" }]
      );
    }).toThrow();
  });

  it("should note update note if user was not creator", function() {
    const title = "this is updated";

    Meteor.server.method_handlers["notes.update"].apply({ userId: "testid" }, [
      noteOne._id,
      { title }
    ]);

    const note = Notes.findOne(noteOne._id);

    expect(note).toInclude(noteOne);
  });

  it("should not update note if unauthenticated", function() {
    expect(() => {
      Meteor.server.method_handlers["notes.update"].apply({}, [noteOne._id]);
    }).toThrow();
  });

  it("should not update if invalid _id", function() {
    expect(() => {
      Meteor.server.method_handlers["notes.update"].apply({
        userId: noteOne.userId
      });
    }).toThrow();
  });

  it("should return a users note", function() {
    const res = Meteor.server.publish_handlers.notes.apply({
      userId: noteOne.userId
    });

    const notes = res.fetch();

    expect(notes.length).toBe(1);
    expect(notes[0]).toEqual(noteOne);
  });

  it("should return no note for user that has none", function() {
    const res = Meteor.server.publish_handlers.notes.apply({
      userId: "testeidd"
    });

    const notes = res.fetch();
    expect(notes.length).toBe(0);
  });
});
