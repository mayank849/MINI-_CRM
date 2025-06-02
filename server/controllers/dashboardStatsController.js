import CampaignModel from "../models/CampaignModel.js";
import CommunicationLogModel from "../models/CommunicationLogModel.js";
import moment from "moment";

// GET /api/dashboard
export const getCampaignDashboardStats = async (req, res) => {
  try {
    // Timeframes
    const now = moment();
    const startOfThisMonth = now.clone().startOf("month").toDate();
    const startOfLastMonth = now.clone().subtract(1, "month").startOf("month").toDate();
    const endOfLastMonth = now.clone().startOf("month").toDate();

    // Total counts
    const totalCampaigns = await CampaignModel.countDocuments();
    const audienceReached = await CampaignModel.aggregate([
      {
        $group: {
          _id: null,
          totalAudience: { $sum: "$audienceSize" },
        },
      },
    ]);

    const totalSent = await CommunicationLogModel.countDocuments({ status: "SENT" });
    const totalFailed = await CommunicationLogModel.countDocuments({ status: "FAILED" });

    // Monthly comparisons
    const lastMonthCampaigns = await CampaignModel.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
    });

    const thisMonthCampaigns = await CampaignModel.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonthSent = await CommunicationLogModel.countDocuments({
      status: "SENT",
      timestamp: { $gte: startOfLastMonth, $lt: endOfLastMonth },
    });

    const thisMonthSent = await CommunicationLogModel.countDocuments({
      status: "SENT",
      timestamp: { $gte: startOfThisMonth },
    });

    const lastMonthFailed = await CommunicationLogModel.countDocuments({
      status: "FAILED",
      timestamp: { $gte: startOfLastMonth, $lt: endOfLastMonth },
    });

    const thisMonthFailed = await CommunicationLogModel.countDocuments({
      status: "FAILED",
      timestamp: { $gte: startOfThisMonth },
    });

    res.status(200).json({
      totalCampaigns,
      campaignChange: thisMonthCampaigns - lastMonthCampaigns,
      audienceReached: audienceReached[0]?.totalAudience || 0,
      audienceChange: "N/A", // Optional, you can implement later
      messagesSent: totalSent,
      sentChange: thisMonthSent - lastMonthSent,
      failedDeliveries: totalFailed,
      failedChange: thisMonthFailed - lastMonthFailed,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
