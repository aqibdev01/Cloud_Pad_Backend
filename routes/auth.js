import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchuser.js"

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
    const key = process.env.JWT_SECRET;
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      let data = {
        user:{
          id: user.id,
        }
      }

      const authToken = jwt.sign(data, key);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occured");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a corect address").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const {email, password} = req.body;
    const key = process.env.JWT_SECRET;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: "Invalid credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ errors: "Invalid credentials" });
      }
      let data = {
        user:{
          id: user.id,
        }
      }
      const authToken = jwt.sign(data, key);
      res.json({authToken: authToken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/getUser",fetchUser, async (req, res) => {
  try {
  let userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.json(user);
    
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
});
export default router;
