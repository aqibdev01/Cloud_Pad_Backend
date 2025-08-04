import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

router.post(
  "/",
  [
    body("name", "Not a valid Name").notEmpty(),
    body("email", "Not a valid Email").isEmail().notEmpty(),
    body("password", "Not a valid Password").isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // const user = new User(req.body);
    // user.save();
    // res.send(req.body);
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) => {
        res.json({ err: "Email already exists", message: err.message });
      });
  }
);

export default router;
