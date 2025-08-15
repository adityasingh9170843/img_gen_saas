import express from "express";
import { registerUser, loginUser, logoutUser,userCredits } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.get("/userCredits",protect,userCredits);

export default router