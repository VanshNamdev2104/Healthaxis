import { Router } from "express";
import {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUser,
    suspendUser,
    deleteUser,
    getAllHospitals,
    approveHospital,
    rejectHospital,
    deleteHospital,
    getAllDoctors,
    approveDoctor,
    deleteDoctor,
    getActivityFeed,
    getRevenueAnalytics,
    getGrowthAnalytics,
    getPendingProviders,
    getHospitalById,
    getDoctorById,
    updateProviderStatus,
} from "../../controllers/admin/admin.controller.js";
import auth from "../../middlewares/auth.js";
const { authenticate, authorizeRoles } = auth;

const router = Router();

// ─── Dashboard Stats ──────────────────────────────────────────────
router.get("/dashboard/stats", authenticate, authorizeRoles("admin"), getDashboardStats);

// ─── User Management ───────────────────────────────────────────────
router.get("/users", authenticate, authorizeRoles("admin"), getAllUsers);
router.get("/users/:userId", authenticate, authorizeRoles("admin"), getUserById);
router.put("/users/:userId", authenticate, authorizeRoles("admin"), updateUser);
router.patch("/users/:userId/suspend", authenticate, authorizeRoles("admin"), suspendUser);
router.delete("/users/:userId", authenticate, authorizeRoles("admin"), deleteUser);

// ─── Provider Approval Workflow ─────────────────────────────────────
router.get("/providers/pending", authenticate, authorizeRoles("admin"), getPendingProviders);
router.get("/hospitals/:id", authenticate, authorizeRoles("admin"), getHospitalById);
router.get("/doctors/:id", authenticate, authorizeRoles("admin"), getDoctorById);
router.put("/providers/:id/status", authenticate, authorizeRoles("admin"), updateProviderStatus);

// ─── Hospital Management ────────────────────────────────────────────
router.get("/hospitals", authenticate, authorizeRoles("admin"), getAllHospitals);
router.patch("/hospitals/:hospitalId/approve", authenticate, authorizeRoles("admin"), approveHospital);
router.patch("/hospitals/:hospitalId/reject", authenticate, authorizeRoles("admin"), rejectHospital);
router.delete("/hospitals/:hospitalId", authenticate, authorizeRoles("admin"), deleteHospital);

// ─── Doctor Management ───────────────────────────────────────────────
router.get("/doctors", authenticate, authorizeRoles("admin"), getAllDoctors);
router.patch("/doctors/:doctorId/approve", authenticate, authorizeRoles("admin"), approveDoctor);
router.delete("/doctors/:doctorId", authenticate, authorizeRoles("admin"), deleteDoctor);

// ─── Activity Feed ───────────────────────────────────────────────────
router.get("/activity", authenticate, authorizeRoles("admin"), getActivityFeed);

// ─── Analytics ────────────────────────────────────────────────────────
router.get("/analytics/revenue", authenticate, authorizeRoles("admin"), getRevenueAnalytics);
router.get("/analytics/growth", authenticate, authorizeRoles("admin"), getGrowthAnalytics);

export default router;
