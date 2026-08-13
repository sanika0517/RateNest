const express = require("express");

const {
    dashboard,
    listUsers,
    getUser,
    addUser,
    listStores
} = require("../controllers/adminController");

const {
    create
} = require("../controllers/storeController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");
const { list: listStoreRequests, update: updateStoreRequest } = require("../controllers/storeRequestController");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", dashboard);
router.get("/users", listUsers);
router.get("/users/:id", getUser);
router.post("/users", addUser);
router.get("/stores", listStores);
router.post("/stores", create);
router.get("/store-requests", listStoreRequests);
router.put("/store-requests/:id", updateStoreRequest);

module.exports = router;
