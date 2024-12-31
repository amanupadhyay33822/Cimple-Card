import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  
  // Function to send an email
  export const sendEmail = async (appointmentDetails: {
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
  }) => {
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
      console.log("Email sent successfully:");
  
      // Return success status
      return {
        success: true,
        message: "Email sent successfully!",
      };
    } catch (error: any) {
      // Log the error if email sending fails
      console.error("Error sending email:", error);
  
      // Return error status
      return {
        success: false,
        error: error.message,
      };
    }
  };

  export const sendOtpEmail = async (email: string, otp: string) => {
    try {
      // Read the HTML file template
      const templatePath = path.join(__dirname, "otp_template.html");
      let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  
      // Replace placeholders in the HTML with dynamic values
      htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);
    

      const mailOptions = {
        from: "your-email@example.com", // Replace with your email
        to: email,
        subject: "Your OTP for Verification",
        html: htmlTemplate, // Use the HTML content
      };
  
      // Send email using the configured transporter
      const info = await transporter.sendMail(mailOptions);
  
      // Log the response if successful
      console.log("Email sent successfully:");
  
      // Return success status
      return {
        success: true,
        message: "OTP email sent successfully!",
      };
    } catch (error: any) {
      // Log the error if email sending fails
      console.error("Error sending OTP email:", error);
  
      // Return error status
      return {
        success: false,
        error: error.message,
      };
    }
  };
  
  export const mailSender = async (email:any, title:any,name:any) => {                            // with the help of this function we send mail of otp;      
    try{

            let transporter = nodemailer.createTransport({                    // we send mail with the help of transporter and here MAIL_USER , MAIL_PASS contain app password of that email which send email 
                host:process.env.MAIL_HOST,                               
                auth:{
                    user: process.env.MAIL_USER,                           
                    pass: process.env.MAIL_PASS,
                }
            })

const templatePath = path.join(__dirname, "signup_template.html");
      let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
      htmlTemplate = htmlTemplate.replace("{{name}}", name);
            let info = await transporter.sendMail({
                from: 'CimpleCard',
                to:`${email}`,
                subject: `${title}`,
                html:htmlTemplate,
            })
            
            return info;
    }
    catch(error:any) {
        console.log(error.message);
    }
}
  

  