const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")

router.post("/user", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!mongoose.connection.db) {
      return res.status(500).json({ error: "Database not connected" });
    }

    const collection = mongoose.connection.db.collection("reports");
    const reports = await collection.find({ userId }).toArray();

    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;