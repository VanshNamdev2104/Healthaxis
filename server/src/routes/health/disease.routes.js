import { Router } from "express";
import {
    createDisease,
    getAllDiseases,
    getDiseaseById,
    updateDisease,
    deleteDisease,
} from "../../controllers/health/disease.controller.js";
import auth from "../../middlewares/auth.js";
const { authenticate, authorizeRoles } = auth;

const router = Router();

// ─── Public Routes ───────────────────────────────────────────
router.get("/", getAllDiseases);
router.get("/:id", getDiseaseById);

// ─── Private Routes (Admin only) ────────────────────────────
router.post("/", authenticate, authorizeRoles("admin"), createDisease);
router.put("/:id", authenticate, authorizeRoles("admin"), updateDisease);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteDisease);

export default router;
