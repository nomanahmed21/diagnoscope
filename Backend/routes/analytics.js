const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const mongoose = require("mongoose");

const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes

router.get("/user", async (req, res) => {
  try {
    const { userId, testName, limit = 10 } = req.query;

    if (!userId || !testName) {
      return res.status(400).json({ error: "Missing userId or testName" });
    }

    // Create a unique cache key
    const cacheKey = `analytics_${userId}_${testName}_${limit}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Serving Data From Cache");
      return res.json(cachedData);
    }

    console.log("Fetching Data From DB");

    const collection = mongoose.connection.db.collection("reports");

    const query = { userId, testname: testName };

    // Fetch last `limit` reports sorted by timestamp
    const data = await collection
      .find(query)
      .sort({ timestamp: -1 }) // latest first
      .limit(parseInt(limit))
      .toArray();

    // Save to cache
    cache.set(cacheKey, data);

    res.json(data);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/clear", async (req, res) => {
  try {
    const keys = cache.keys()

    const analyticsKeys = keys.filter((key) => key.startsWith("analytics_"));

    if (analyticsKeys.length === 0) {
      return res.status(404).json({ message: "No analytics cache found" });
    }

    cache.del(analyticsKeys)

    console.log("Cleared analytics cache:", analyticsKeys);

    res.json({
      message: "Analytics cache cleared successfully",
      clearedKeys: analyticsKeys,
    });
  } catch (error) {
    console.error("Error clearing analytics cache:", error);
    res.status(500).json({ error: "Failed to clear analytics cache" });
  }
})


module.exports = router;
