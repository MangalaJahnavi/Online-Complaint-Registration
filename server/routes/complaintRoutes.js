const express = require("express");
const Complaint = require("../models/Complaint");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// @route  POST /api/complaints  (create a new complaint)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      complainant: req.user.id,
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Failed to create complaint", error: error.message });
  }
});

// @route  GET /api/complaints  (list complaints - own for users, all for agent/admin)
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "user") {
      filter.complainant = req.user.id;
    }
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const complaints = await Complaint.find(filter)
      .populate("complainant", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
});

// @route  GET /api/complaints/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("complainant", "name email")
      .populate("assignedAgent", "name email")
      .populate("comments.author", "name role");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (
      req.user.role === "user" &&
      complaint.complainant._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaint", error: error.message });
  }
});

// @route  PUT /api/complaints/:id/status  (agent/admin updates status)
router.put("/:id/status", protect, authorizeRoles("agent", "admin"), async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status || complaint.status;
    if (resolutionNote) complaint.resolutionNote = resolutionNote;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
});

// @route  PUT /api/complaints/:id/assign  (admin assigns agent)
router.put("/:id/assign", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { agentId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.assignedAgent = agentId;
    complaint.status = "In Progress";
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Failed to assign agent", error: error.message });
  }
});

// @route  POST /api/complaints/:id/comments  (add a comment/update)
router.post("/:id/comments", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.comments.push({ author: req.user.id, message });
    await complaint.save();

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
});

// @route  DELETE /api/complaints/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (req.user.role === "user" && complaint.complainant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await complaint.deleteOne();
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete complaint", error: error.message });
  }
});

module.exports = router;
