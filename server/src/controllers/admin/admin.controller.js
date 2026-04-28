import User from "../../models/user/user.model.js";
import Hospital from "../../models/hospital/hospital.model.js";
import Doctor from "../../models/hospital/doctor.model.js";
import Appointment from "../../models/hospital/appointment.model.js";
import Disease from "../../models/health/disease.model.js";
import Medicine from "../../models/health/medicine.model.js";
import Activity from "../../models/activity.model.js";
import logger from "../../config/logger.js";
import { getActivityFeed as getActivityFeedUtil } from "../../utils/activity.js";
import {
    successResponse,
    errorResponse,
    notFoundResponse,
} from "../../utils/responsehandler.js";
import sendMail from "../../services/mail.service.js";

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private (Admin)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalHospitals,
            totalDoctors,
            totalAppointments,
            totalDiseases,
            totalMedicines,
        ] = await Promise.all([
            User.countDocuments({ role: "user" }),
            Hospital.countDocuments(),
            Doctor.countDocuments(),
            Appointment.countDocuments(),
            Disease.countDocuments(),
            Medicine.countDocuments(),
        ]);

        // Calculate revenue (mock calculation based on appointments)
        const revenue = await Appointment.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $ifNull: ["$fee", 0] } },
                },
            },
        ]);

        const totalRevenue = revenue[0]?.total || 0;

        // Calculate growth (mock - compare with last month)
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });
        const growth = ((lastMonthUsers / (totalUsers || 1)) * 100).toFixed(1);

        const stats = {
            totalUsers,
            totalHospitals,
            totalDoctors,
            totalAppointments,
            totalDiseases,
            totalMedicines,
            revenue: totalRevenue,
            growth: parseFloat(growth),
        };

        return successResponse(res, stats, "Dashboard stats fetched successfully");
    } catch (error) {
        logger.error("Get Dashboard Stats Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch dashboard stats");
    }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", role = "", status = "" } = req.query;

        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (role) {
            query.role = role;
        }

        if (status) {
            query.status = status;
        }

        const users = await User.find(query)
            .select("-password -refreshToken")
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        return successResponse(res, {
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }, "Users fetched successfully");
    } catch (error) {
        logger.error("Get All Users Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch users");
    }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:userId
 * @access  Private (Admin)
 */
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password -refreshToken");

        if (!user) {
            return notFoundResponse(res, "User not found");
        }

        return successResponse(res, user, "User fetched successfully");
    } catch (error) {
        logger.error("Get User By ID Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch user");
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:userId
 * @access  Private (Admin)
 */
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, number, role } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email, number, role },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");

        if (!user) {
            return notFoundResponse(res, "User not found");
        }

        return successResponse(res, user, "User updated successfully");
    } catch (error) {
        logger.error("Update User Error", { error: error.message });
        return errorResponse(res, error, "Failed to update user");
    }
};

/**
 * @desc    Suspend/unsuspend user
 * @route   PATCH /api/admin/users/:userId/suspend
 * @access  Private (Admin)
 */
export const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return notFoundResponse(res, "User not found");
        }

        user.status = user.status === "active" ? "suspended" : "active";
        await user.save();

        return successResponse(
            res,
            { status: user.status },
            `User ${user.status === "active" ? "unsuspended" : "suspended"} successfully`
        );
    } catch (error) {
        logger.error("Suspend User Error", { error: error.message });
        return errorResponse(res, error, "Failed to suspend user");
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:userId
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return notFoundResponse(res, "User not found");
        }

        return successResponse(res, null, "User deleted successfully");
    } catch (error) {
        logger.error("Delete User Error", { error: error.message });
        return errorResponse(res, error, "Failed to delete user");
    }
};

/**
 * @desc    Get all hospitals with filters
 * @route   GET /api/admin/hospitals
 * @access  Private (Admin)
 */
export const getAllHospitals = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", status = "" } = req.query;

        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
            ];
        }

        if (status) {
            query.status = status;
        }

        const hospitals = await Hospital.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Hospital.countDocuments(query);

        return successResponse(res, {
            data: hospitals,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }, "Hospitals fetched successfully");
    } catch (error) {
        logger.error("Get All Hospitals Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch hospitals");
    }
};

/**
 * @desc    Approve hospital
 * @route   PATCH /api/admin/hospitals/:hospitalId/approve
 * @access  Private (Admin)
 */
export const approveHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const hospital = await Hospital.findByIdAndUpdate(
            hospitalId,
            { verificationStatus: "verified" },
            { new: true }
        );

        if (!hospital) {
            return notFoundResponse(res, "Hospital not found");
        }

        return successResponse(res, hospital, "Hospital approved successfully");
    } catch (error) {
        logger.error("Approve Hospital Error", { error: error.message });
        return errorResponse(res, error, "Failed to approve hospital");
    }
};

/**
 * @desc    Reject hospital
 * @route   PATCH /api/admin/hospitals/:hospitalId/reject
 * @access  Private (Admin)
 */
export const rejectHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const hospital = await Hospital.findByIdAndUpdate(
            hospitalId,
            { verificationStatus: "rejected" },
            { new: true }
        );

        if (!hospital) {
            return notFoundResponse(res, "Hospital not found");
        }

        return successResponse(res, hospital, "Hospital rejected successfully");
    } catch (error) {
        logger.error("Reject Hospital Error", { error: error.message });
        return errorResponse(res, error, "Failed to reject hospital");
    }
};

/**
 * @desc    Delete hospital
 * @route   DELETE /api/admin/hospitals/:hospitalId
 * @access  Private (Admin)
 */
export const deleteHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const hospital = await Hospital.findByIdAndDelete(hospitalId);

        if (!hospital) {
            return notFoundResponse(res, "Hospital not found");
        }

        // Delete associated doctors
        await Doctor.deleteMany({ hospital: hospitalId });

        return successResponse(res, null, "Hospital deleted successfully");
    } catch (error) {
        logger.error("Delete Hospital Error", { error: error.message });
        return errorResponse(res, error, "Failed to delete hospital");
    }
};

/**
 * @desc    Get all doctors with filters
 * @route   GET /api/admin/doctors
 * @access  Private (Admin)
 */
export const getAllDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", specialization = "", status = "" } = req.query;

        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (specialization) {
            query.specialization = specialization;
        }

        if (status) {
            query.status = status;
        }

        const doctors = await Doctor.find(query)
            .populate("hospital", "name city")
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Doctor.countDocuments(query);

        return successResponse(res, {
            data: doctors,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        }, "Doctors fetched successfully");
    } catch (error) {
        logger.error("Get All Doctors Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch doctors");
    }
};

/**
 * @desc    Approve doctor
 * @route   PATCH /api/admin/doctors/:doctorId/approve
 * @access  Private (Admin)
 */
export const approveDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { verificationStatus: "verified" },
            { new: true }
        );

        if (!doctor) {
            return notFoundResponse(res, "Doctor not found");
        }

        return successResponse(res, doctor, "Doctor approved successfully");
    } catch (error) {
        logger.error("Approve Doctor Error", { error: error.message });
        return errorResponse(res, error, "Failed to approve doctor");
    }
};

/**
 * @desc    Delete doctor
 * @route   DELETE /api/admin/doctors/:doctorId
 * @access  Private (Admin)
 */
export const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findByIdAndDelete(doctorId);

        if (!doctor) {
            return notFoundResponse(res, "Doctor not found");
        }

        return successResponse(res, null, "Doctor deleted successfully");
    } catch (error) {
        logger.error("Delete Doctor Error", { error: error.message });
        return errorResponse(res, error, "Failed to delete doctor");
    }
};

/**
 * @desc    Get activity feed
 * @route   GET /api/admin/activity
 * @access  Private (Admin)
 */
export const getActivityFeed = async (req, res) => {
    try {
        const { page = 1, limit = 20, type = "", userId = "", targetModel = "" } = req.query;

        const feedOptions = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        if (type) feedOptions.type = type;
        if (userId) feedOptions.userId = userId;
        if (targetModel) feedOptions.targetModel = targetModel;

        const activityFeed = await getActivityFeedUtil(feedOptions);

        return successResponse(res, activityFeed, "Activity feed fetched successfully");
    } catch (error) {
        logger.error("Get Activity Feed Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch activity feed");
    }
};

/**
 * @desc    Get revenue analytics
 * @route   GET /api/admin/analytics/revenue
 * @access  Private (Admin)
 */
export const getRevenueAnalytics = async (req, res) => {
    try {
        const { period = "monthly" } = req.query;

        let groupBy;
        if (period === "monthly") {
            groupBy = { $month: "$createdAt" };
        } else if (period === "yearly") {
            groupBy = { $year: "$createdAt" };
        } else {
            groupBy = { $dayOfMonth: "$createdAt" };
        }

        const revenueData = await Appointment.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: { $ifNull: ["$fee", 0] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Create array with 12 months/weeks/days filled with 0 as default
        const dataArray = new Array(period === "monthly" ? 12 : period === "yearly" ? 12 : 30).fill(0);
        
        revenueData.forEach((item) => {
            const index = item._id - 1;
            if (index >= 0 && index < dataArray.length) {
                dataArray[index] = item.revenue;
            }
        });

        return successResponse(res, dataArray, "Revenue analytics fetched successfully");
    } catch (error) {
        logger.error("Get Revenue Analytics Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch revenue analytics");
    }
};

/**
 * @desc    Get growth analytics
 * @route   GET /api/admin/analytics/growth
 * @access  Private (Admin)
 */
export const getGrowthAnalytics = async (req, res) => {
    try {
        const { period = "monthly" } = req.query;

        let groupBy;
        if (period === "monthly") {
            groupBy = { $month: "$createdAt" };
        } else if (period === "yearly") {
            groupBy = { $year: "$createdAt" };
        } else {
            groupBy = { $dayOfMonth: "$createdAt" };
        }

        const growthData = await User.aggregate([
            { $match: { role: "user" } },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Create array with 12 months/weeks/days filled with 0 as default
        const dataArray = new Array(period === "monthly" ? 12 : period === "yearly" ? 12 : 30).fill(0);
        
        growthData.forEach((item) => {
            const index = item._id - 1;
            if (index >= 0 && index < dataArray.length) {
                dataArray[index] = item.count;
            }
        });

        return successResponse(res, dataArray, "Growth analytics fetched successfully");
    } catch (error) {
        logger.error("Get Growth Analytics Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch growth analytics");
    }
};

export const getPendingProviders = async (req, res) => {
    try {
        const [hospitals, doctors] = await Promise.all([
            Hospital.find({ status: 'PENDING' }).sort({ createdAt: -1 }),
            Doctor.find({ status: 'PENDING' }).populate('hospital', 'name').sort({ createdAt: -1 })
        ]);
        return successResponse(res, { hospitals, doctors }, "Pending providers fetched successfully");
    } catch (error) {
        logger.error("Get Pending Providers Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch pending providers");
    }
};

export const getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return notFoundResponse(res, "Hospital not found");
        return successResponse(res, hospital, "Hospital fetched successfully");
    } catch (error) {
        logger.error("Get Hospital Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch hospital");
    }
};

export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('hospital', 'name email hospitalEmail contact hospitalNumber');
        if (!doctor) return notFoundResponse(res, "Doctor not found");
        return successResponse(res, doctor, "Doctor fetched successfully");
    } catch (error) {
        logger.error("Get Doctor Error", { error: error.message });
        return errorResponse(res, error, "Failed to fetch doctor");
    }
};

export const updateProviderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        if (!['APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
            return errorResponse(res, { message: "Invalid status" }, "Invalid status provided");
        }

        if (status === 'REJECTED' && !reason) {
            return errorResponse(res, { message: "Rejection reason is required" }, "Reason is required when rejecting");
        }

        const updateData = { status };
        if (status === 'REJECTED') {
            updateData.rejectionReason = reason;
        } else {
            updateData.rejectionReason = "";
        }

        let provider = await Hospital.findByIdAndUpdate(id, updateData, { new: true }).populate("user");
        let type = 'hospital';

        if (!provider) {
            provider = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
            type = 'doctor';
        }

        if (!provider) {
            return notFoundResponse(res, "Provider not found");
        }

        const email = type === 'hospital' ? (provider.hospitalEmail || provider.user?.email) : provider.email;
        if (email) {
            const subject = `HealthAxis Provider Status Update: ${status}`;
            const text = `Hello ${provider.name},\n\nYour provider account status has been updated to ${status}.` + 
                         (status === 'REJECTED' ? `\n\nReason: ${reason}\n\nYou can update your profile and resubmit from your dashboard.` : '') +
                         `\n\nThank you,\nHealthAxis Team`;
            
            sendMail(email, subject, text).catch(err => logger.error("Failed to send notification email", { error: err.message }));
        }

        // Dynamically update user role based on approval status
        if (type === 'hospital' && provider.user) {
            if (status === 'APPROVED') {
                await User.findByIdAndUpdate(provider.user._id, { role: 'hospitalAdmin' });
            } else if (status === 'REJECTED' || status === 'SUSPENDED') {
                await User.findByIdAndUpdate(provider.user._id, { role: 'user' });
            }
        }

        return successResponse(res, { provider, type }, `Provider status updated to ${status}`);
    } catch (error) {
        logger.error("Update Provider Status Error", { error: error.message });
        return errorResponse(res, error, "Failed to update provider status");
    }
};
