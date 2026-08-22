const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    claimantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    claimantName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    reason: { type: String, required: true },
    privateVerification: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", claimSchema);
