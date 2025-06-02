import mongoose from "mongoose"

const CampaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    ruleOperator: { type: String, enum: ['AND', 'OR'], required: true }, 
    rules: [
      {
        key: { type: String, required: true },
        operator: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
      }
    ],
    audienceSize: { type: Number }
  });

const CampaignModel = mongoose.model('Campaign', CampaignSchema)
export default CampaignModel