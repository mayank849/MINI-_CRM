import { connect } from 'mongoose';
import redisClient from '../services/redisClient.js';
import CustomerModel from '../models/CustomerModel.js';
import OrderModel from '../models/OrderModel.js';
import dotenv from "dotenv";
dotenv.config();

// MongoDB connect
connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected (Consumer Worker)'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Stream keys and last IDs
const STREAMS = {
  customers: { key: 'stream:customers', lastId: '0' },
  orders: { key: 'stream:orders', lastId: '0' }
};

async function listenStream(streamName, Model) {
  while (true) {
    try {
      const results = await redisClient.xRead(
        [{ key: STREAMS[streamName].key, id: STREAMS[streamName].lastId }],
        { BLOCK: 5000, COUNT: 10 }
      );

      if (!results) continue;

      for (const stream of results) {
        const messages = stream.messages || [];

        for (const msg of messages) {
          const { id, message } = msg;

          try {
            const data = JSON.parse(message.data);
            await Model.create(data);
            console.log(`✅ [${streamName}] Inserted document with ID: ${id}`);
          } catch (err) {
            console.error(`❌ MongoDB insert error in ${streamName}:`, err.message);
          }

          STREAMS[streamName].lastId = id;
        }
      }
    } catch (err) {
      console.error(`❌ Error reading from ${streamName}:`, err.message);
    }
  }
}

// Start consumers for both streams
listenStream('customers', CustomerModel);
listenStream('orders', OrderModel);
