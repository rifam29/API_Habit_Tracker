const express = require("express");
const router = express.Router();
const db = require("../db");

// GET semua habit
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM main_habit");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET habit berdasarkan user_id
router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const { rows } = await db.query("SELECT * FROM main_habit WHERE user_id = $1", [user_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT untuk update habit
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, name, icon, goal, current, unit, streak, color, is_main } = req.body;

    try {
        const result = await db.query(
            `UPDATE main_habit SET
                name = $1,
                icon = $2,
                goal = $3,
                current = $4,
                unit = $5,
                streak = $6,
                color = $7,
                is_main = $8
             WHERE id = $9 AND user_id = $10
             RETURNING *`,
            [name, icon, goal, current, unit, streak, color, is_main, id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Main habit tidak ditemukan atau tidak dimiliki oleh user' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Gagal mengupdate main habit' });
    }
});

module.exports = router;