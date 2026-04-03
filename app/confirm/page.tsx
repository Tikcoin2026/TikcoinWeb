"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Order {
  id: number;
  rate: number;
  amount: number;
  totalAmount: number;
}

function TikTokCoinIcon() {
  return (
    <div className="w-9 h-9 rounded-full bg-[#F5C842] flex items-center justify-center shadow-sm flex-shrink-0">
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="#E6A800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.93a8.16 8.16 0 0 0 4.77 1.52V7.01a4.85 4.85 0 0 1-1-.32z" />
      </svg>
    </div>
  );
}

function formatNGN(amount: number) {
  return `NGN ${amount.toLocaleString("en-NG")}`;
}

export default function ConfirmPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const raw = localStorage.getItem("selected_order");
    if (!raw) {
      router.replace("/pricelist");
      return;
    }

    try {
      setOrder(JSON.parse(raw));
    } catch {
      router.replace("/pricelist");
    }
  }, [router]);

  const handleMakePayment = async () => {
    if (!order) return;
    setLoading(true);
    setError(null);

    const callbackUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/payment/success`
        : "/payment/success";

    try {
      const res = await api.post("/api/payment/initialize", {
        orderId: order.id,
        callbackUrl,
      });
      const { authorizationUrl } = res.data.data;
      window.location.href = authorizationUrl;
    } catch {
      setError("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-gray-400 text-sm animate-pulse">Loading…</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white flex flex-col px-5 pt-12 pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Confirm your order</h1>
        <p className="text-sm text-gray-500 mt-1">
          Verify the package for your order before making payment
        </p>
      </div>

      {/* Order card */}
      <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4">
        <div className="flex items-center gap-3">
          <TikTokCoinIcon />
          <span className="text-lg font-bold text-gray-900">
            {order.amount.toLocaleString()}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-500">
          {formatNGN(order.totalAmount)}
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center mt-4">{error}</p>
      )}

      {/* Make Payment button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleMakePayment}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold text-base transition-opacity disabled:opacity-60 active:opacity-80"
          style={{ backgroundColor: "#E23F5F" }}
        >
          {loading ? (
            <span className="animate-pulse">Processing…</span>
          ) : (
            <>
              Make Payment
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </main>
  );
}
