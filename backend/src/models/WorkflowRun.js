const mongoose = require("mongoose");

const historyEntrySchema = new mongoose.Schema(
  {
    step: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const claimDetailsSchema = new mongoose.Schema(
  {
    claimantName: { type: String },
    contactInfo: { type: String },
    reason: { type: String },
    privateVerification: { type: String },
  },
  { _id: false }
);

const workflowRunSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    currentStep: { type: String, default: "WAITING_FOR_CLAIM", required: true },
    status: { type: String, default: "WAITING", required: true },
    claimDetails: { type: claimDetailsSchema },
    claimantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    history: [historyEntrySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkflowRun", workflowRunSchema);
