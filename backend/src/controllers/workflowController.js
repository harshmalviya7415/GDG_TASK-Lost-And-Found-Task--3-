const WorkflowRun = require("../models/WorkflowRun");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const Claim = require("../models/Claim");

const getWorkflowWithClaims = async (workflow) => {
  const claims = await Claim.find({ itemId: workflow.itemId });
  const workflowObj = workflow.toObject();
  workflowObj.claims = claims;
  return workflowObj;
};

const getWorkflow = async (req, res) => {
  try {
    const workflow = await WorkflowRun.findOne({ itemId: req.params.id });
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }
    const responseObj = await getWorkflowWithClaims(workflow);
    res.status(200).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitClaim = async (req, res) => {
  try {
    const { claimantName, contactInfo, reason, privateVerification } = req.body;
    if (!claimantName || !contactInfo || !reason || !privateVerification) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const workflow = await WorkflowRun.findOne({ itemId: req.params.id });
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    if (workflow.currentStep !== "WAITING_FOR_CLAIM" && workflow.currentStep !== "WAITING_FOR_VERIFICATION") {
      return res.status(400).json({ error: "Invalid workflow step" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const hasAlreadyClaimed = await Claim.findOne({ itemId: req.params.id, claimantId: req.user._id });
    if (hasAlreadyClaimed) {
      return res.status(400).json({ error: "You have already submitted a claim for this item" });
    }

    const newClaim = new Claim({
      itemId: req.params.id,
      claimantId: req.user._id,
      claimantName,
      contactInfo,
      reason,
      privateVerification,
      status: "PENDING"
    });
    await newClaim.save();

    workflow.currentStep = "WAITING_FOR_VERIFICATION";
    workflow.status = "WAITING";
    workflow.history.push({ step: "CLAIM_SUBMITTED", timestamp: new Date() });
    await workflow.save();

    if (item.createdBy) {
      const notif = new Notification({
        userId: item.createdBy,
        itemId: item._id,
        message: `${req.user.username} submitted a claim/report for "${item.title}".`,
      });
      await notif.save();
    }

    const responseObj = await getWorkflowWithClaims(workflow);
    res.status(200).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveClaim = async (req, res) => {
  try {
    const { claimantId } = req.body;
    if (!claimantId) {
      return res.status(400).json({ error: "Claimant ID is required for approval" });
    }

    const workflow = await WorkflowRun.findOne({ itemId: req.params.id });
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    if (workflow.currentStep !== "WAITING_FOR_VERIFICATION") {
      return res.status(400).json({ error: "Invalid workflow step" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const isFinder = (item.type === "Found" && item.createdBy && item.createdBy.toString() === req.user._id.toString()) ||
                     (item.type === "Lost" && item.createdBy && item.createdBy.toString() === req.user._id.toString());
    if (!isFinder) {
      return res.status(403).json({ error: "Access denied. Only the item reporter can approve claims." });
    }

    const targetClaim = await Claim.findOne({ itemId: req.params.id, claimantId });
    if (!targetClaim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    workflow.claimantId = targetClaim.claimantId;
    workflow.claimDetails = {
      claimantName: targetClaim.claimantName,
      contactInfo: targetClaim.contactInfo,
      reason: targetClaim.reason,
      privateVerification: targetClaim.privateVerification
    };

    targetClaim.status = "APPROVED";
    await targetClaim.save();

    await Claim.updateMany(
      { itemId: req.params.id, claimantId: { $ne: claimantId } },
      { status: "REJECTED" }
    );

    workflow.currentStep = "WAITING_FOR_HANDOVER";
    workflow.status = "WAITING";
    workflow.history.push({ step: "VERIFIED", timestamp: new Date() });
    await workflow.save();

    const targetClaimantId = item.type === "Lost" ? item.createdBy : workflow.claimantId;
    if (targetClaimantId) {
      const notif = new Notification({
        userId: targetClaimantId,
        itemId: item._id,
        message: `The claim for "${item.title}" was approved by ${req.user.username}.`,
      });
      await notif.save();
    }

    const responseObj = await getWorkflowWithClaims(workflow);
    res.status(200).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markHandedOver = async (req, res) => {
  try {
    const workflow = await WorkflowRun.findOne({ itemId: req.params.id });
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    if (workflow.currentStep !== "WAITING_FOR_HANDOVER") {
      return res.status(400).json({ error: "Invalid workflow step" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const isFinder = (item.type === "Found" && item.createdBy && item.createdBy.toString() === req.user._id.toString()) ||
                     (item.type === "Lost" && workflow.claimantId && workflow.claimantId.toString() === req.user._id.toString());
    if (!isFinder) {
      return res.status(403).json({ error: "Access denied. Only the finder can mark handover." });
    }

    workflow.currentStep = "WAITING_FOR_RECEIVER_CONFIRMATION";
    workflow.status = "WAITING";
    workflow.history.push({ step: "FINDER_CONFIRMED_HANDOVER", timestamp: new Date() });
    await workflow.save();

    const claimantId = item.type === "Lost" ? item.createdBy : workflow.claimantId;
    if (claimantId) {
      const notif = new Notification({
        userId: claimantId,
        itemId: item._id,
        message: `${req.user.username} marked "${item.title}" as handed over. Please confirm receipt.`,
      });
      await notif.save();
    }

    const responseObj = await getWorkflowWithClaims(workflow);
    res.status(200).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmReceived = async (req, res) => {
  try {
    const workflow = await WorkflowRun.findOne({ itemId: req.params.id });
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    if (workflow.currentStep !== "WAITING_FOR_RECEIVER_CONFIRMATION") {
      return res.status(400).json({ error: "Invalid workflow step" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const isClaimant = (item.type === "Lost" && item.createdBy && item.createdBy.toString() === req.user._id.toString()) ||
                        (item.type === "Found" && workflow.claimantId && workflow.claimantId.toString() === req.user._id.toString());
    if (!isClaimant) {
      return res.status(403).json({ error: "Access denied. Only the claimant can confirm receipt." });
    }

    workflow.currentStep = "COMPLETED";
    workflow.status = "COMPLETED";
    workflow.history.push({ step: "COMPLETED", timestamp: new Date() });
    await workflow.save();

    const finderId = item.type === "Found" ? item.createdBy : workflow.claimantId;
    if (finderId) {
      const notif = new Notification({
        userId: finderId,
        itemId: item._id,
        message: `${req.user.username} confirmed receipt of "${item.title}". The workflow is complete!`,
      });
      await notif.save();
    }

    const responseObj = await getWorkflowWithClaims(workflow);
    res.status(200).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWorkflow,
  submitClaim,
  approveClaim,
  markHandedOver,
  confirmReceived,
};
