import type { GdxAuthResponse, NotificationResponse } from "../types/notification";

export async function sendDgaNotification(params: {
    userId: string;
    message: string;
}) {
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

    const authRes = await fetch(
        `${process.env.GDX_AUTH_URL}?ConsumerSecret=${encodeURIComponent(
            process.env.DGA_CONSUMER_SECRET || ""
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

    const token = authData.Result;

    const res = await fetch(process.env.NOTIFICATION_API_URL || "", {
        method: "POST",
        headers: {
            "Consumer-Key": process.env.DGA_CONSUMER_KEY || "",
            "Content-Type": "application/json",
            Token: token,
        },
        body: JSON.stringify({
            appId: process.env.APP_ID || "",
            data: [
                {
                    userId: params.userId,
                    message: params.message,
                },
            ],
        }),
        cache: "no-store",
    });

    const data: NotificationResponse = await res.json();

    if (!res.ok) {
        throw new Error("Send notification failed");
    }

    return { token, data };
}