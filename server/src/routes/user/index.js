import { Router } from "express";
import {
    register,
    login,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    deleteAccount,
    forgotPassword,
    resetPassword,
} from "../../controllers/user/index.js";
import auth from "../../middlewares/auth.js";
const { authenticate, authorizeRoles } = auth;
import validate from "../../middlewares/validate.js";
import {
    registerSchema,
    loginSchema,
    updateProfileSchema,
} from "../../validations/user/index.js";
import { successResponse } from "../../utils/responsehandler.js";

const router = Router();
router.get("/current-user", authenticate, authorizeRoles("user","admin"), (req, res) => {
    return successResponse(res, { user: req.user }, "Current user");
});
// ─── Public Routes ───────────────────────────────────────────
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ─── Private Routes (require authentication) ────────────────
router.post("/logout", authenticate, authorizeRoles("user", "admin"), logout);
router.get("/profile", authenticate, authorizeRoles("user", "admin"), getProfile);
router.put("/profile", authenticate, authorizeRoles("user", "admin"), validate(updateProfileSchema), updateProfile);
router.delete("/account", authenticate, authorizeRoles("user", "admin"), deleteAccount);

export default router;
