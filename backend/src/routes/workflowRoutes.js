const express = require("express");
const router = express.Router();
const {
  getWorkflow,
  submitClaim,
  approveClaim,
  markHandedOver,
  confirmReceived,
} = require("../controllers/workflowController");
const auth = require("../middleware/auth");

router.get("/:id", auth, getWorkflow);
router.post("/:id/claim", auth, submitClaim);
router.post("/:id/approve", auth, approveClaim);
router.post("/:id/handover", auth, markHandedOver);
router.post("/:id/confirm", auth, confirmReceived);

module.exports = router;
