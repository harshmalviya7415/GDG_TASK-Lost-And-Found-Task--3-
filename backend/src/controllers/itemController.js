const Item = require("../models/Item");
const WorkflowRun = require("../models/WorkflowRun");
const Claim = require("../models/Claim");

const createItem = async (req, res) => {
  try {
    const { title, type, category, description, location, date, contact } = req.body;
    if (!title || !type || !category || !description || !location || !date || !contact) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const item = new Item({ title, type, category, description, location, date, contact, createdBy: req.user._id });
    await item.save();

    const workflow = new WorkflowRun({
      itemId: item._id,
      currentStep: "WAITING_FOR_CLAIM",
      status: "WAITING",
      history: [{ step: "REPORTED", timestamp: new Date() }],
    });
    await workflow.save();

    res.status(201).json({ item, workflow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("createdBy", "username email").sort({ createdAt: -1 });

    const itemIds = items.map(item => item._id);
    const workflows = await WorkflowRun.find({ itemId: { $in: itemIds } });
    const claims = await Claim.find({ itemId: { $in: itemIds } });

    const claimsMap = {};
    claims.forEach(c => {
      const key = c.itemId.toString();
      if (!claimsMap[key]) claimsMap[key] = [];
      claimsMap[key].push(c);
    });

    const workflowMap = {};
    workflows.forEach(w => {
      workflowMap[w.itemId.toString()] = w;
    });

    const itemsWithWorkflow = items.map(item => {
      const itemObj = item.toObject();
      const workflow = workflowMap[item._id.toString()];
      const itemClaims = claimsMap[item._id.toString()] || [];
      itemObj.currentStep = workflow ? workflow.currentStep : "WAITING_FOR_CLAIM";
      itemObj.workflowStatus = workflow ? workflow.status : "WAITING";
      itemObj.claimantIds = itemClaims.map(c => c.claimantId.toString());
      return itemObj;
    });

    res.status(200).json(itemsWithWorkflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("createdBy", "username email");
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editItem = async (req, res) => {
  try {
    const { id, title, type, category, description, location, date, contact } = req.body;
    if (!id || !title || !type || !category || !description || !location || !date || !contact) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to edit this item" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: { title, type, category, description, location, date, contact } },
      { returnDocument: "after", runValidators: true }
    );

    res.status(200).json({ mess: "Update Successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(id);
    await WorkflowRun.findOneAndDelete({ itemId: id });
    await Claim.deleteMany({ itemId: id });

    res.status(200).json({ mess: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItem,
  editItem,
  deleteItem,
};
