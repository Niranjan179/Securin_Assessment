const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const connectDB = require("./config/db");
const cveRoutes = require("./Routes/cveRoutes");
const mongoose=require('mongoose');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
    try {
      const dbURI = "mongodb+srv://admin:admin@cluster0.uqiok1v.mongodb.net/cvedb"; // Replace with your MongoDB URI
      await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1); // Exit process with failure
    }
  };
connectDB();

// Routes
app.use("/cves", cveRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
