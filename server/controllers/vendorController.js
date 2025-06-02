import CommunicationLogModel from '../models/CommunicationLogModel.js';

export const handleVendorReceipt = async (req, res) => {
    try {
      const { campaignId, customerId, email, status } = req.body;
  
      // Find the log and update its status
      const log = await CommunicationLogModel.findOneAndUpdate(
        { campaignId, customerId, email },
        { status, deliveredAt: new Date() },
        { new: true }
      );
  
      if (!log) {
        return res.status(404).json({ message: 'Log not found' });
      }
  
      res.status(200).json({ message: 'Receipt logged', log });
    } catch (err) {
      console.error('❌ Error saving vendor receipt:', err.message);
      res.status(500).json({ message: 'Failed to log receipt' });
    }
};
  
