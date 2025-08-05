import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

router.post(
  "/createUser",
  [
    body("name", "Not a valid Name").notEmpty(),
    body("email", "Not a valid Email").isEmail().notEmpty(),
    body("password", "Not a valid Password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const user = new User(req.body);
    // user.save();
    // res.send(req.body);
    let user = await User.findOne({email: req.body.email});
    if (user){
        return res.status(400).json({error: "Email already exists"})
    }
    const salt = await bcrypt.genSalt(10)
    const secPassword = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPassword,
    })
    // const jwtSecret =  process.env.JWT_SECRET;

    const authToken = jwt.sign({user: user.id}, process.env.JWT_SECRET)
    res.json({authToken})
    //   .then((user) => res.json(user))
    //   .catch((err) => {
    //     res.json({ err: "Email already exists", message: err.message });
    //   });
  }
);

export default router;
