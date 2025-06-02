import express from "express";
import { getCampaignDashboardStats } from "../controllers/dashboardStatsController.js";

const dashboardStatsRouter = express.Router();

dashboardStatsRouter.get("/dashboard", getCampaignDashboardStats);

export default dashboardStatsRouter;
