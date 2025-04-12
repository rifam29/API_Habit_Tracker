const express = require("express");
const cors = require("cors");
require("dotenv").config();

const habitsRouter = require("./routes/habits");
const logsRouter = require("./routes/logs");
const profilesRouter = require("./routes/profiles");

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/habits", habitsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/profiles", profilesRouter);

// Root route (simple health check)
app.get("/", (req, res) => {
    res.json({ message: "API is running!" });
});

// Port for Railway / local dev
const PORT = process.env.PORT || 3000;

// Listen
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ API ready at http://localhost:${PORT}`);
});