const express = require("express");

const {
    create
} = require("../controllers/storeController");

const {
    list
} = require("../controllers/storeListController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const { optionalAuth } = require("../middleware/optionalAuth");

const router = express.Router();

router.get("/", optionalAuth, list);


// ============================================
// ADMIN ONLY - CREATE STORE
// ============================================

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    create
);


module.exports = router;