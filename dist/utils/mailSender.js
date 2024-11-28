import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
// Function to send an email
export const sendEmail = async (appointmentDetails) => {
    try {
        const mailOptions = {
            from: "your-email@example.com", // Replace with your email
            to: appointmentDetails.email,
            subject: "Appointment Confirmation",
            text: `Dear ${appointmentDetails.name},
        
  Thank you for scheduling an appointment. Below are the details:
    
  - Phone Number: ${appointmentDetails.phoneNumber}
  - Message: ${appointmentDetails.message || "N/A"}
    
  Please contact us if you have any questions.
    
  Best regards,  
  Your Company`,
        };
        // Send email using the configured transporter
        const info = await transporter.sendMail(mailOptions);
        // Log the response if successful
        console.log("Email sent successfully:", info.response);
        // Return success status
        return {
            success: true,
            message: "Email sent successfully!",
        };
    }
    catch (error) {
        // Log the error if email sending fails
        console.error("Error sending email:", error);
        // Return error status
        return {
            success: false,
            error: error.message,
        };
    }
};
export const sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: "your-email@example.com", // Replace with your email
            to: email,
            subject: "Your OTP for Verification",
            text: `Dear User,
         Below is your OTP for verification:
      
    - OTP: ${otp}
      
  Please note that this OTP is valid for only 5 minutes. If you did not request this OTP, please ignore this email.
  
  Best regards,  
  Your Company`,
        };
        // Send email using the configured transporter
        const info = await transporter.sendMail(mailOptions);
        // Log the response if successful
        console.log("Email sent successfully:", info.response);
        // Return success status
        return {
            success: true,
            message: "OTP email sent successfully!",
        };
    }
    catch (error) {
        // Log the error if email sending fails
        console.error("Error sending OTP email:", error);
        // Return error status
        return {
            success: false,
            error: error.message,
        };
    }
};
export const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        let info = await transporter.sendMail({
            from: 'StudyNotion - by Abhikant Singh',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info);
        return info;
    }
    catch (error) {
        console.log(error.message);
    }
};
