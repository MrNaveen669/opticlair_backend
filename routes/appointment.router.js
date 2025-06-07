const express = require("express");
const router = express.Router();
const Appointment = require("../Models/appointment.model");

// POST: Create new appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    // Return the saved appointment (not just message)
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all appointments sorted newest first
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

module.exports = router;
