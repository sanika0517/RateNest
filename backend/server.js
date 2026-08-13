require("dotenv").config();

const app = require("./app");
const { ensureStoreRequestTable } = require("./services/storeRequestService");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await ensureStoreRequestTable();
    app.listen(PORT, () => {
        console.log(`RateNest server running on http://localhost:${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Unable to initialize database:", error.message);
    process.exit(1);
});
