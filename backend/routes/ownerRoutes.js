const express = require("express");

const { dashboard } = require("../controllers/ownerController");
const { getMyRequest, createMyRequest } = require("../controllers/storeRequestController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("STORE_OWNER"),
    dashboard
);

router.get("/store-request", authenticate, authorize("STORE_OWNER"), getMyRequest);
router.post("/store-request", authenticate, authorize("STORE_OWNER"), createMyRequest);

module.exports = router;
