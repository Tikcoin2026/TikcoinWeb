"use client";

import { useRouter } from "next/navigation";

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

export default function PaymentSuccessPage() {
  const router = useRouter();

  const handleLoginWithTikTok = () => {
    // Clear selected order, keep token, go back to login for TikTok re-auth
    localStorage.removeItem("selected_order");
    router.push("/login");
  };

  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6 pb-16">
      <div className="flex flex-col items-center text-center gap-3 mb-12">
        <h1 className="text-2xl font-bold text-gray-900">Successful</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[260px]">
          Your payment is successful!
          <br />
          Authorize your TikTok account to complete order
        </p>
      </div>

      <div className="w-full">
        <button
          type="button"
          onClick={handleLoginWithTikTok}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-semibold text-base active:opacity-80 transition-opacity"
          style={{ backgroundColor: "#E23F5F" }}
        >
          <TikTokIcon size={20} color="#fff" />
          Login with TikTok
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
