import User from "../../Models/UserModel.js"
import { generateToken } from "../../utils/jwt.js"

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    // Fix: Access userId from req.user.userId instead of req.user.id
    const userId = req.user.userId

    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ user })
  } catch (err) {
    console.error("Error in getUserProfile:", err)
    res.status(500).json({ message: "Error fetching user profile", error: err.message })
  }
}

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    // Fix: Access userId from req.user.userId instead of req.user.id
    const userId = req.user.userId
    const { username, email, currentPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update basic info
    if (username) user.username = username
    if (email) user.email = email

    // If user is trying to change password
    if (newPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" })
      }

      // Set new password (will be hashed by pre-save hook)
      user.password = newPassword
    }

    user.updatedAt = Date.now()
    await user.save()

    // Generate a new token with updated user info
    const token = generateToken(user._id, user.role)

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password")

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      token,
    })
  } catch (err) {
    console.error("Error in updateUserProfile:", err)
    res.status(500).json({ message: "Error updating profile", error: err.message })
  }
}

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    // Fix: Access userId from req.user.userId instead of req.user.id
    const userId = req.user.userId
    const { password } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Verify password before deletion
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" })
    }

    // Delete the user
    await User.findByIdAndDelete(userId)

    res.status(200).json({ message: "Account deleted successfully" })
  } catch (err) {
    console.error("Error in deleteUserAccount:", err)
    res.status(500).json({ message: "Error deleting account", error: err.message })
  }
}
