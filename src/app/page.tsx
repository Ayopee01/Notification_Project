"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { ApiResult } from "../app/types/notification";

function NotificationPage() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, message }),
      });

      const data: ApiResult = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-4">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-lg border px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send"}
        </button>

        {result && (
          <pre className="overflow-auto rounded-lg bg-gray-100 p-3 text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </form>
    </main>
  );
}

export default NotificationPage