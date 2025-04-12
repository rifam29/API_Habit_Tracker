const express = require("express");
const cors = require("cors");
require("dotenv").config();

const habitsRouter = require("./routes/habits");
const logsRouter = require("./routes/logs");
const profilesRouter = require("./routes/profiles");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/habits", habitsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/profiles", profilesRouter);

app.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API ready at http://localhost:${PORT}`));