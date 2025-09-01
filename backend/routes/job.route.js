import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  CreateJobController,
  DeleteJobController,
  GetDashboardStatsController,
  GetJobByIdController,
  GetJobsController,
  UpdateJobController,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/", authMiddleware, CreateJobController);
router.get("/", authMiddleware, GetJobsController);
router.get("/stats", authMiddleware, GetDashboardStatsController);
router.get("/:id", authMiddleware, GetJobByIdController);
router.put("/:id", authMiddleware, UpdateJobController);
router.delete("/:id", authMiddleware, DeleteJobController);

export default router;
