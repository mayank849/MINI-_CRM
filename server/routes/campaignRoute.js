import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  getCampaignLogs,
} from "../controllers/campaignController.js";

const campaignRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CampaignRule:
 *       type: object
 *       required:
 *         - key
 *         - operator
 *         - value
 *       properties:
 *         key:
 *           type: string
 *           example: visits
 *         operator:
 *           type: string
 *           example: >
 *         value:
 *           oneOf:
 *             - type: string
 *             - type: number
 *           example: 3
 *
 *     Campaign:
 *       type: object
 *       required:
 *         - name
 *         - ruleOperator
 *         - rules
 *       properties:
 *         name:
 *           type: string
 *           example: "VIP Customers Campaign"
 *         ruleOperator:
 *           type: string
 *           enum: [AND, OR]
 *           example: AND
 *         rules:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CampaignRule'

 *         audienceSize:
 *           type: number
 *           example: 42
 */

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error creating campaign
 */
campaignRouter.post("/", createCampaign);

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: List of campaigns
 *       500:
 *         description: Error fetching campaigns
 */
campaignRouter.get("/", getAllCampaigns);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get campaign details and delivery stats
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign details with stats
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Error fetching campaign
 */
campaignRouter.get("/:id", getCampaignById);

/**
 * @swagger
 * /api/campaigns/{id}/logs:
 *   get:
 *     summary: Get communication logs for a campaign
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Communication logs with customer info
 *       500:
 *         description: Error fetching logs
 */
campaignRouter.get("/:id/logs", getCampaignLogs);

export default campaignRouter;
