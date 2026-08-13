const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const userRoutes = require("./routes/userRoutes");

const pool = require("./config/db");

const {
    authenticate,
    authorize
} = require("./middleware/authMiddleware");

const app = express();


// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());


// ============================================
// API ROUTES
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/user", userRoutes);


// ============================================
// ROOT ROUTE
// ============================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "RateNest API is running"
    });
});


// ============================================
// DATABASE HEALTH CHECK
// ============================================

app.get("/api/health/db", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS database_name"
        );

        res.json({
            success: true,
            message: "Database connected successfully",
            database: rows[0].database_name
        });

    } catch (error) {
        console.error(
            "Database connection error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});


// ============================================
// TEMPORARY ADMIN TEST ROUTE
// ============================================

app.get(
    "/api/test/admin",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "You accessed an admin-only route.",
            user: req.user
        });
    }
);


// ============================================
// EXPORT APP
// ============================================

module.exports = app;
