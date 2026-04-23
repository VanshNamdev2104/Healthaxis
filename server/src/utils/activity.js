import Activity from "../models/activity.model.js";
import logger from "../config/logger.js";

/**
 * Log an activity to the database
 * @param {Object} options - Activity logging options
 * @param {String} options.type - Type of activity (user, hospital, doctor, appointment, system)
 * @param {String} options.action - Action performed (created, updated, deleted, approved, rejected, suspended)
 * @param {String} options.description - Human-readable description
 * @param {String} options.targetModel - The model that was affected (User, Hospital, Doctor, etc.)
 * @param {String} options.targetId - The ID of the affected resource
 * @param {String} options.userId - The ID of the user performing the action
 * @param {Object} options.details - Additional details about the activity
 * @param {String} options.status - Status of the activity (success, failed)
 */
export async function logActivity(options) {
    try {
        const {
            type = "system",
            action = "unknown",
            description = "",
            targetModel = null,
            targetId = null,
            userId = null,
            details = {},
            status = "success",
        } = options;

        const activity = await Activity.create({
            type,
            action,
            description,
            targetModel,
            targetId,
            userId,
            details,
            status,
        });

        return activity;
    } catch (error) {
        logger.error("Error logging activity", { error: error.message, options });
        // Don't throw - activity logging should not break the main operation
        return null;
    }
}

/**
 * Get activity feed with filters
 * @param {Object} options - Query options
 * @param {Number} options.page - Page number (default: 1)
 * @param {Number} options.limit - Items per page (default: 20)
 * @param {String} options.type - Filter by activity type
 * @param {String} options.userId - Filter by user ID
 * @param {String} options.targetModel - Filter by target model
 * @param {Date} options.startDate - Filter activities after this date
 * @param {Date} options.endDate - Filter activities before this date
 */
export async function getActivityFeed(options = {}) {
    try {
        const {
            page = 1,
            limit = 20,
            type = null,
            userId = null,
            targetModel = null,
            startDate = null,
            endDate = null,
        } = options;

        const query = {};

        if (type) query.type = type;
        if (userId) query.userId = userId;
        if (targetModel) query.targetModel = targetModel;

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            Activity.find(query)
                .populate("userId", "name email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Activity.countDocuments(query),
        ]);

        return {
            data: activities,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        logger.error("Error fetching activity feed", { error: error.message });
        throw error;
    }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(options = {}) {
    try {
        const {
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            endDate = new Date(),
        } = options;

        const query = {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        };

        const stats = await Activity.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        return stats;
    } catch (error) {
        logger.error("Error fetching activity stats", { error: error.message });
        throw error;
    }
}
