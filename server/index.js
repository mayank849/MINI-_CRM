import express from 'express'
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

import customerRouter from './routes/customerRoute.js';
import orderRouter from './routes/orderRoute.js';
import preview from './routes/previewSegmentRouter.js';
import campaignRouter from "./routes/campaignRoute.js"
import vendorRouter from "./routes/vendorRoute.js"
import mockVendorRouter from "./routes/mockVendorRoute.js"
import dashboardStatsRouter from './routes/dashboardStatsRoute.js';
import { setupSwagger } from "./docs/swagger.js";

dotenv.config();
const app = express();

app.use(express.json()); 

setupSwagger(app); 

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);


app.use("/api/customers", customerRouter)
app.use("/api/orders", orderRouter)
app.use("/api/campaigns", preview)
app.use("/api/newcampaign",campaignRouter)
app.use("/api/vendor", vendorRouter) // for receipt 
app.use("/api/vendor", mockVendorRouter) // for sending
app.use("/api", dashboardStatsRouter)

app.get("/", (req, res) => {
    res.send({ success: true, message: "server up!" });
});

//DATABASE CONNECTION
mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `App listening on port http://localhost:${process.env.PORT}/ -> db connected.`
      );
      console.log(`Swagger docs at http://localhost:${process.env.PORT}/api-docs`)
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed!!!", err);
});



