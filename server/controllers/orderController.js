import redisClient from '../services/redisClient.js';

export async function createOrder(req, res) {
  try {
    const { customerId, amount, orderDate, status } = req.body;

    // Basic validation
    if (!customerId || !amount ) {
      return res.status(400).json({ error: 'customerId, amount, and products are required.' });
    }

    const orderData = {
      customerId,
      amount,
      orderDate: orderDate || new Date().toISOString(),
      status: status || 'PENDING'
    };

    // Publish to Redis Stream
    await redisClient.xAdd(
      'stream:orders',
      '*',
      {
        data: JSON.stringify(orderData)
      }
    );

    return res.status(200).json({ message: 'Order data queued successfully.' });
  } catch (err) {
    console.error('Error in createOrder:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
