import { NextResponse, NextRequest } from "next/server";
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10s')
});

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
    return NextResponse.json({ ip })
}