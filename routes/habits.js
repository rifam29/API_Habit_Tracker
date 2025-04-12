const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM habits");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { rows } = await db.query("SELECT * FROM habits WHERE user_id = $1", [user_id]);
    res.json(rows);
});

router.post("/", async (req, res) => {
    const { user_id, name, category, target, unit, color, icon } = req.body;
    const result = await db.query(
        `INSERT INTO habits (user_id, name, category, target, unit, progress, streak, color, icon, created_at, last_updated)
     VALUES ($1, $2, $3, $4, $5, 0, 0, $6, $7, NOW(), NOW()) RETURNING *`,
        [user_id, name, category, target, unit, color, icon]
    );
    res.status(201).json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, category, target, unit, color, icon } = req.body;

    try {
        const result = await db.query(
            `UPDATE habits 
         SET name = $1, category = $2, target = $3, unit = $4, color = $5, icon = $6, last_updated = NOW()
         WHERE id = $7 RETURNING *`,
            [name, category, target, unit, color, icon, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habit not found" });
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
            "DELETE FROM habits WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json({ message: "Habit deleted", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;