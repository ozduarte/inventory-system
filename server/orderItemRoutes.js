import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// GET all items associated with an order
router.get("/:orderId", async (req, res) => {
    const { orderId } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                oi.id,
                oi.order_id AS "orderId",
                oi.inventory_item_id AS "inventoryItemId",
                ii.name AS "itemName",
                oi.quantity,
                ii.unit,
                oi.unit_cost AS "unitCost",
                (
                    oi.quantity * COALESCE(oi.unit_cost, 0)
                ) AS "lineTotal"
            FROM order_items oi
            JOIN inventory_items ii
                ON oi.inventory_item_id = ii.id
            WHERE oi.order_id = $1
            ORDER BY oi.id`,
            [orderId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching order items:", error);
        res.status(500).json({
            error: "Failed to retrieve order items."
        });
    }
});

// POST a new item to an order
router.post("/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const { inventoryItemId, quantity, unitCost } = req.body;

    if (
        !Number.isInteger(Number(orderId)) ||
        Number(orderId) <= 0 ||
        !Number.isInteger(Number(inventoryItemId)) ||
        Number(inventoryItemId) <= 0 ||
        !Number.isFinite(Number(quantity)) ||
        Number(quantity) <= 0 ||
        (
            unitCost !== undefined &&
            unitCost !== null &&
            (
                !Number.isFinite(Number(unitCost)) ||
                Number(unitCost) < 0
            )
        )
    ) {
        return res.status(400).json({
            error: "Please provide valid order, inventory item, quantity, and cost values."
        });
    }

    try {
        const orderResult = await pool.query(
            `SELECT status, inventory_updated
            FROM orders
            WHERE id = $1`,
            [Number(orderId)]
        );

        if (orderResult.rowCount === 0) {
            return res.status(404).json({
                error: "Order not found."
            });
        }

        if (
            orderResult.rows[0].status === "Delivered" ||
            orderResult.rows[0].inventory_updated
        ) {
            return res.status(400).json({
                error: "Items cannot be added to a delivered order."
            });
        }

        const result = await pool.query(
            `INSERT INTO order_items
                (order_id, inventory_item_id, quantity, unit_cost)
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                order_id AS "orderId",
                inventory_item_id AS "inventoryItemId",
                quantity,
                unit_cost AS "unitCost"`,
            [
                Number(orderId),
                Number(inventoryItemId),
                Number(quantity),
                unitCost === undefined || unitCost === null
                    ? null
                    : Number(unitCost)
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding order item:", error);

        if (error.code === "23503") {
            return res.status(400).json({
                error: "The specified order or inventory item does not exist."
            });
        }

        res.status(500).json({
            error: "Failed to add item to order."
        });
    }
});

// DELETE an inventory item from an order
router.delete("/:orderId/:itemId", async (req, res) => {
    const { orderId, itemId } = req.params;

    if (
        !Number.isInteger(Number(orderId)) ||
        Number(orderId) <= 0 ||
        !Number.isInteger(Number(itemId)) ||
        Number(itemId) <= 0
    ) {
        return res.status(400).json({
            error: "Invalid order ID or item ID.",
        });
    }

    try {
        const orderResult = await pool.query(
            `SELECT status, inventory_updated
            FROM orders
            WHERE id = $1`,
            [orderId]
        );

        if (orderResult.rowCount === 0) {
            return res.status(404).json({
                error: "Order not found."
            });
        }

        if (
            orderResult.rows[0].status === "Delivered" ||
            orderResult.rows[0].inventory_updated
        ) {
            return res.status(400).json({
                error: "Items cannot be removed from a delivered order."
            });
        }

        const result = await pool.query(
            `DELETE FROM order_items
            WHERE order_id = $1 AND id = $2
            RETURNING id`,
            [orderId, itemId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Order item not found."
            });
        }

        return res.status(200).json({
            message: "Order item removed successfully."
        });

    } catch (error) {
        console.error("Error removing order item:", error);

        return res.status(500).json({
            error: "Failed to remove order item."
        });
    }
});

// PUT update an inventory item's details in an order
router.put("/:orderId/:itemId", async (req, res) => {
    const { orderId, itemId } = req.params;
    const { quantity, unitCost } = req.body;

    const parsedOrderId = Number(orderId);
    const parsedItemId = Number(itemId);
    const parsedQuantity = Number(quantity);

    const parsedUnitCost =
        unitCost === null || unitCost === ""
            ? null
            : Number(unitCost);

    if (
        !Number.isInteger(parsedOrderId) ||
        parsedOrderId <= 0 ||
        !Number.isInteger(parsedItemId) ||
        parsedItemId <= 0
    ) {
        return res.status(400).json({
            error: "Invalid order ID or item ID."
        });
    }

    if (
        !Number.isFinite(parsedQuantity) ||
        parsedQuantity <= 0 ||
        (
            parsedUnitCost !== null &&
            (!Number.isFinite(parsedUnitCost) || parsedUnitCost < 0)
        )
    ) {
        return res.status(400).json({
            error: "Please provide a valid quantity and unit cost."
        });
    }

    try {
        const orderResult = await pool.query(
            `SELECT status, inventory_updated
            FROM orders
            WHERE id = $1`,
            [parsedOrderId]
        );

        if (orderResult.rowCount === 0) {
            return res.status(404).json({
                error: "Order not found."
            });
        }

        if (
            orderResult.rows[0].status === "Delivered" ||
            orderResult.rows[0].inventory_updated
        ) {
            return res.status(400).json({
                error: "Items cannot be edited in a delivered order."
            });
        }

        const result = await pool.query(
            `UPDATE order_items
            SET quantity = $1,
                unit_cost = $2
            WHERE order_id = $3 AND id = $4
            RETURNING id`,
            [
                parsedQuantity,
                parsedUnitCost,
                parsedOrderId,
                parsedItemId
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Order item not found."
            });
        }

        return res.status(200).json({
            message: "Order item updated successfully."
        });
    } catch (error) {
        console.error("Error updating order item:", error);

        return res.status(500).json({
            error: "Failed to update order item."
        });
    }
});

export default router;