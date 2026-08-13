const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

const registerUser = async ({ name, email, address, password, role = "NORMAL_USER" }) => {
    // Check whether email already exists
    const [existingUsers] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existingUsers.length > 0) {
        const error = new Error("An account with this email already exists.");
        error.statusCode = 409;
        throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
        `INSERT INTO users (name, email, password, address, role)
         VALUES (?, ?, ?, ?, ?)`,
        [name.trim(), email.toLowerCase().trim(), hashedPassword, address.trim(), role]
    );

    return {
        id: result.insertId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        address: address.trim(),
        role
    };
};

const loginUser = async ({ email, password }) => {
    const [users] = await pool.query(
        `SELECT id, name, email, password, address, role
         FROM users
         WHERE email = ?`,
        [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role
        }
    };
};

const updatePassword = async ({ userId, currentPassword, newPassword }) => {
    const [users] = await pool.query(
        "SELECT id, password FROM users WHERE id = ?",
        [userId]
    );

    if (users.length === 0) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    const match = await bcrypt.compare(currentPassword, users[0].password);

    if (!match) {
        const error = new Error("Current password is incorrect.");
        error.statusCode = 401;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await pool.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
    );
};

module.exports = {
    registerUser,
    loginUser,
    updatePassword
};
