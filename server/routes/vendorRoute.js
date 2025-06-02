import express from 'express';
import { handleVendorReceipt } from '../controllers/vendorController.js';

const vendorRouter = express.Router();

vendorRouter.post('/receipt', handleVendorReceipt);

export default vendorRouter;
