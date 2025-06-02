import express from "express"

import previewSegment from "../controllers/previewSegmentController.js"

const preview = express.Router();
preview.post("/preview", previewSegment)

export default preview