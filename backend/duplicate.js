const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Setup
const MONGO_URI = "mongodb://localhost:27017"; // Change this if using a cloud MongoDB
const DATABASE_NAME = "cve_db";
const COLLECTION_NAME = "cve_data";

let db;
let collection;

// Initialize MongoDB Connection
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(DATABASE_NAME);
    collection = db.collection(COLLECTION_NAME);

    // Ensure Unique Index on cve_id
    collection.createIndex({ cve_id: 1 }, { unique: true });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Fetch CVE Data from API
const API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

async function fetchCVEData(startIndex = 0, resultsPerPage = 100) {
  try {
    const response = await axios.get(API_URL, {
      params: { startIndex, resultsPerPage },
    });
    return response.data.vulnerabilities || [];
  } catch (error) {
    console.error("Error fetching CVE data:", error.message);
    return [];
  }
}

// Store Data in MongoDB
async function storeCVEData(cveList) {
  try {
    const bulkOps = cveList.map((cve) => ({
      updateOne: {
        filter: { cve_id: cve.cve.id },
        update: {
          $set: {
            cve_id: cve.cve.id,
            description: cve.cve.descriptions[0]?.value || "No description",
            base_score: cve.metrics?.cvssMetricV2?.cvssData?.baseScore || 0,
            last_modified: cve.cve.lastModified,
          },
        },
        upsert: true, // Insert if not exists
      },
    }));
    await collection.bulkWrite(bulkOps);
    console.log("Data stored successfully.");
  } catch (error) {
    console.error("Error storing data in MongoDB:", error.message);
  }
}

// Sync Data Periodically
async function syncData() {
  console.log("Synchronizing data...");
  const cveData = await fetchCVEData(0, 100);
  await storeCVEData(cveData);
  console.log("Data synchronization complete.");
}

// Sync data on startup
syncData();

// API to Retrieve Data
app.get("/list", async (req, res) => {
  const { cve_id, year, score, days } = req.query;

  const filter = {};

  if (cve_id) {
    filter.cve_id = cve_id;
  }
  if (year) {
    filter.last_modified = {
      $regex: `^${year}`, // Matches the year at the start of the last_modified string
    };
  }
  if (score) {
    filter.base_score = parseFloat(score);
  }
  if (days) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days, 10));
    filter.last_modified = {
      $gte: dateLimit.toISOString(),
    };
  }

  try {
    const results = await collection.find(filter).toArray();
    res.json(results);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});