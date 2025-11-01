import express from "express";
import User from "./models/User";
import Issue from "./models/Issue";

const router = express.Router();

/** ---------- USERS ---------- */

// Login or create user
router.post("/login", async (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) return res.status(400).json({ message: "Name and email required" });

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ name, email });

  res.json(user);
});

// Get all users (for dropdown)
router.get("/users", async (req, res) => {
  const users = await User.find().select("_id name email");
  res.json(users);
});

/** ---------- ISSUES ---------- */

// Create issue
router.post("/issues", async (req, res) => {
  const { title, description, priority, status, assignee } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  const issue = await Issue.create({ title, description, priority, status, assignee });
  const populated = await issue.populate("assignee", "name email");
  res.status(201).json(populated);
});

// Get all issues (with filters)
router.get("/issues", async (req, res) => {
  const { status, priority } = req.query;
  const query: any = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const issues = await Issue.find(query)
    .populate("assignee", "name email")
    .sort({ createdAt: -1 });
  res.json(issues);
});

// Get single issue
router.get("/issues/:id", async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("assignee", "name email");
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  res.json(issue);
});

// Update issue (status, assignee, description)
router.patch("/issues/:id", async (req, res) => {
  const { status, assignee, description } = req.body;
  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status, assignee, description },
    { new: true }
  ).populate("assignee", "name email");

  if (!issue) return res.status(404).json({ message: "Issue not found" });
  res.json(issue);
});

// Summary
router.get("/issues-summary", async (_req, res) => {
  const byStatus = await Issue.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  const byAssignee = await Issue.aggregate([{ $group: { _id: "$assignee", count: { $sum: 1 } } }]);
  res.json({ byStatus, byAssignee });
});

export default router;
