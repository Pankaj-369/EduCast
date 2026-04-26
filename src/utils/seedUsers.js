const { sequelize, User } = require("../models");
const { ROLES } = require("./constants");

const seedUsers = [
  {
    name: "Principal Admin",
    email: "principal@educast.local",
    password: "Principal@123",
    role: ROLES.PRINCIPAL
  },
  {
    name: "Maths Teacher",
    email: "teacher@educast.local",
    password: "Teacher@123",
    role: ROLES.TEACHER
  }
];

async function run() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    for (const seedUser of seedUsers) {
      const [user, created] = await User.unscoped().findOrCreate({
        where: { email: seedUser.email },
        defaults: {
          name: seedUser.name,
          email: seedUser.email,
          role: seedUser.role,
          password_hash: await User.hashPassword(seedUser.password)
        }
      });

      console.log(`${created ? "Created" : "Exists"}: ${user.email} (${seedUser.password})`);
    }

    process.exit(0);
  } catch (error) {
    const reason = error.original?.message || error.message || error.name;
    console.error("Seeding failed:", reason);
    process.exit(1);
  }
}

run();
