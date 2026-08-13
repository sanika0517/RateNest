const pool = require("../config/db");

const ensureStoreRequestTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS store_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            owner_id INT NOT NULL UNIQUE,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address VARCHAR(400) NOT NULL,
            status ENUM('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
            admin_note VARCHAR(500) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_store_request_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
};

const getOwnerStoreRequest = async (ownerId) => {
    const [requests] = await pool.query(
        `SELECT id, name, email, address, status, admin_note, created_at, updated_at
         FROM store_requests
         WHERE owner_id = ?`,
        [ownerId]
    );
    return requests[0] || null;
};

const createStoreRequest = async ({ ownerId, name, email, address }) => {
    const [stores] = await pool.query("SELECT id FROM stores WHERE owner_id = ?", [ownerId]);
    if (stores.length) {
        const error = new Error("A store is already registered for this owner account.");
        error.statusCode = 409;
        throw error;
    }

    const existing = await getOwnerStoreRequest(ownerId);
    if (existing) {
        const error = new Error("You already have a store request in progress.");
        error.statusCode = 409;
        throw error;
    }

    const [result] = await pool.query(
        `INSERT INTO store_requests (owner_id, name, email, address)
         VALUES (?, ?, ?, ?)`,
        [ownerId, name.trim(), email.toLowerCase().trim(), address.trim()]
    );

    return { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim(), address: address.trim(), status: "PENDING" };
};

const getStoreRequests = async () => {
    const [requests] = await pool.query(
        `SELECT sr.id, sr.name, sr.email, sr.address, sr.status, sr.admin_note, sr.created_at,
                u.name AS owner_name, u.email AS owner_email
         FROM store_requests sr
         INNER JOIN users u ON u.id = sr.owner_id
         ORDER BY FIELD(sr.status, 'PENDING', 'IN_PROGRESS', 'REJECTED', 'APPROVED'), sr.created_at DESC`
    );
    return requests;
};

const updateStoreRequest = async ({ requestId, status, adminNote = "" }) => {
    const allowedStatuses = ["PENDING", "IN_PROGRESS", "APPROVED", "REJECTED"];
    if (!allowedStatuses.includes(status)) {
        const error = new Error("Please select a valid request status.");
        error.statusCode = 400;
        throw error;
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [requests] = await connection.query("SELECT * FROM store_requests WHERE id = ? FOR UPDATE", [requestId]);
        if (!requests.length) {
            const error = new Error("Store request not found.");
            error.statusCode = 404;
            throw error;
        }

        const request = requests[0];
        if (status === "APPROVED" && request.status !== "APPROVED") {
            const [stores] = await connection.query("SELECT id FROM stores WHERE owner_id = ?", [request.owner_id]);
            if (stores.length) {
                const error = new Error("This owner already has a registered store.");
                error.statusCode = 409;
                throw error;
            }
            await connection.query(
                "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
                [request.name, request.email, request.address, request.owner_id]
            );
        }

        await connection.query(
            "UPDATE store_requests SET status = ?, admin_note = ? WHERE id = ?",
            [status, adminNote.trim() || null, requestId]
        );
        await connection.commit();
        return { id: Number(requestId), status };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = { ensureStoreRequestTable, getOwnerStoreRequest, createStoreRequest, getStoreRequests, updateStoreRequest };
