"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";

const REDIRECT_URI =
  "https://tikcoinbackend.onrender.com/api/auth/tiktok/callback";

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

function CoinGraphic() {
  return (
    <div className="relative flex items-center justify-center w-52 h-52 rounded-full bg-[#F5C842] shadow-[0_8px_32px_rgba(245,200,66,0.45)]">
      <div className="absolute w-44 h-44 rounded-full bg-[#F8D448] opacity-60" />
      <div className="relative z-10 opacity-40">
        <TikTokIcon size={80} color="#E6A800" />
      </div>
    </div>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [autoLogging, setAutoLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // After TikTok redirects back with ?code=..., auto-call the login endpoint
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const codeVerifier = localStorage.getItem("tiktok_code_verifier");
    if (!codeVerifier) return;

    setAutoLogging(true);

    api
      .post("/api/auth/login", {
        code,
        codeVerifier,
        redirectUri: REDIRECT_URI,
        platform: "WEB",
        fcmToken: "",
      })
      .then((res) => {
        const { accessToken } = res.data.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.removeItem("tiktok_code_verifier");
        router.replace("/pricelist");
      })
      .catch(() => {
        setError("Login failed. Please try again.");
        setAutoLogging(false);
      });
  }, [searchParams, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/auth/tiktok/authorize", {
        params: { redirectUri: REDIRECT_URI },
      });
      const { authUrl, codeVerifier } = res.data.data;
      localStorage.setItem("tiktok_code_verifier", codeVerifier);
      window.location.href = authUrl;
    } catch {
      setError("Failed to connect to TikTok. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center justify-between px-6 py-16">
      {/* Branding */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center">
            <TikTokIcon size={16} color="#000" />
          </div>
          <span className="text-[22px] font-bold tracking-tight text-gray-900">
            TikTok Coin
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Welcome! Login to your account
        </p>
      </div>

      {/* Coin graphic */}
      <div className="flex items-center justify-center">
        {/* Replace <CoinGraphic /> with <Image src="/images/coin.png" width={208} height={208} alt="TikTok Coin" priority /> once you add the asset */}
        <CoinGraphic />
      </div>

      {/* CTA */}
      <div className="w-full flex flex-col items-center gap-3 mb-4">
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading || autoLogging}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-semibold text-base active:opacity-80 transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#E23F5F" }}
        >
          {autoLogging ? (
            <span className="animate-pulse">Logging you in…</span>
          ) : loading ? (
            <span className="animate-pulse">Connecting…</span>
          ) : (
            <>
              <TikTokIcon size={20} color="#fff" />
              Login with TikTok
            </>
          )}
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading…</span>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
