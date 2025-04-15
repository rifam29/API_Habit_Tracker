const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM habit_logs");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get("/:habit_id", async (req, res) => {
    const { habit_id } = req.params;
    const { rows } = await db.query("SELECT * FROM habit_logs WHERE habit_id = $1", [habit_id]);
    res.json(rows);
});

router.post("/", async (req, res) => {
    const { habit_id, user_id, date, value } = req.body;
    const result = await db.query(
        `INSERT INTO habit_logs (habit_id, user_id, date, value, created_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [habit_id, user_id, date, value]
    );
    res.status(201).json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { value, date } = req.body;

    try {
        const result = await db.query(
            `UPDATE habit_logs 
         SET value = $1, date = $2, created_at = NOW() 
         WHERE id = $3 RETURNING *`,
            [value, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Log not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            "DELETE FROM habit_logs WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Log not found" });
        }

        res.json({ message: "Log deleted", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;