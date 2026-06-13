import callModel from "../../models/hospital/call.model.js";
import logger from "../../config/logger.js";

/**
 * Start or join a call session and log room creation
 */
export const startCall = async (req, res, next) => {
    try {
        const { roomId, appointmentId, participants } = req.body;

        if (!roomId) {
            return res.status(400).json({ success: false, message: "Room ID is required" });
        }

        logger.info(`Starting video call log for room: ${roomId}`);

        // Set participants: include current user and any other participant IDs passed
        const participantSet = new Set(participants || []);
        participantSet.add(req.user.id);

        let callLog = await callModel.findOne({ roomId });

        if (!callLog) {
            callLog = await callModel.create({
                roomId,
                appointment: appointmentId || null,
                participants: Array.from(participantSet),
                startTime: new Date()
            });
        } else {
            // Update participants list if joining
            participants?.forEach(p => {
                if (!callLog.participants.includes(p)) {
                    callLog.participants.push(p);
                }
            });
            await callLog.save();
        }

        res.status(200).json({ success: true, data: callLog });
    } catch (error) {
        logger.error(`Error in startCall: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Log the end of a call session and calculate duration
 */
export const endCall = async (req, res, next) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({ success: false, message: "Room ID is required to end call" });
        }

        logger.info(`Ending video call log for room: ${roomId}`);

        const callLog = await callModel.findOne({ roomId });

        if (!callLog) {
            return res.status(404).json({ success: false, message: "Call log session not found" });
        }

        if (!callLog.endTime) {
            callLog.endTime = new Date();
            const start = new Date(callLog.startTime);
            const end = new Date(callLog.endTime);
            callLog.duration = Math.round((end - start) / 1000); // duration in seconds
            await callLog.save();
        }

        res.status(200).json({ success: true, data: callLog });
    } catch (error) {
        logger.error(`Error in endCall: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Fetch video call logs for the logged-in user
 */
export const getCallHistory = async (req, res, next) => {
    try {
        const history = await callModel.find({ participants: req.user.id })
            .populate("participants", "name email profileImage")
            .populate({
                path: "appointment",
                populate: [{ path: "doctor", select: "name specialization" }, { path: "hospital", select: "name" }]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: history });
    } catch (error) {
        logger.error(`Error in getCallHistory: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
