# DGA Notification API Test Project

โปรเจกต์นี้เป็นระบบทดสอบการส่ง Notification ผ่าน DGA Notification API โดยใช้ Next.js API Route สำหรับรับข้อมูลจาก Front-end หรือ Postman แล้วส่งต่อไปยัง DGA Notification API

Response ที่ส่งกลับจาก `/api/notification` จะเป็นรูปแบบตาม Doc โดยตรง

## 1. Installation

ติดตั้ง Dependencies ของโปรเจกต์

```bash
npm i
```

---

## 2. Environment Variables

สร้างไฟล์ `.env` ที่ root project

ตัวอย่าง:

```env
# Base URLs
GDX_AUTH_URL=https://api.egov.go.th/ws/auth/validate
NOTIFICATION_API_URL=https://api.egov.go.th/ws/dga/czp/uat/v1/core/notification/push

# DGA Keys (TEST)
DGA_CONSUMER_KEY= โปรดระบุ
DGA_CONSUMER_SECRET= โปรดระบุ
DGA_AGENT_ID=8a816448-0207-45f4-8613-65b0ad80afd0
APP_ID= โปรดระบุ
```

คำอธิบาย Environment Variables

| Key | Description |
|---|---|
| `GDX_AUTH_URL` | URL สำหรับตรวจสอบ GDX Authentication |
| `NOTIFICATION_API_URL` | URL สำหรับส่ง Notification |
| `DGA_CONSUMER_KEY` | Consumer Key ที่ได้รับจาก DGA |
| `DGA_CONSUMER_SECRET` | Consumer Secret ที่ได้รับจาก DGA |
| `DGA_AGENT_ID` | Agent ID สำหรับทดสอบบน Localhost |
| `APP_ID` | Application ID สำหรับส่ง Notification |

> หมายเหตุ: ไม่ควร commit ไฟล์ `.env` ขึ้น repository

---

## 3. Run Project

Run Project ใน Development

```bash
npm run dev
```
---

## 4. Request Body สำหรับทดสอบบน Postman

ใช้ Body แบบ `raw` และเลือกชนิดเป็น `JSON`

```json
{
  "appId": "{{T-APP-ID}}",
  "data": [
    {
      "message": "ทดสอบข้อความ",
      "userId": "{{T-MOCK-USERID}}"
    }
  ],
  "sendDateTime": null
}
```
---

## 5. sendDateTime

ถ้าต้องการส่ง Notification ทันที ให้ส่งค่าเป็น `null`

```json
{
  "sendDateTime": null
}
```

ถ้าต้องการตั้งเวลาส่ง ให้ส่งเป็น String ตาม format นี้

```txt
YYYY-MM-DDTHH:mm:ss+07:00
```

ตัวอย่าง:

```json
{
  "sendDateTime": "2021-06-01T19:48:00+07:00"
}
```
---

