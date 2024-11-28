import prisma from "../DB/dbconfig.js";
import crypto from 'crypto';
import { mailSender } from "../utils/mailSender.js";
import bcrypt from "bcrypt";
export const resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body; // Extract email from the request body
        // Find user by email using Prisma
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.json({
                success: false,
                message: 'Your Email is not registered',
            });
        }
        // Generate a random token using crypto
        const token = crypto.randomBytes(20).toString('hex');
        // Update the user's reset token and expiration time in the database
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetPasswordExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
            },
        });
        // Create the reset password URL
        const url = `http://localhost:3000/update-password/${token}`;
        // Send email with the reset password link
        await mailSender(email, 'Password Reset Link', `Your link for password reset is ${url}. 
        Please click this URL to reset your password.`);
        return res.json({
            success: true,
            message: 'Email sent successfully, please check email and change password',
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;
        // Validation: Check if passwords match
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: 'Passwords do not match',
            });
        }
        // Fetch user details using the token from the database
        const userDetails = await prisma.user.findUnique({
            where: { resetToken: token },
        });
        // If no user found with the given token, it's invalid
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Token is invalid',
            });
        }
        // Check if the token is expired
        if (userDetails.resetPasswordExpires < new Date()) {
            return res.json({
                success: false,
                message: 'Token is expired, please regenerate your token',
            });
        }
        // Hash the new password
        const encryptedPassword = await bcrypt.hash(password, 10);
        // Update the user's password in the database
        await prisma.user.update({
            where: { resetToken: token },
            data: {
                password: encryptedPassword,
                resetToken: null, // Clear the token after password reset
                resetPasswordExpires: null, // Clear expiration time
            },
        });
        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
