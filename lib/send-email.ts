import nodemailer from 'nodemailer';

type SendEmailOptions = {
    from: string;
    subject: string;
    body?: string;
    html?: string;
};

export async function sendEmail({ from, subject, body, html }: SendEmailOptions) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT ?? '587', 10),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    
    await transporter.sendMail({
        to: process.env.EMAIL_USER,
        from,
        subject,
        text: body,
        html,
    });
}
