import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import {
  listRides,
  getRide,
  createRide,
  cancelRide,
  joinRide,
  leaveRide,
  myDriving,
  myRiding,
  matchRides,
} from "../controllers/rideController.js";

const router = Router();

router.get("/mine/driving", authenticateJWT, myDriving);
router.get("/mine/riding", authenticateJWT, myRiding);
router.get("/match", authenticateJWT, matchRides);

router.get("/", listRides);
router.get("/:id", getRide);
router.post("/", authenticateJWT, createRide);
router.delete("/:id", authenticateJWT, cancelRide);

router.post("/:id/join", authenticateJWT, joinRide);
router.delete("/:id/leave", authenticateJWT, leaveRide);

export default router;
