// const express = require("express");
// const { userModel } = require("../Models/user.model");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const userRouter = express.Router();

// userRouter.get("/", async (req, res) => {
//   let query = req.query;
//   try {
//     const users = await userModel.find(query);
//     res.status(200).send(users);
//   } catch (error) {
//     console.log(err);
//     res.status(500).send({ err: "Something went wrong" });
//   }
// });

// userRouter.post("/register", async (req, res) => {
//   const { email, password, first_name, last_name, ph_no } = req.body;
//   try {
//     bcrypt.hash(password, 5, async (err, secure_password) => {
//       if (err) {
//         console.log(err);
//       } else {
//         const user = new userModel({
//           first_name,
//           last_name,
//           ph_no,
//           email,
//           password: secure_password,
//         });
//         await user.save();
//         res.send("Registered");
//       }
//     });
//   } catch (err) {
//     res.send("Error in registering the user");
//     console.log(err);
//   }
// });

// userRouter.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "masai");
//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         isAdmin: user.isAdmin
//       }
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// });

// // Admin login route
// userRouter.post("/admin/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await userModel.findOne({ email: username });
    
//     if (!user || !user.isAdmin) {
//       return res.status(401).json({ success: false, message: "Invalid admin credentials" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "Invalid admin credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "masai");
//     res.json({
//       success: true,
//       message: "Admin login successful",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         isAdmin: user.isAdmin
//       }
//     });
//   } catch (err) {
//     console.error("Admin login error:", err);
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// });

// module.exports = {
//   userRouter,
// };
const express = require("express");
const { userModel } = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    // Check if admin exists
    const adminExists = await userModel.findOne({ email: "admin@opticlair.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin@123", 5);
      const adminUser = new userModel({
        first_name: "Admin",
        last_name: "User",
        email: "admin@opticlair.com",
        password: hashedPassword,
        isAdmin: true
      });
      await adminUser.save();
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Create admin user when server starts
createAdminUser();

// Admin login route
userRouter.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ email: username });

    if (!user || !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    // Create and send JWT token - FIXED: Using consistent field names
    const token = jwt.sign(
      { 
        userID: user._id,  // Changed from userId to userID for consistency
        id: user._id,      // Added id field for compatibility
        isAdmin: true 
      },
      process.env.JWT_SECRET || "masai",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.first_name + " " + user.last_name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

userRouter.get("/", async (req, res) => {
  let query = req.query;
  try {
    const users = await userModel.find(query);
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: "Something went wrong" });
  }
});

userRouter.post("/register", async (req, res) => {
  const { email, password, first_name, last_name, ph_no } = req.body;
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = new userModel({
      first_name,
      last_name,
      ph_no,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error in registering the user"
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Create JWT token with consistent structure
    const token = jwt.sign(
      { 
        userID: user._id,  // Keep userID for consistency with existing code
        id: user._id       // Add id field for compatibility
      }, 
      process.env.JWT_SECRET || "masai",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.ph_no,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
});

module.exports = {
  userRouter,
};