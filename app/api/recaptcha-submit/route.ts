import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;
    const postData = await request.json();
    const { gRecaptchaToken } = postData;

    let res;
    
    const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;

    try {
        res = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
    } catch (e) {
        return NextResponse.json({ success: false, message: "Failed to verify reCAPTCHA: " + e }, { status: 500 });
    }

    if (res?.data?.success && res.data?.score > 0.5) {
        console.log(`reCAPTCHA verification successful: ${res.data.score}`);
        return NextResponse.json({ success: true, message: "reCAPTCHA verification successful", score: res.data.score }, { status: 200 });
    } else {
        console.log(`reCAPTCHA verification failed: ${res.data.score}`);
        return NextResponse.json({ success: false, message: "reCAPTCHA verification failed", score: res.data.score }, { status: 400 });
    }
}