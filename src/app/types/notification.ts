
// Type ค่า Result ที่ได้รับในขั้นตอน GDX Authentication
export type GdxAuthResponse = {
  Result?: string;
};

// Type ข้อมูลใน Data ที่ประกอบไปใน body
export type Data = {
  userId: string;
  message: string;
};

// Type ของ Body ที่ API Request
export type Request = {
  appId?: string;
  data: Data[];
  sendDateTime?: string | null;
};

// Type ที่ตอบกลับมาจาก API Response
export type Response = {
  result?: string[];
  requestTimeStamp?: number;
  messageCode?: number;
  message?: string | null;
};

// Type route ที่แสดงไปใน Log ของ Front-end
export type ApiResult = {
  ok: boolean;
  token?: string;
  notifyData?: Response;
  message?: string;
};