import mongoose from "mongoose";
import User from "../src/models/user/user.model.js";

const MONGO_URI = "mongodb+srv://healthaxisai407_db_user:mAqzS5B78N2jkFDd@cluster0.twuoeot.mongodb.net/HealthAxis"; // apna mongo url daalna

const seedUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    // 🔍 Check before delete
    const countBefore = await User.countDocuments();
    console.log("Users before delete:", countBefore);

    // 🔥 Delete old users
    await User.deleteMany();

    const countAfter = await User.countDocuments();
    console.log("Users after delete:", countAfter);

    const users = [];

    // 👤 Normal Users
    for (let i = 1; i <= 4; i++) {
      users.push({
        name: `User ${i}`,
        email: `user${i}@test.com`,
        password: "12345678",
        number: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        role: "user",
        profileImage: null,
      });
    }

    // 👑 Admin
    users.push({
      name: "Main Admin",
      email: "admin@test.com",
      password: "admin123",
      role: "admin",
      number: "9999999999",
    });

    // 🏥 Hospital Admins
    for (let i = 1; i <= 5; i++) {
      users.push({
        name: `Hospital Admin ${i}`,
        email: `hospital${i}@test.com`,
        password: "12345678",
        role: "hospitalAdmin",
        number: `8${Math.floor(100000000 + Math.random() * 900000000)}`,
      });
    }

    // 🔐 Google Users
    for (let i = 1; i <= 5; i++) {
      users.push({
        name: `Google User ${i}`,
        email: `google${i}@gmail.com`,
        googleId: `google_id_${i}`,
        password: null,
      });
    }

    // ⚠️ Edge Case
    users.push({
      name: "No Phone User",
      email: "nophone@test.com",
      password: "12345678",
      number: null,
    });

    // 🔥 Insert with duplicate-safe handling
    for (const user of users) {
      try {
        await User.create(user); // hook run hoga (password hash)
      } catch (err) {
        if (err.code === 11000) {
          console.log("Duplicate skipped:", user.email);
        } else {
          throw err;
        }
      }
    }

    console.log("Users Seeded Successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Seeding Error ❌", error);
    process.exit(1);
  }
};

seedUser();