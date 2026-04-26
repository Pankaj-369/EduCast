const app = require("./app");
const env = require("./config/env");
const { sequelize } = require("./models");

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(env.port, () => {
      console.log(`EduCast API running on port ${env.port}`);
      console.log(`Swagger docs: http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    const reason = error.original?.message || error.message || error.name;
    console.error("Failed to start server:", reason);
    process.exit(1);
  }
}

startServer();
