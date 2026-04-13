import { Router } from "express";
import {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    getMedicinesByDisease,
    updateMedicine,
    deleteMedicine,
} from "../../controllers/health/medicine.controller.js";
import auth from "../../middlewares/auth.js";
const { authenticate, authorizeRoles } = auth;

const router = Router();

// ─── Public Routes ───────────────────────────────────────────
router.get("/", getAllMedicines);
router.get("/disease/:diseaseId", getMedicinesByDisease);
router.get("/:id", getMedicineById);

// ─── Private Routes (Admin only) ────────────────────────────
router.post("/", authenticate, authorizeRoles("admin"), createMedicine);
router.put("/:id", authenticate, authorizeRoles("admin"), updateMedicine);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteMedicine);

export default router;
