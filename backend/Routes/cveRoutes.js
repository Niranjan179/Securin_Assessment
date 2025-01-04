const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CVE = require("../Models/cveSchema");
// const cveController = require("../controllers/cveController");

// This module defines routes to handle HTTP requests related to CVE (Common Vulnerabilities and Exposures) records.
// The data is stored in a MongoDB collection, and Mongoose is used as the ORM.

// Routes for CRUD operations on CVE entities
// Uncommented routes show how these could use a separate controller for cleaner code organization:
// router.get("/list", cveController.getCVEList); // Route to get a list of all CVEs
// router.get("/:id", cveController.getCVEById); // Route to get a specific CVE by ID
// router.post("/", cveController.createCVE); // Route to create a new CVE
// router.put("/:id", cveController.updateCVE); // Route to update an existing CVE
// router.delete("/:id", cveController.deleteCVE); // Route to delete a CVE by ID

// Route: GET /:id
// Fetches details of a specific CVE by its ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Extract the CVE ID from the request URL parameters.

  try {
    // Search the MongoDB collection for a CVE matching the given ID.
    const cve = await CVE.find({ 'cve.id': id });

    // If no matching CVE is found, return a 404 error response.
    if (!cve) {
      return res.status(404).json({ error: "CVE not found" });
    }

    // Return the CVE details in the response as JSON.
    res.json(cve);
  } catch (err) {
    console.error("Error fetching CVE by ID:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route: POST /list
// Handles filtering and fetching a list of CVEs based on query parameters.
router.post("/list", async (req, res) => {
  const { cve_id, year, score, days } = req.body; // Extract filter parameters from the request body.
  const filter = {}; // Initialize a filter object to store query criteria.

  // Apply filters based on the provided query parameters.
  if (cve_id) {
    filter['cve.id'] = cve_id; // Filter by CVE ID.
  }
  if (year) {
    filter['cve.lastModified'] = {
      $regex: `^${year}`, // Matches entries where `lastModified` starts with the given year.
    };
  }
  if (score) {
    filter['cve.metrics.cvssMetricV2.baseScore'] = parseFloat(score); // Filter by CVSS base score.
  }
  if (days) {
    // Calculate the date range for the "days" filter.
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days, 10)); // Subtract the given number of days from today's date.
    filter['cve.lastModified'] = {
      $gte: dateLimit.toISOString(), // Include CVEs modified within the calculated date range.
    };
  }

  try {
    // Query the MongoDB collection using the constructed filter object, limiting results to 100 records.
    const results = await CVE.find(filter).limit(100);

    // Return the filtered list of CVEs in the response as JSON.
    res.json(results);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err.message);
    res.status(500).json({ error: "Internal server error" }); // Return a 500 status code for server errors.
  }
});

module.exports = router; // Export the router so it can be used in the main application.
