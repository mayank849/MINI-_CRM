import mongoose from 'mongoose';

const CommunicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['SENT', 'FAILED', 'PENDING'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const CommunicationLogModel = mongoose.model('CommunicationLog', CommunicationLogSchema);
export default CommunicationLogModel
