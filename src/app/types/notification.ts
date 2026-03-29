
// Type ค่า Result ที่ได้รับในขั้นตอน GDX Authentication
export type GdxAuthResponse = {
  Result?: string;
};

// Type ของ body ที่ api Request มา
export type NotificationRequest = {
  AppId?: string;
  Data: NotificationItem[];
  SendDateTime?: string | null;
};

// Type ข้อมูลใน data ที่ประกอบไปใน body
export type NotificationItem = {
  UserId: string;
  Message: string;
};

// Type response ที่ตอบกลับมาจาก API Notification
export type NotificationResponse = {
  result?: string[];
  requestTimeStamp?: number;
  messageCode?: number;
  message?: string | null;
};

// Type response ที่แสดงไปใน Log ของ Front-end
export type ApiResult = {
  ok: boolean;
  token?: string;
  notifyData?: NotificationResponse;
  message?: string;
};