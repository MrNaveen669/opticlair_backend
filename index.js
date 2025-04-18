
const express = require("express");
const path = require("path");
const { connection } = require("./Configs/db");
const { userRouter } = require("./routes/user.routes");
const { cartRouter } = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const { sampleProductRouter } = require("./routes/sampleProduct.routes");

require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// API ROUTES
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/sampleproduct", sampleProductRouter);
app.use("/wishlist", wishlistRoutes);

// ✅ Serve static files from React frontend build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// ✅ For any unknown route, serve React index.html (for React Router support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

//access admin 
app.use("/admin", express.static(path.join(__dirname, "../admin/build")));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/build", "index.html"));
});

// START SERVER
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("✅ Connected to the DB");
  } catch (err) {
    console.error("❌ Trouble connecting to the DB", err);
  }
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
