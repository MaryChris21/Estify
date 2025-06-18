import express from "express"
import * as UserController from "../Database/Controllers/UserController.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

// Get user profile
router.get("/profile", authenticate, UserController.getUserProfile)

// Update user profile
router.put("/profile", authenticate, UserController.updateUserProfile)

// Delete user account
router.delete("/profile", authenticate, UserController.deleteUserAccount)

export default router
