import { NextRequest, NextResponse } from "next/server";
import { sendDgaNotification } from "../../lib/notification";
import type { NotificationItem, NotificationRequest } from "../../types/notification";

export async function POST(req: NextRequest) {
  try {
    const body: NotificationRequest = await req.json();

    if (!Array.isArray(body.Data) || body.Data.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Data is required" },
        { status: 400 }
      );
    }

    if (body.Data.length > 1000) {
      return NextResponse.json(
        { ok: false, message: "Data จำกัดไม่เกิน 1000 รายการต่อ request" },
        { status: 400 }
      );
    }

    const invalidIndex = body.Data.findIndex(
      (item) => !item.UserId?.trim() || !item.Message?.trim()
    );

    if (invalidIndex !== -1) {
      return NextResponse.json(
        {
          ok: false,
          message: `Data[${invalidIndex}] must contain UserId and Message`,
        },
        { status: 400 }
      );
    }

    const items: NotificationItem[] = body.Data.map((item) => ({
      UserId: item.UserId.trim(),
      Message: item.Message.trim(),
    }));

    const result = await sendDgaNotification(
      {
        AppId: body.AppId,
      },
      items,
      body.SendDateTime ?? null
    );

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