const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, username, avatar_url, email, created_at FROM profiles"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            "SELECT id, username, avatar_url, email, created_at FROM profiles WHERE id = $1",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    const { username, avatar_url, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO profiles (username, avatar_url, email, password, created_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id, username, avatar_url, email, created_at`,
            [username, avatar_url, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, avatar_url, email, password } = req.body;

    try {
        let updateQuery = `UPDATE profiles SET`;
        const fields = [];
        const values = [];
        let index = 1;

        if (username) {
            fields.push(`username = $${index++}`);
            values.push(username);
        }

        if (avatar_url) {
            fields.push(`avatar_url = $${index++}`);
            values.push(avatar_url);
        }

        if (email) {
            fields.push(`email = $${index++}`);
            values.push(email);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push(`password = $${index++}`);
            values.push(hashedPassword);
        }

        fields.push(`created_at = NOW()`);

        updateQuery += " " + fields.join(", ") + ` WHERE id = $${index} RETURNING id, username, avatar_url, email, created_at`;
        values.push(id);

        const result = await db.query(updateQuery, values);

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
            `DELETE FROM profiles WHERE id = $1 RETURNING id, username, avatar_url, email, created_at`,
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