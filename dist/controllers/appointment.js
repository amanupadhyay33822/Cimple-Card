import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/mailSender.js";
const prisma = new PrismaClient();
// Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });
// // Function to send an email
// async function sendEmail(appointmentDetails: {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   message: string;
// }) {
//   const mailOptions = {
//     from: "your-email@example.com", // Replace with your email
//     to: appointmentDetails.email,
//     subject: "Appointment Confirmation",
//     text: `Dear ${appointmentDetails.name},
// Thank you for scheduling an appointment. Below are the details:
// - **Phone Number:** ${appointmentDetails.phoneNumber}
// - **Message:** ${appointmentDetails.message || "N/A"}
// Please contact us if you have any questions.
// Best regards,  
// Your Company`,
//   };
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.error("Error sending email: ", error);
//   }
// }
// Controller for creating an appointment
export const createAppointment = async (req, res) => {
    try {
        const { name, phoneNumber, email, message } = req.body;
        // Create a new appointment in the database
        const newAppointment = await prisma.appointment.create({
            data: {
                name,
                phoneNumber,
                email,
                message,
                userId: 1,
            },
        });
        // Send confirmation email
        await sendEmail(newAppointment);
        return res.status(201).json({
            success: true,
            message: "Appointment created successfully!",
            appointment: newAppointment,
        });
    }
    catch (error) {
        console.error("Error creating appointment:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// Controller for retrieving all appointments
export const getAllAppointments = async (req, res) => {
    try {
        // Ensure the user is authenticated
        const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in to access your appointments.",
            });
        }
        // Fetch appointments only for the logged-in user
        const appointments = await prisma.appointment.findMany({
            where: {
                userId: userId, // Assuming the `appointment` table has a `userId` field
            },
        });
        return res.status(200).json({
            success: true,
            appointments,
            message: "Appointments retrieved successfully.",
        });
    }
    catch (error) {
        console.error("Error retrieving appointments:", error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID from URL params
        const { name, phoneNumber, email, message } = req.body;
        // Get the logged-in user's ID from the request (e.g., from JWT token)
        const userId = req.user?.id; // Assuming req.user contains authenticated user data
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Fetch the appointment to check if it belongs to the logged-in user
        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
        });
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }
        // Check if the appointment belongs to the logged-in user
        if (appointment.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own appointments",
            });
        }
        // Update the appointment in the database
        const updatedAppointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: { name, phoneNumber, email, message },
        });
        return res.status(200).json({
            success: true,
            message: "Appointment updated successfully!",
            appointment: updatedAppointment,
        });
    }
    catch (error) {
        console.error("Error updating appointment:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
// Controller for deleting an appointment
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID from URL params
        // Get the logged-in user's ID from the request (e.g., from JWT token)
        const userId = req.user?.id; // Assuming req.user contains authenticated user data
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        // Fetch the appointment to check if it belongs to the logged-in user
        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
        });
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }
        // Check if the appointment belongs to the logged-in user
        if (appointment.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own appointments",
            });
        }
        // Delete the appointment from the database
        await prisma.appointment.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully!",
        });
    }
    catch (error) {
        console.error("Error deleting appointment:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
