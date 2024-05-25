const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      phone_number,
      role,
      password,
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "Username or email already in use" });
    }

    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      phone_number,
      role,
      password,
    });

    if (password) {
      // Hash the password using bcrypt or similar library
      newUser.password = await bcrypt.hash(password, 10);
    }

    const savedUser = await newUser.save();
    console.log(savedUser);

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    }); // 6 hour expiry

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        firstName: savedUser.first_name,
        lastName: savedUser.last_name,
        email: savedUser.email,
        phoneNumber: savedUser.phone_number,
        role: savedUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Assuming you're hashing passwords
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    }); // 6 hour expiry

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
