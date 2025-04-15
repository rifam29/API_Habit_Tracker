const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM main_habit");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { rows } = await db.query("SELECT * FROM main_habit WHERE user_id = $1", [user_id]);
    res.json(rows);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, name, icon, progress, goal, unit, stream, color, is_main } = req.body;

    try {
        const result = await pool.query(
            `UPDATE main_habit SET
          name = $1,
          icon = $2,
          progress = $3,
          goal = $4,
          unit = $5,
          stream = $6,
          color = $7,
          is_main = $8
        WHERE id = $9 AND user_id = $10
        RETURNING *`,
            [name, icon, progress, goal, unit, stream, color, is_main, id, user_id]
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