import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// Format database records for React
const itemColumns = `
    id,
    name,
    category,
    quantity::float8 AS quantity,
    unit,
    threshold::float8 AS threshold,
    location,
    expiration_date AS "expirationDate",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
`;

// GET: Retrieve all inventory items
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ${itemColumns}
             FROM inventory_items
             ORDER BY name ASC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not retrieve inventory."
        });
    }
});

// POST: Add a new inventory item
router.post("/", async (req, res) => {
    const {
        name,
        category,
        quantity,
        unit,
        threshold,
        location,
        expirationDate,
        expiration
    } = req.body;

    const expirationValue = expirationDate || expiration || null;

    if (
        !name?.trim() ||
        !category ||
        !unit ||
        !location ||
        quantity === "" ||
        quantity === null ||
        quantity === undefined ||
        threshold === "" ||
        threshold === null ||
        threshold === undefined ||
        !Number.isFinite(Number(quantity)) ||
        !Number.isFinite(Number(threshold)) ||
        Number(quantity) < 0 ||
        Number(threshold) < 0
    ) {
        return res.status(400).json({
            error: "Please provide valid inventory information."
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO inventory_items
             (name, category, quantity, unit, threshold, location, expiration_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING ${itemColumns}`,
            [
                name.trim(),
                category,
                Number(quantity),
                unit,
                Number(threshold),
                location,
                expirationValue
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not add inventory item."
        });
    }
});

// PUT: Update an existing inventory item
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const {
        name,
        category,
        quantity,
        unit,
        threshold,
        location,
        expirationDate,
        expiration
    } = req.body;

    const expirationValue = expirationDate || expiration || null;

    if (
        !Number.isInteger(id) ||
        id < 1 ||
        !name?.trim() ||
        !category ||
        !unit ||
        !location ||
        quantity === "" ||
        quantity === null ||
        quantity === undefined ||
        threshold === "" ||
        threshold === null ||
        threshold === undefined ||
        !Number.isFinite(Number(quantity)) ||
        !Number.isFinite(Number(threshold)) ||
        Number(quantity) < 0 ||
        Number(threshold) < 0
    ) {
        return res.status(400).json({
            error: "Please provide valid inventory information."
        });
    }

    try {
        const result = await pool.query(
            `UPDATE inventory_items
             SET name = $1,
                 category = $2,
                 quantity = $3,
                 unit = $4,
                 threshold = $5,
                 location = $6,
                 expiration_date = $7,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             RETURNING ${itemColumns}`,
            [
                name.trim(),
                category,
                Number(quantity),
                unit,
                Number(threshold),
                location,
                expirationValue,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Inventory item not found."
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not update inventory item."
        });
    }
});

// DELETE: Remove an inventory item
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: "Invalid inventory item ID."
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM inventory_items
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Inventory item not found."
            });
        }

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not delete inventory item."
        });
    }
});

export default router;