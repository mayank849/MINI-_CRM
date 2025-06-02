import express from "express";
import { createOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerId
 *         - amount
 *       properties:
 *         customerId:
 *           type: string
 *           description: MongoDB ObjectId of the customer
 *         amount:
 *           type: number
 *         orderDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 */
orderRouter.post("/", createOrder);

export default orderRouter;
