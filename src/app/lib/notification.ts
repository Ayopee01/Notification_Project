import type { GdxAuthResponse, Data, Request, Response } from "../types/notification";

export async function sendDgaNotification(
    params: {
        appId?: string;
        mToken?: string;
    },
    data: Data[],
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

    // Step 1: GDX Authentication to get token
    const authRes = await fetch(
        `${process.env.GDX_AUTH_URL}?ConsumerSecret=${encodeURIComponent(
            process.env.DGA_CONSUMER_SECRET || ""
        )}&AgentID=${encodeURIComponent(params.mToken || process.env.DGA_AGENT_ID || "")}` // ใช้ mToken ที่ถูกส่งเข้ามาใน landing url หรือ SessionID, หรือ UserID ของผู้ใช้ เพื่อใช้ tracking เคส ที่อาจจะเกิดขึ้น
        ,
        {
            method: "GET",
            headers: {
                "Consumer-Key": process.env.DGA_CONSUMER_KEY || "",
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    // Check GDX Authentication response
    const authData: GdxAuthResponse = await authRes.json();

    if (!authRes.ok || !authData?.Result) {
        throw new Error("GDX auth failed");
    }

    // ค่า Result จาก GDX Authentication
    const token = authData.Result;

    // Body ที่ API Request มา
    const body: Request = {
        appId: params.appId || process.env.APP_ID || "",
        data: data,
        ...(sendDateTime ? { sendDateTime } : {}),
    };

    // Step 2: Send notification to DGA API
    const res = await fetch(process.env.NOTIFICATION_API_URL || "", {
        method: "POST",
        headers: {
            "Consumer-Key": process.env.DGA_CONSUMER_KEY || "",
            "Content-Type": "application/json",
            Token: token,
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    // Check Notification response
    const responseData: Response = await res.json();

    if (!res.ok) {
        throw new Error(responseData?.message || "Send notification failed");
    }

    // ส่ง token และ response data กลับไปให้ Front-end เพื่อแสดงผลใน Log 
    return { token, data: responseData };
}