"use client";

import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { SyntheticEvent } from "react";
import type { Response } from "../app/types/notification";

function NotificationPage() {
  const [userIds, setUserIds] = useState<string[]>([""]);
  const [message, setMessage] = useState("");
  const [sendDateTime, setSendDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  // แสดง Response
  const [result, setResult] = useState<Response | null>(null);

  // แสดง Error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function addUser() {
    setUserIds((prev) => [...prev, ""]);
  }

  function updateUser(index: number, value: string) {
    setUserIds((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function removeUser(index: number) {
    setUserIds((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const trimmedMessage = message.trim();
      const users = userIds.map((id) => id.trim()).filter(Boolean);

      if (!trimmedMessage) {
        setErrorMessage("กรุณากรอกข้อความ");
        return;
      }

      if (users.length === 0) {
        setErrorMessage("กรุณากรอก User ID อย่างน้อย 1 รายการ");
        return;
      }

      if (users.length > 1000) {
        setErrorMessage("ส่งได้ไม่เกิน 1000 User ต่อครั้ง");
        return;
      }

      const formattedSendDateTime = sendDateTime
        ? `${sendDateTime}:00+07:00`
        : null;

      const body = {
        data: users.map((id) => ({
          userId: id,
          message: trimmedMessage,
        })),
        sendDateTime: formattedSendDateTime,
      };

      const res = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message ?? "ส่ง Notification ไม่สำเร็จ");
        return;
      }

      const notifyResponse = data as Response;

      setResult(notifyResponse);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Notification Inbox
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>

              <button
                type="button"
                onClick={addUser}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
              >
                <FiPlus className="text-base" />
                เพิ่ม User
              </button>
            </div>

            <div className="space-y-3">
              {userIds.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`User ID #${index + 1}`}
                    value={value}
                    onChange={(e) => updateUser(index, e.target.value)}
                    className="w-full rounded-xl border px-3 py-2.5 outline-none transition focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => removeUser(index)}
                    disabled={userIds.length === 1}
                    className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-xl border text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Remove user ${index + 1}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              placeholder="กรอกข้อความที่ต้องการส่ง"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl border px-3 py-2.5 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Send Date Time
            </label>
            <input
              type="datetime-local"
              value={sendDateTime}
              onChange={(e) => setSendDateTime(e.target.value)}
              className="w-full rounded-xl border px-3 py-2.5 outline-none transition focus:border-blue-500"
            />
            <p className="text-xs text-gray-500">
              ถ้าไม่ระบุเวลา ระบบจะส่งทันที
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {result && (
            <pre className="overflow-auto rounded-xl bg-gray-100 p-4 text-xs text-gray-800">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </form>
      </div>
    </main>
  );
}

export default NotificationPage;