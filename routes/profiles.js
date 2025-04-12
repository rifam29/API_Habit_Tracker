const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query("SELECT * FROM profiles WHERE id = $1", [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    const { user_id, username, avatar_url } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO profiles (id, username, avatar_url, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
            [user_id, username, avatar_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, avatar_url } = req.body;

    try {
        const result = await db.query(
            `UPDATE profiles
             SET username = $1, avatar_url = $2, created_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [username, avatar_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
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
            `DELETE FROM profiles WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ message: "Profile deleted", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;