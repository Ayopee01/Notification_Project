import { NextRequest, NextResponse } from "next/server";
import { sendDgaNotification } from "../../lib/notification";
import type { NotificationItem } from "../../types/notification";

export async function POST(req: NextRequest) {
    try {
        const body: NotificationItem = await req.json();

        if (!body.userId?.trim()) {
            return NextResponse.json(
                { ok: false, message: "userId is required" },
                { status: 400 }
            );
        }

        if (!body.message?.trim()) {
            return NextResponse.json(
                { ok: false, message: "message is required" },
                { status: 400 }
            );
        }

        const result = await sendDgaNotification({
            userId: body.userId.trim(),
            message: body.message.trim(),
        });

        return NextResponse.json({
            ok: true,
            token: result.token,
            notifyData: result.data,
        });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}