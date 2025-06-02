import { connect } from 'mongoose';
import redisClient from '../services/redisClient.js';
import CustomerModel from '../models/CustomerModel.js';
import CommunicationLogModel from '../models/CommunicationLogModel.js';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


redisClient.subscribe('campaign.created', async (message) => {
  try {
    const { campaignId, query } = JSON.parse(message);
    const customers = await CustomerModel.find(query);

    for (const customer of customers) {
      const deliveryMessage = `Hi ${customer.name}, check out our latest offer!`;

      const log = await CommunicationLogModel.create({
        campaignId,
        customerId: customer._id,
        email: customer.email,
        message: deliveryMessage,
        status: 'PENDING',
        timestamp: new Date()
      });

      // Simulate sending to vendor
      await axios.post('http://localhost:8000/api/vendor/send', {
        campaignId,
        customerId: customer._id,
        email: customer.email,
        message: deliveryMessage
      });
    }

    console.log(`📨 Campaign messages sent for campaignId: ${campaignId}`);
  } catch (err) {
    console.error('❌ Error in campaign worker:', err.message);
  }
});
