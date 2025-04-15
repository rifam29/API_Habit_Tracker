const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await db.query("SELECT * FROM user_streak WHERE user_id = $1", [user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Streak untuk user ini belum ada" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    const { user_id, global_streak = 0, top_streak = 0 } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO user_streak (user_id, total_streak, longest_streak)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [user_id, global_streak, top_streak]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { global_streak, top_streak } = req.body;

    try {
        const result = await db.query(
            `UPDATE user_streak SET
                total_streak = $1,
                longest_streak = $2,
                updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $3
             RETURNING *`,
            [global_streak, top_streak, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Streak untuk user ini tidak ditemukan" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;