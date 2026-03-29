import { NextRequest, NextResponse } from "next/server";
import { sendDgaNotification } from "../../lib/notification";
import type { Data, Request } from "../../types/notification";

// API Route สำหรับรับคำขอส่ง Notification จาก Front-end
export async function POST(req: NextRequest) {
  try {
    // รับ Body จาก Request และแปลงเป็น JSON
    const body: Request = await req.json();

    // หาก body,data ไม่ใช่ Array หรือ ไม่มีข้อมูล ให้ตอบกลับด้วย Error
    if (!Array.isArray(body.data) || body.data.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Data is required" },
        { status: 400 }
      );
    }

    // หาก Data มีข้อมูลมากกว่า 1000 รายการ ให้ตอบกลับด้วย Error
    if (body.data.length > 1000) {
      return NextResponse.json(
        { ok: false, message: "Data จำกัดไม่เกิน 1000 รายการต่อ request" },
        { status: 400 }
      );
    }

    // ตรวจสอบแต่ละ item ใน Data ว่ามี userId และ message หรือไม่ หากไม่ให้ตอบกลับด้วย Error
    const invalidIndex = body.data.findIndex(
      (item) => !item.userId?.trim() || !item.message?.trim()
    );

    // หากพบ item ที่ไม่ถูกต้อง ให้ตอบกลับด้วย Error พร้อมระบุ index ของ item ที่ผิดพลาด
    if (invalidIndex !== -1) {
      return NextResponse.json(
        {
          ok: false,
          message: `Data[${invalidIndex}] must contain userId and message`,
        },
        { status: 400 }
      );
    }

    // เอา body.data มาวนทีละรายการด้วย map() สร้าง array ใหม่ชื่อ items
    const items: Data[] = body.data.map((item) => ({
      userId: item.userId.trim(), // ตัดช่องว่างหน้า-หลังด้วย trim()
      message: item.message.trim(), // ตัดช่องว่างหน้า-หลังด้วย trim()
    }));

    // เรียกใช้ Function sendDgaNotification จาก lib
    const result = await sendDgaNotification(
      {
        appId: body.appId, // รับ appId จาก body หรือใช้ค่า default จาก env
      },
      items, // ส่ง items ที่ได้จากการ map() ไปยัง Function
      body.sendDateTime ?? null // ส่ง sendDateTime จาก body หรือใช้ค่า null หากไม่มี
    );

    // หากส่งสำเร็จ ให้ตอบกลับด้วย token และข้อมูล response จาก API
    return NextResponse.json({
      ok: true,
      token: result.token,
      notifyData: result.data,
    });
  } catch (error) {

    // หากไม่สำเร็จ ให้ตอบกลับด้วย Error และสถานะ 500
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}