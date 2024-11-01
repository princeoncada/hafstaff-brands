import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type Data = {
    success: boolean;
    message: string;
};

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT ?? '587', 10),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export async function POST(request: Request) {
    const { to, subject, body, html } = await request.json();

    if (!to || !subject || (!body && !html)) {
        return NextResponse.json<Data>(
            { success: false, message: "Missing required fields" },
            { status: 400 }
        );
    }

    try {
        // Send the email using the transporter
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender address
            to,                           // List of recipients
            subject,                      // Subject line
            text: body,                   // Plain text body
            html,                         // HTML body
        });

        console.log("Email sent successfully");

        return NextResponse.json<Data>(
            { success: true, message: "Email sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json<Data>(
            { success: false, message: "Failed to send email" },
            { status: 500 }
        );
    }
}