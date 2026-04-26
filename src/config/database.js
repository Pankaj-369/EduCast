const { Sequelize } = require("sequelize");
const env = require("./env");

const commonOptions = {
  dialect: env.database.dialect,
  logging: false
};

const sequelize = env.database.url
  ? new Sequelize(env.database.url, {
      ...commonOptions,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(env.database.name, env.database.user, env.database.password, {
      ...commonOptions,
      host: env.database.host,
      port: env.database.port
    });

module.exports = sequelize;
