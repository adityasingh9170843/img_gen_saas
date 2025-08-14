import {userModel } from "../models/userModel.js";
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

    const userExists = await user.findOne({ email });
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
          httpOnly: true,
          secure: true,
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
  } catch(error) {
    res.status(500).json({ message: "Something went wrong" });
    throw new Error(error);
  }
};


export const loginUser = async(req,res)=>{
    try{
      const {email,password} = req.body;
    }
    catch{

    }
}

export const logoutUser = async(req,res)=>{
    
}