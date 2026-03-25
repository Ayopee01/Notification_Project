import type { GdxAuthResponse, NotificationItem, NotificationResponse } from "../types/notification";

export async function sendDgaNotification(
    params: {
        appId?: string;
    },
    data: NotificationItem[],
    sendDateTime?: string | null
) {
    if (
        !process.env.GDX_AUTH_URL ||
        !process.env.NOTIFICATION_API_URL ||
        !process.env.DGA_CONSUMER_KEY ||
        !process.env.DGA_CONSUMER_SECRET ||
        !process.env.DGA_AGENT_ID ||
        !process.env.APP_ID
    ) {
        throw new Error("Missing env config");
    }

    // Step 1 GDX Authentication
    const authRes = await fetch(
        `${process.env.GDX_AUTH_URL}?ConsumerSecret=${encodeURIComponent(
            process.env.DGA_CONSUMER_SECRET || ""
            // ใช้ mToken ที่ถูกส่งเข้ามาใน landing url หรือ SessionID, หรือ UserID ของผู้ใช้ เพื่อใช้ tracking เคส ที่อาจจะเกิดขึ้น
            // จาก Code ขอยกตัวอย่างด้วยการ Fix ค่า AgentID จาก .env
        )}&AgentID=${encodeURIComponent(process.env.DGA_AGENT_ID || "")}`,
        {
            method: "GET",
            headers: {
                "Consumer-Key": process.env.DGA_CONSUMER_KEY || "",
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    const authData: GdxAuthResponse = await authRes.json();

    if (!authRes.ok || !authData?.Result) {
        throw new Error("GDX auth failed");
    }

    // เก็บค่า Result ไว้ในตัวแปร token
    const token = authData.Result;

    // Step 2 Notification
    const res = await fetch(process.env.NOTIFICATION_API_URL || "", {
        method: "POST",
        headers: {
            "Consumer-Key": process.env.DGA_CONSUMER_KEY || "",
            "Content-Type": "application/json",
            Token: token,
        },
        body: JSON.stringify({
            appId: params.appId || process.env.APP_ID || "",
            data,
            sendDateTime: sendDateTime ?? null,
        }),
        cache: "no-store",
    });

    const responseData: NotificationResponse = await res.json();

    if (!res.ok) {
        throw new Error(responseData?.message || "Send notification failed");
    }

    return { token, data: responseData };
}