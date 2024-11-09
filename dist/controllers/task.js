import prisma from "../DB/dbconfig.js";
import { calculateEquity } from "./equity.js";
export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, status, priority, deadline } = req.body;
        const assignedBy = req.user.id; // Get the ID of the user assigning the task from the authenticated user
        // Validate required fields
        if (!title || !description || !assignedTo || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Title, description, assignedTo, and deadline are required.",
            });
        }
        // Create a new task using Prisma
        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedToId: Number(assignedTo),
                assignedById: Number(assignedBy),
                status,
                priority,
                deadline: new Date(deadline),
            },
        });
        // Create a notification for the user assigned to the task
        //   await prisma.notification.create({
        //     data: {
        //       recipientId: Number(assignedTo), // The user who will receive the notification
        //       senderId: Number(assignedBy), // The user who assigned the task
        //       message: `You have been assigned a new task: ${title}`,
        //     },
        //   });
        // Fetch the emails of the assigned user and the user who assigned the task
        // const assignedUser = await prisma.user.findUnique({ where: { id: Number(assignedTo) } });
        // const assignerUser = await prisma.user.findUnique({ where: { id: Number(assignedBy) } });
        // Send email notifications to both the assigned user and the assigner
        //   if (assignedUser && assignedUser.email && assignerUser && assignerUser.email) {
        //     await sendTaskAssignmentEmails(
        //       assignedUser.email,
        //       assignerUser.email,
        //       task,
        //       assignerUser,
        //       assignedUser
        //     );
        //   }
        return res.status(201).json({
            success: true,
            task,
            message: "Task created, assigned successfully, and email notifications sent to both users.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignedTo: {
                    select: { email: true }, // Select specific fields to include
                },
                assignedBy: {
                    select: { email: true }, // Select specific fields to include
                },
            },
            orderBy: {
                createdAt: "desc", // Sort tasks by creation date in descending order
            },
        });
        return res.status(200).json({
            success: true,
            tasks,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params; // Get the task ID from request parameters
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                assignedTo: {
                    select: { username: true } // Include only the username field
                },
                assignedBy: {
                    select: { username: true } // Include only the username field
                }
            }
        });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }
        return res.status(200).json({
            success: true,
            task
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params; // Get the task ID from request parameters
        const { assignedTo, ...otherUpdates } = req.body; // Destructure to separate `assignedTo`
        const taskStatus = req.body.status;
        const data = { ...otherUpdates }; // Include all other updates initially
        // Conditionally add `assignedTo` relation if provided
        if (assignedTo) {
            data['assignedTo'] = { connect: { id: assignedTo } };
        }
        // Perform the update
        const task = await prisma.task.update({
            where: { id: parseInt(id, 10) },
            data: { status: taskStatus },
        });
        if (task.status == "COMPLETED") {
            await prisma.user.update({
                where: { id: parseInt(id, 10) },
                data: {
                    tasksCompleted: {
                        increment: 1, // Increment the tasksCompleted by 1
                    },
                },
            });
        }
        console.log("f ");
        await calculateEquity();
        return res.status(200).json({
            success: true,
            task,
            message: "Task updated successfully."
        });
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params; // Get the task ID from request parameters
        // Delete the task
        await prisma.task.delete({
            where: { id: parseInt(id, 10) }
        });
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully."
        });
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Task not found."
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
