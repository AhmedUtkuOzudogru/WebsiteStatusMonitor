import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE, WEBSITE_DOWN_WARNING_TEMPLATE
} from "../emailTemplates/emailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',  // or another email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendVerificationEmail = async (email, verificationToken, username) => {
    if (typeof email !== 'string' || typeof verificationToken !== 'string') {
        throw new Error('Invalid input types');
    }

    if (typeof VERIFICATION_EMAIL_TEMPLATE !== 'function') {
        throw new Error('VERIFICATION_EMAIL_TEMPLATE is not a function');
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: VERIFICATION_EMAIL_TEMPLATE(verificationToken, username)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};
export const sendPasswordResetEmail = async (email, resetPasswordToken) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password',
        html: PASSWORD_RESET_REQUEST_TEMPLATE(resetPasswordToken)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset password email sent successfully');
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to reset password email');
    }
};
export const sendResetPasswordSuccessEmail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password Successful',
        html: PASSWORD_RESET_SUCCESS_TEMPLATE()
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset password confirmation  sent successfully');
    } catch (error) {
        console.error('Error sending reset password confirmation email:', error);
        throw new Error('Failed to reset password confirmation email');
    }

};
export const sendWebsiteDownWarningEmail = async (email, domainName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Warning: Your Website is Down',
        html: WEBSITE_DOWN_WARNING_TEMPLATE(domainName)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Website down warning email sent successfully');
    } catch (error) {
        console.error('Error sending website down warning email:', error);
        throw new Error('Failed to send website down warning email');
    }
};