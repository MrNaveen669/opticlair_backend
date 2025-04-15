
const express = require("express");
const { connection } = require("./Configs/db");
const { userRouter } = require("./routes/user.routes");
const { productRouter } = require("./routes/product.routes");
const { cartRouter } = require("./routes/cart.routes");
const { sampleProductRouter } = require("./routes/sampleProduct.routes"); // Import sample product route

require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome Home Page");
});

// ✅ Prefix all API routes with /api
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sampleproduct", sampleProductRouter);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to the DB");
    } catch (err) {
        console.log("Trouble connecting to the DB", err);
    }
    console.log(`Running at ${process.env.port} Port`);
});
