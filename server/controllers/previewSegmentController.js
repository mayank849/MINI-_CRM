import parseRuleToMongo  from "../utils/queryParser.js";
import CustomerModel from "../models/CustomerModel.js";

const previewSegment = async (req, res) => {
  try {
    const { rules, ruleOperator } = req.body;

    const mongoQuery = parseRuleToMongo({ rules, ruleOperator });

    const customers = await CustomerModel.find(mongoQuery).select("name email"); 
    const audienceSize = customers.length;

    res.json({ audienceSize, customers });
  } catch (err) {
    console.error("Preview segment error:", err);
    res.status(500).json({ error: "Failed to preview segment" });
  }
};

export default previewSegment;
