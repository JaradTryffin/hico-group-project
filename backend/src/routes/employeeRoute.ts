import express from "express";
import * as employeeController from "../controllers/employeeController";

const router = express.Router();

router.post("/", employeeController.createEmployeeController);
router.get("/", employeeController.getEmployeeController);
router.get("/:id", employeeController.getEmployeeByIdController);
router.patch("/:id", employeeController.updateEmployeeController);

export default router;
