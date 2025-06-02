import CampaignModel from "../models/CampaignModel.js";
import CommunicationLogModel from "../models/CommunicationLogModel.js";
import CustomerModel from "../models/CustomerModel.js";
import parseRuleToMongo from "../utils/queryParser.js"
import redisClient from "../services/redisClient.js"

// Create new campaign
export const createCampaign = async (req, res) => {
  try {
    const { name, ruleOperator, rules } = req.body;

    if (!name || !ruleOperator || !rules ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const mongoQuery = parseRuleToMongo({ rules, ruleOperator });

    const customers = await CustomerModel.find(mongoQuery).select("name email"); 
    const audienceSize = customers.length;

    const campaign = await CampaignModel.create({
      name,
      ruleOperator,
      rules,
      audienceSize,
    });

    await redisClient.publish('campaign.created', JSON.stringify({
        campaignId: campaign._id,
        query: mongoQuery
    }));

    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating campaign" });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignModel.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching campaigns" });
  }
};

// Get a specific campaign with delivery stats
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await CampaignModel.findById(id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const [sentCount, failedCount, recentLogs] = await Promise.all([
      CommunicationLogModel.countDocuments({ campaignId: id, status: "SENT" }),
      CommunicationLogModel.countDocuments({ campaignId: id, status: "FAILED" }),
      CommunicationLogModel.find({ campaignId: id }).sort({ timestamp: -1 }).limit(5),
    ]);

    const customerIds = recentLogs.map(log => log.customerId);
    const customers = await CustomerModel.find({ _id: { $in: customerIds } });
    const customerMap = new Map(customers.map(c => [c._id.toString(), c]));

    const deliveryStatus = recentLogs.map(log => {
      const customer = customerMap.get(log.customerId.toString());
      return {
        name: customer?.name || "Unknown",
        email: log.email || "N/A",
        status: log.status,
        timestamp: log.timestamp,
      };
    });

    res.status(200).json({
      campaign,
      stats: { sent: sentCount, failed: failedCount },
      deliveryStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching campaign" });
  }
};


export const getCampaignLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await CommunicationLogModel.find({ campaignId: id }).sort({ timestamp: -1 });

    const customerIds = logs.map(log => log.customerId);
    const customers = await CustomerModel.find({ _id: { $in: customerIds } });
    const customerMap = new Map(customers.map(c => [c._id.toString(), c]));

    const enrichedLogs = logs.map(log => {
      const customer = customerMap.get(log.customerId.toString());
      return {
        name: customer?.name || "Unknown",
        email: log.email || "N/A",
        status: log.status,
        timestamp: log.timestamp,
        channel: log.channel,
      };
    });

    res.status(200).json({ logs: enrichedLogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching logs for campaign" });
  }
};
