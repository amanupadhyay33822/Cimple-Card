// controllers/breakController.js
import prisma from "../DB/dbconfig.js";
// Create a new break
export const startBreak = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated user
        const { breakType } = req.body; // Extract break type from request body
        // Validate required fields
        if (!breakType) {
            return res.status(400).json({
                success: false,
                message: "Break type is required.",
            });
        }
        const activeBreak = await prisma.break.findFirst({
            where: {
                userId,
                breakEnd: null, // Check if there is an active break (breakEnd is null)
            },
        });
        if (activeBreak) {
            return res.status(400).json({
                success: false,
                message: "You cannot start a new break while you have an active break.",
            });
        }
        // Create a new break record
        const breakRecord = await prisma.break.create({
            data: {
                userId,
                breakStart: new Date(), // Set the current time as break start
                breakType,
            },
        });
        return res.status(201).json({
            success: true,
            break: breakRecord,
            message: "Break started successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// End a break
export const endBreak = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated user
        const { breakId } = req.params; // Extract break ID from request body
        // Validate required fields
        if (!breakId) {
            return res.status(400).json({
                success: false,
                message: "Break ID is required to end the break.",
            });
        }
        // Find the break record by ID
        const breakRecord = await prisma.break.findUnique({
            where: { id: parseInt(breakId) },
        });
        if (!breakRecord) {
            return res.status(404).json({
                success: false,
                message: "Break not found.",
            });
        }
        // Check if the break belongs to the user
        if (breakRecord.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to end this break.",
            });
        }
        if (breakRecord.breakEnd) {
            return res.status(400).json({
                success: false,
                message: "This break has already been ended.",
            });
        }
        // Calculate duration in minutes and update break end time
        const breakEnd = new Date();
        const duration = Math.floor((breakEnd - breakRecord.breakStart) / (1000 * 60));
        const updatedBreak = await prisma.break.update({
            where: { id: parseInt(breakId) },
            data: {
                breakEnd,
                duration,
            },
        });
        return res.status(200).json({
            success: true,
            break: updatedBreak,
            message: "Break ended successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get all breaks for the authenticated user
export const getUserBreaks = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated user
        // Find all breaks for the user
        const breaks = await prisma.break.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, // Sort by most recent first
        });
        return res.status(200).json({
            success: true,
            breaks,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
