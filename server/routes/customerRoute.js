import express from "express";
import { createCustomer } from "../controllers/customerController.js";

const customerRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         visits:
 *           type: number
 *         totalSpend:
 *           type: number
 *         orderCount:
 *           type: number
 *         lastOrderDate:
 *           type: string
 *           format: date
 *         category:
 *           type: string
 *         loyaltyMember:
 *           type: boolean
 *         abandonedCart:
 *           type: boolean
 *         cartValue:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 */
customerRouter.post("/", createCustomer);

export default customerRouter;
