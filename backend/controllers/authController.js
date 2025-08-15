import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).json({ message: "Something went wrong" });
        }
        const user = await userModel.create({
          name,
          email,
          password: hash,
        });
        let token = generateToken(user);
        res.cookie("token", token, {
          httpOnly: false,
          secure: false,
          sameSite: "None",
        });
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    throw new Error(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Something went wrong" });
      }
      if (!result) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
      let token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "None",
      });
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const userCredits = async (req,res) => {
  try{
    const user = req.loggedInUser;
    const userID = user._id;

    const user1 = await userModel.findById(userID);
    res.status(200).json({creditBalance:user1.creditBalance}); 
  }catch(error){
    res.status(400);
    console.log("got error", error);
    throw new Error(error.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400);
    console.log("got error", error);
    throw new Error(error.message);
  }
};
