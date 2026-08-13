const express = require("express");
const { dashboard } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticate, authorize("NORMAL_USER"), dashboard);

module.exports = router;
