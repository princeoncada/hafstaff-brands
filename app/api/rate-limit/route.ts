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
    const { limit, reset, remaining } = await ratelimit.limit(ip)

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
        return NextResponse.json({ message: "Request Valid" }) // empty response
    }
}