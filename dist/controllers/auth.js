import prisma from "../DB/dbconfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        // Check if the required fields are provided
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        // Check if user with the given email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                username: username || null, // Username is optional
                password: hashedPassword,
            },
        });
        // Return success response
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
// // Login route
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Compare the hashed password with the provided password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" } // Set token expiration
        );
        // Set the token in a cookie
        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use 'secure' in production to send cookie only over HTTPS
            // Allows the cookie to be sent with cross-origin requests
        });
        // Return success response
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
export const logout = (req, res) => {
    try {
        // Clear the JWT token cookie by setting it to an empty value and an immediate expiration time
        res.cookie("token", "", {
            maxAge: 0, // Expire immediately
            httpOnly: true, // Prevent access from JavaScript (security measure)
            secure: process.env.NODE_ENV === "production", // Use 'secure' in production to only send cookie over HTTPS
            sameSite: "strict", // Helps prevent CSRF attacks
        });
        // Send response indicating logout was successful
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error during logout" });
    }
};
export const editPartner = async (req, res) => {
    try {
        const { id } = req.params; // Get the partner ID from route parameters
        const { email, username, designation, role } = req.body;
        // Validate input
        if (!email && !username && !designation && !role) {
            return res.status(400).json({ message: "No fields to update" });
        }
        // Update partner details
        const updatedPartner = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                email,
                username,
                designation,
                role,
            },
        });
        return res.status(200).json({ message: "Partner updated successfully", partner: updatedPartner });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error while updating partner" });
    }
};
