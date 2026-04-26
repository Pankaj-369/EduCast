const { sequelize } = require("../models");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
    process.exit(0);
  } catch (error) {
    const reason = error.original?.message || error.message || error.name;
    console.error("Database synchronization failed:", reason);
    process.exit(1);
  }
}

syncDatabase();
