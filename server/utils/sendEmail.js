import nodemailer from "nodemailer"
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid"
import { hashString } from "./index.js";
import Verification from "../models/emailVerification.js";
import passwordReset from "../models/passwordReset.js";

dotenv.config()




    const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
          auth: {
            user: process.env. AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD,
          },
        });
export const sendVerificationEmail = async (user, res) => {
    const { _id, email, firstName } = user
  

    const token = _id + uuidv4();
    const link = process.env.APP_URL + "users/verify/" + _id + "/" + token;
    console.log("link ",link)

     const mailOption = {
          from: 'riofashionstoreeco@gmail.com',
          to: email,
          subject: 'Account Verification',
          text: `Hi, ${firstName}, Thank you for Choosing You&Me. Please enter the OTP to verify your account, 
          Verification link :${link}`,
        };
  try {
    const hashToken = await hashString(token)
    const newVerifiedEmail = await Verification.create({
        userId: _id,
        token: hashToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
    })

    if (newVerifiedEmail) {
       transporter.sendMail(mailOption)
            .then(() => {
                res.status(201).send({
                    success: "PENDING",
                    message: "Verification email has been sent to your account. Check your email for verification"
                });
            })
            .catch((err) => {
                console.error("Error sending email:", err); // Log the error
                res.status(500).json({ message: "Failed to send email" });
            });
    }
} catch (error) {
    console.error("Error in verification process:", error); // Log the error
    res.status(500).json({ message: "Something went wrong" });
}


    
    
}


export const resetPasswordLink = async (user, res) => {
    
    const { _id, email } = user
    const token = _id + uuidv4();
    const link = process.env.APP_URL + "users/reset-password/" + _id + "/" + token;
      const mailOption = {
          from: 'riofashionstoreeco@gmail.com',
          to: email,
          subject: 'Account Verification',
          text: `Hi,  Thank you for Choosing You&Me. Please enter the OTP to verify your account, 
          Verification link :${link}`,
    };
    try {

        const hashedToken = await hashString(token)
        const resetEmail = await passwordReset.create({
            
            userId: _id,
            email: email,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt:Date.now()+600000
        })

        if (resetEmail) {
            transporter.sendMail(mailOption)
            .then(() => {
                res.status(201).send({
                    success: "PENDING",
                    message: "Reset password link has been sent to your account"
                });
            })
            .catch((err) => {
                console.error("Error sending email:", err); // Log the error
                res.status(500).json({ message: "Failed to send email" });
            });

            
        }
        
    } catch (error)
    {
        console.log(error)
    }

}