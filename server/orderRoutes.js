import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                o.id,
                o.order_number AS "orderNumber",
                o.supplier,
                o.status,
                o.order_date AS "orderDate",
                COALESCE(
                    (
                        SELECT SUM(oi.quantity * COALESCE(oi.unit_cost, 0))
                        FROM order_items oi
                        WHERE oi.order_id = o.id
                    ),
                    0
                ) AS "orderTotal"
            FROM orders o
            ORDER BY o.order_date DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Could not retrieve orders."
        });
    }
});

// POST create an order
router.post("/", async (req, res) => {
    const { orderNumber, supplier, status } = req.body;

    const validStatuses = ["Requested", "Ordered", "Delivered"];

    if (
        !orderNumber?.trim() ||
        !supplier?.trim() ||
        !validStatuses.includes(status || "Requested")
    ) {
        return res.status(400).json({
            error: "Please provide a valid order number, supplier, and status."
        });
    }

    try {
        const result = await pool.query(`
            INSERT INTO orders (order_number, supplier, status)
            VALUES ($1, $2, $3)
            RETURNING
                id,
                order_number AS "orderNumber",
                supplier,
                status,
                order_date AS "orderDate",
                0 AS "orderTotal"
        `, [
            orderNumber.trim(),
            supplier.trim(),
            status || "Requested"
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "That order number already exists."
            });
        }

        res.status(500).json({
            error: "Could not create order."
        });
    }
});

// PUT update an order

// PUT update an order and process inventory when delivered
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { orderNumber, supplier, status } = req.body;

    const validStatuses = ["Requested", "Ordered", "Delivered"];

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: "Invalid order ID."
        });
    }

    if (status !== undefined && !validStatuses.includes(status)) {
        return res.status(400).json({
            error: "Invalid order status."
        });
    }

    if (
        (orderNumber !== undefined &&
            (typeof orderNumber !== "string" || !orderNumber.trim())) ||
        (supplier !== undefined &&
            (typeof supplier !== "string" || !supplier.trim()))
    ) {
        return res.status(400).json({
            error: "Order number and supplier cannot be empty."
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Lock the order so it cannot be processed twice simultaneously
        const orderResult = await client.query(
            `SELECT id, inventory_updated
             FROM orders
             WHERE id = $1
             FOR UPDATE`,
            [id]
        );

        if (orderResult.rowCount === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                error: "Order not found."
            });
        }

        const alreadyUpdated = orderResult.rows[0].inventory_updated;

        // Update the order details
        const result = await client.query(`
            UPDATE orders
            SET
                order_number = COALESCE($1, order_number),
                supplier = COALESCE($2, supplier),
                status = COALESCE($3, status)
            WHERE id = $4
            RETURNING
                id,
                order_number AS "orderNumber",
                supplier,
                status,
                order_date AS "orderDate"
        `, [
            orderNumber !== undefined ? orderNumber.trim() : null,
            supplier !== undefined ? supplier.trim() : null,
            status !== undefined ? status : null,
            id
        ]);

        // Process inventory only when the order is first marked Delivered
        if (
            status === "Delivered" &&
            !alreadyUpdated
        ) {
            const orderItemsResult = await client.query(
                `SELECT inventory_item_id, quantity
                 FROM order_items
                 WHERE order_id = $1`,
                [id]
            );

            for (const item of orderItemsResult.rows) {
                await client.query(
                    `UPDATE inventory_items
                     SET quantity = quantity + $1,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = $2`,
                    [item.quantity, item.inventory_item_id]
                );
            }

            // Mark the order as processed
            await client.query(
                `UPDATE orders
                 SET inventory_updated = TRUE
                 WHERE id = $1`,
                [id]
            );
        }

        // Calculate the current order total
        const totalResult = await client.query(
            `SELECT COALESCE(
                SUM(quantity * COALESCE(unit_cost, 0)),
                0
             ) AS "orderTotal"
             FROM order_items
             WHERE order_id = $1`,
            [id]
        );

        await client.query("COMMIT");

        res.json({
            ...result.rows[0],
            orderTotal: totalResult.rows[0].orderTotal
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Error updating order:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "That order number already exists."
            });
        }

        res.status(500).json({
            error: "Could not update order."
        });
    } finally {
        client.release();
    }
});


// DELETE an order
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: "Invalid order ID."
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM orders
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Order not found."
            });
        }

        res.status(204).end();
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Could not delete order."
        });
    }
});

export default router;