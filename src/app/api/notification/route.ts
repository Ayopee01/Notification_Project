import { NextRequest, NextResponse } from "next/server";
import { sendDgaNotification } from "../../lib/notification";
import type { NotificationItem,RequestBody } from "../../types/notification";

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();

        let items: NotificationItem[] = [];

        // Batch mode
        if (Array.isArray(body.data)) {
            if (body.data.length === 0) {
                return NextResponse.json(
                    { ok: false, message: "data is required" },
                    { status: 400 }
                );
            }

            const invalidIndex = body.data.findIndex(
                (item) => !item.userId?.trim() || !item.message?.trim()
            );

            if (invalidIndex !== -1) {
                return NextResponse.json(
                    {
                        ok: false,
                        message: `data[${invalidIndex}] must contain userId and message`,
                    },
                    { status: 400 }
                );
            }

            items = body.data.map((item) => ({
                userId: item.userId.trim(),
                message: item.message.trim(),
            }));
        } else {
            // Single mode
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

            items = [
                {
                    userId: body.userId.trim(),
                    message: body.message.trim(),
                },
            ];
        }

        const result = await sendDgaNotification({
            appId: body.appId,
            data: items,
            sendDateTime: body.sendDateTime ?? null,
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