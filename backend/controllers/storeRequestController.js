const { getOwnerStoreRequest, createStoreRequest, getStoreRequests, updateStoreRequest } = require("../services/storeRequestService");

const getMyRequest = async (req, res) => {
    try {
        const request = await getOwnerStoreRequest(req.user.userId);
        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch store request." });
    }
};

const createMyRequest = async (req, res) => {
    try {
        const { name, email, address } = req.body;
        if (!name?.trim() || !email?.trim() || !address?.trim()) {
            return res.status(400).json({ success: false, message: "Store name, email, and address are required." });
        }
        const request = await createStoreRequest({ ownerId: req.user.userId, name, email, address });
        res.status(201).json({ success: true, message: "Your store request has been submitted.", request });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to submit store request." });
    }
};

const list = async (req, res) => {
    try {
        const requests = await getStoreRequests();
        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch store requests." });
    }
};

const update = async (req, res) => {
    try {
        const request = await updateStoreRequest({ requestId: req.params.id, status: req.body.status, adminNote: req.body.adminNote || "" });
        res.json({ success: true, message: "Store request updated.", request });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to update store request." });
    }
};

module.exports = { getMyRequest, createMyRequest, list, update };
