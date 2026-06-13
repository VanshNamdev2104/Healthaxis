import notificationModel from "../models/notification.model.js";
import logger from "../config/logger.js";

/**
 * Fetch all notifications for the logged-in user
 */
export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationModel.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        logger.error(`Error in getNotifications: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mark a specific notification as read, or mark all as read if no ID provided
 */
export const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        if (notificationId) {
            const notif = await notificationModel.findOneAndUpdate(
                { _id: notificationId, user: req.user.id },
                { read: true },
                { new: true }
            );

            if (!notif) {
                return res.status(404).json({ success: false, message: "Notification not found" });
            }

            return res.status(200).json({ success: true, data: notif });
        } else {
            // Mark all as read
            await notificationModel.updateMany(
                { user: req.user.id, read: false },
                { read: true }
            );

            return res.status(200).json({ success: true, message: "All notifications marked as read" });
        }
    } catch (error) {
        logger.error(`Error in markAsRead: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        const notif = await notificationModel.findOneAndDelete({
            _id: notificationId,
            user: req.user.id
        });

        if (!notif) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        logger.error(`Error in deleteNotification: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
