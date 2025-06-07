const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ph_no: Number,
  isAdmin: { type: Boolean, default: false }
  
});



const userModel = mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
