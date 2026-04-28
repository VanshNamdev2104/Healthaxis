import mongoose from "mongoose";
import dotenv from "dotenv";
import Hospital from "./src/models/hospital/hospital.model.js";
import Doctor from "./src/models/hospital/doctor.model.js";

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for migration");

        const hospitalResult = await Hospital.updateMany(
            { $or: [{ status: { $exists: false } }, { status: 'PENDING' }, { verificationStatus: 'verified' }] },
            { $set: { status: 'APPROVED' }, $unset: { verificationStatus: "" } }
        );
        console.log(`Updated ${hospitalResult.modifiedCount} hospitals to APPROVED`);

        const doctorResult = await Doctor.updateMany(
            { $or: [{ status: { $exists: false } }, { status: 'PENDING' }, { verificationStatus: 'verified' }] },
            { $set: { status: 'APPROVED' }, $unset: { verificationStatus: "" } }
        );
        console.log(`Updated ${doctorResult.modifiedCount} doctors to APPROVED`);

        console.log("Migration complete");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
