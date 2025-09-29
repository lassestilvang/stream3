// app/auth/verify/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully! You can now sign in.");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="max-w-md w-full space-y-8 p-8 bg-background rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Email Verification</h1>

        {status === "loading" && (
          <div>
            <p className="text-muted-foreground mb-4">Verifying your email...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {status === "success" && (
          <div>
            <p className="text-green-600 mb-4">{message}</p>
            <Button onClick={() => router.push("/auth/signin")}>
              Go to Sign In
            </Button>
          </div>
        )}

        {status === "error" && (
          <div>
            <p className="text-red-600 mb-4">{message}</p>
            <Button onClick={() => router.push("/auth/signup")}>
              Back to Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}