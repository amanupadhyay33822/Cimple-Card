import prisma from "../DB/dbconfig.js";
// Log work hours for a specific date
export const logWorkHours = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated user
        const { date, workSessions } = req.body;
        // Validate required fields
        if (!date || !workSessions || !Array.isArray(workSessions) || workSessions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Date and work sessions are required.",
            });
        }
        // Check for existing work hours for the user on the specified date
        let workingHours = await prisma.workingHours.findFirst({
            where: {
                userId,
                workDate: new Date(date),
            },
            include: {
                workSessions: true, // Include associated work sessions
            },
        });
        if (workingHours) {
            // If a record exists, append new sessions to existing workSessions
            const updatedSessions = await prisma.workSession.createMany({
                data: workSessions.map((session) => ({
                    startTime: new Date(session.startTime),
                    endTime: new Date(session.endTime),
                    workingHoursId: workingHours.id,
                })),
            });
            workingHours = await prisma.workingHours.findUnique({
                where: { id: workingHours.id },
                include: { workSessions: true },
            });
        }
        else {
            // If no record exists, create a new one with associated workSessions
            workingHours = await prisma.workingHours.create({
                data: {
                    userId,
                    workDate: new Date(date),
                    workSessions: {
                        create: workSessions.map((session) => ({
                            startTime: new Date(session.startTime),
                            endTime: new Date(session.endTime),
                        })),
                    },
                },
                include: { workSessions: true },
            });
        }
        return res.status(200).json({
            success: true,
            workingHours,
            message: "Work hours logged successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getWorkHours = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated user
        const { date } = req.query; // Get date from query parameters
        // Validate required fields
        if (!date || typeof date !== "string") {
            return res.status(400).json({
                success: false,
                message: "Date is required and must be a valid string.",
            });
        }
        // Parse the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format.",
            });
        }
        // Fetch working hours for the specific user and date
        const workingHours = await prisma.workingHours.findFirst({
            where: {
                userId,
                workDate: parsedDate, // Use the parsed date
            },
        });
        if (!workingHours) {
            return res.status(404).json({
                success: false,
                message: "No work hours found for the specified date.",
            });
        }
        // Fetch work sessions associated with the workingHours
        const workSessions = await prisma.workSession.findMany({
            where: {
                workingHoursId: workingHours.id, // Use the working hours ID to fetch sessions
            },
            select: {
                startTime: true,
                endTime: true,
            },
        });
        // Calculate total hours worked within the date range
        const totalHoursWorked = await calculateTotalHoursWorked(userId, parsedDate, parsedDate);
        await prisma.user.update({
            where: { id: userId },
            data: {
                totalHoursWorked: {
                    increment: totalHoursWorked // Increment the existing total worked hours
                },
            },
        });
        // Prepare response data
        const formattedSessions = workSessions.map((session) => ({
            startTime: session.startTime,
            endTime: session.endTime,
        }));
        return res.status(200).json({
            success: true,
            workingHours,
            workSessions: formattedSessions,
            totalHoursWorked, // Include total hours worked in the response
            message: "Work hours and sessions retrieved successfully.",
        });
    }
    catch (error) {
        console.error("Error retrieving work hours:", error); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
async function calculateTotalHoursWorked(userId, startDate, endDate) {
    // Fetch all work sessions for the user within the date range
    const workSessions = await prisma.workSession.findMany({
        where: {
            workingHours: {
                userId: userId,
                workDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        },
        select: {
            startTime: true,
            endTime: true
        }
    });
    // Fetch all breaks for the user within the date range
    const breaks = await prisma.break.findMany({
        where: {
            userId: userId,
            breakStart: {
                gte: startDate,
                lte: endDate
            },
            breakEnd: {
                not: null
            }
        },
        select: {
            breakStart: true,
            breakEnd: true
        }
    });
    // Calculate total work session hours
    let totalWorkHours = 0;
    for (const session of workSessions) {
        const sessionStart = new Date(session.startTime);
        const sessionEnd = new Date(session.endTime);
        // Check if sessionEnd is after sessionStart
        if (sessionEnd > sessionStart) {
            const sessionDuration = (sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60 * 60); // Convert ms to hours
            totalWorkHours += sessionDuration;
        }
        else {
            console.warn(`Ignoring invalid work session for user ${userId}: end time is before start time.`);
        }
    }
    // Calculate total break hours
    let totalBreakHours = 0;
    for (const brk of breaks) {
        const breakStart = new Date(brk.breakStart);
        const breakEnd = brk.breakEnd;
        // Check if breakEnd is after breakStart
        // Check if breakEnd is valid (not null) and is after breakStart
        if (breakEnd && breakEnd > breakStart) {
            const breakDuration = (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60 * 60); // Convert ms to hours
            totalBreakHours += breakDuration;
        }
        else {
            console.warn(`Ignoring invalid break for user ${userId}: end time is before start time or is null.`);
        }
    }
    // Calculate net work hours by subtracting break hours from work hours
    const netWorkHours = totalWorkHours - totalBreakHours;
    return netWorkHours;
}
