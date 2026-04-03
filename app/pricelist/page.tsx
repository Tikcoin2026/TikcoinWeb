"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Order {
  id: number;
  rate: number;
  amount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

function TikTokIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.93a8.16 8.16 0 0 0 4.77 1.52V7.01a4.85 4.85 0 0 1-1-.32z" />
    </svg>
  );
}

function CoinSmallIcon() {
  return (
    <div className="w-6 h-6 rounded-full bg-[#F5C842] flex items-center justify-center shadow-sm flex-shrink-0">
      <TikTokIcon size={12} color="#E6A800" />
    </div>
  );
}

function formatNGN(amount: number) {
  return `NGN ${amount.toLocaleString("en-NG")}`;
}

export default function PricelistPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    api
      .get("/api/admin/orders")
      .then((res) => {
        setOrders(res.data.data);
      })
      .catch(() => {
        setError("Failed to load packages. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleConfirm = () => {
    if (!selected) return;
    localStorage.setItem("selected_order", JSON.stringify(selected));
    router.push("/confirm");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-gray-400 text-sm animate-pulse">
          Loading packages…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4 px-6">
        <p className="text-gray-500 text-sm text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "#E23F5F" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white flex flex-col px-4 pt-10 pb-28">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Get coins</h1>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-3">
        {orders.map((order) => {
          const isSelected = selected?.id === order.id;
          return (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelected(order)}
              className="flex flex-col items-start gap-1.5 rounded-xl p-2.5 text-left transition-all"
              style={{
                backgroundColor: isSelected ? "#FDEEF2" : "#FFF8ED",
                border: isSelected
                  ? "2px solid #E23F5F"
                  : "2px solid transparent",
              }}
            >
              <CoinSmallIcon />
              <span className="text-sm font-bold text-gray-900 leading-tight">
                {order.amount.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">
                {formatNGN(order.totalAmount)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sticky confirm button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold text-base transition-opacity disabled:opacity-40 active:opacity-80"
          style={{ backgroundColor: "#E23F5F" }}
        >
          Confirm
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
        </button>
      </div>
    </main>
  );
}
