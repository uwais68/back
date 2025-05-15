import User from "../models/User.js"; // Make sure the User model is correctly imported

// ✅ Controller to Update User Profile
export async function updateProfile   (req, res)  {
    console.log("Decode user:", req.user);
  try {
    const { firstName, lastName, email, profilePicture } = req.body;

    // Find user by ID (from JWT token)
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update user details
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save(); // Save the updated user to the database

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function getusers(req,res) {
  try {
    const users = await User.find()
    if(!users)return res.status(400).json({error:"Error"})
    return res.status(200).json(users)
  } catch (error) {
    
  }
}

export async function getuserByID(req,res){
  try {
    const user = await User.findById(req.param("id"))
    if(!user) return res.status(404).json({error:"Not Found"})
    res.status(200).json(user)
  } catch (error) {
    
  }
}