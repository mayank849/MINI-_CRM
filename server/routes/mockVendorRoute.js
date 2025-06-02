import express from 'express';
import axios from 'axios';

const mockVendorRouter = express.Router()
// Mock delivery endpoint
mockVendorRouter.post('/send', async (req, res) => {
  const { campaignId, customerId, email, message } = req.body;

  // Simulate delay
  setTimeout(async () => {
    const status = Math.random() > 0.2 ? 'SENT' : 'FAILED'; // 80% chance of SENT

    // Callback to receipt endpoint
    await axios.post('http://localhost:8000/api/vendor/receipt', {
      campaignId,
      customerId,
      email,
      status
    });
  }, 1000); // 1 second delay

  res.status(202).json({ message: 'Message is being processed' });
});

export default mockVendorRouter;
