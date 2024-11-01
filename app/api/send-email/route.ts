import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { sendEmail } from '@/lib/send-email';

// Create a new ratelimit instance
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(3, '60s')
});

type Data = {
    success: boolean;
    message: string;
};

// Define the runtime as nodejs for the function and export
export const runtime = "nodejs";

// Define the POST method for the function to send an email
export async function POST(req: NextRequest) {

    // Get the IP address of where the request is coming from
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

    // Get the rate limit information for the IP address
    const { limit, reset, remaining } = await ratelimit.limit(ip)

    // Check if the rate limit has been exceeded otherwise send the email
    if (remaining === 0) {
        return NextResponse.json({
            error: 'Rate limit exceeded',
            limit,
            reset,
            remaining
        }, {
            status: 429,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString()
            }
        })
    } else {

        // Get the email information from the request
        const { from, subject, body, html } = await req.json();

        // Check if the required fields are present
        if (!from || !subject || (!body && !html)) {
            return NextResponse.json<Data>(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send the email using the nodemailer transporter
        try {
            await sendEmail({ from, subject, body, html });

            return NextResponse.json<Data>(
                { success: true, message: "Email sent successfully" },
                { status: 200 }
            );
        } catch (error) {
            return NextResponse.json<Data>(
                { success: false, message: (error as Error).message.toString() },
                { status: 500 }
            );
        }
    }
}