import express from "express";
import { body, validationResult } from "express-validator";
import fetchUser from "../middleware/fetchuser.js";
import Notes from "../models/Notes.js";

const router = express.Router();

router.get("/fetchAll", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});

router.post(
  "/addNote",
  fetchUser,
  [body("title", "Add a Title").exists()],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title: title,
        description: description,
        tag: tag,
        user: req.user.id,
      });
      const addedNote = await note.save();
      res.json(addedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

router.put("/updateNote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("No such note exists");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});

router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    let  note = await Notes.findById(req.params.id)
    if (note.user.toString() !== req.user.id){
      return res.status(404).send("No such note exists")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({Status: "Success", "Note deleted": note})
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});
export default router;
