const express = require("express");

const {
    create,
    update
} = require("../controllers/ratingController");

const {
    authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();


// Submit rating
router.post(
    "/",
    authenticate,
    create
);


// Update rating
router.put(
    "/:storeId",
    authenticate,
    update
);


module.exports = router;