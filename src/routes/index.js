const express = require("express");
const authRoutes = require("./authRoutes");
const contentRoutes = require("./contentRoutes");
const approvalRoutes = require("./approvalRoutes");
const publicRoutes = require("./publicRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/content", contentRoutes);
router.use("/principal", approvalRoutes);
router.use("/", publicRoutes);

module.exports = router;
