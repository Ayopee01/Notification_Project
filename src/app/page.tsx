"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { ApiResult } from "../app/types/notification";

type Mode = "single" | "batch";

function NotificationPage() {
  const [mode, setMode] = useState<Mode>("single");
  const [userId, setUserId] = useState("");
  const [batchUserIds, setBatchUserIds] = useState<string[]>([""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  function addBatchUser() {
    setBatchUserIds((prev) => [...prev, ""]);
  }

  function updateBatchUser(index: number, value: string) {
    setBatchUserIds((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function removeBatchUser(index: number) {
    setBatchUserIds((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const trimmedMessage = message.trim();

      if (!trimmedMessage) {
        setResult({
          ok: false,
          message: "กรุณากรอกข้อความ",
        });
        return;
      }

      let payload: Record<string, unknown>;

      if (mode === "single") {
        const trimmedUserId = userId.trim();

        if (!trimmedUserId) {
          setResult({
            ok: false,
            message: "กรุณากรอก User ID",
          });
          return;
        }

        payload = {
          userId: trimmedUserId,
          message: trimmedMessage,
        };
      } else {
        const users = batchUserIds
          .map((id) => id.trim())
          .filter((id) => id.length > 0);

        if (users.length === 0) {
          setResult({
            ok: false,
            message: "กรุณากรอก User ID อย่างน้อย 1 รายการ",
          });
          return;
        }

        payload = {
          data: users.map((id) => ({
            userId: id,
            message: trimmedMessage,
          })),
        };
      }

      const res = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResult = await res.json();
      setResult(data);
    } catch (error) {
      setResult({
        ok: false,
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Notification Sender
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            เลือกโหมดการส่งแบบ Single หรือ Batch
          </p>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              mode === "single"
                ? "bg-blue-600 text-white"
                : "border bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Single
          </button>

          <button
            type="button"
            onClick={() => setMode("batch")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              mode === "batch"
                ? "bg-blue-600 text-white"
                : "border bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Batch
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {mode === "single" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                placeholder="กรอก User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 outline-none transition focus:border-blue-500"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  User IDs
                </label>

                <button
                  type="button"
                  onClick={addBatchUser}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  <FiPlus className="text-base" />
                  เพิ่ม User
                </button>
              </div>

              <div className="space-y-3">
                {batchUserIds.map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`User ID #${index + 1}`}
                      value={value}
                      onChange={(e) => updateBatchUser(index, e.target.value)}
                      className="w-full rounded-xl border px-3 py-2.5 outline-none transition focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() => removeBatchUser(index)}
                      disabled={batchUserIds.length === 1}
                      className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-xl border text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Remove user ${index + 1}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Sending..."
              : mode === "single"
              ? "Send Single"
              : "Send Batch"}
          </button>

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