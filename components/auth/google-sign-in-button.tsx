"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase";

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleGoogleSignIn() {
    setLoading(true);
    setMessage("");
    try {
      const firebaseAuth = getFirebaseAuth();
      const result = await signInWithPopup(firebaseAuth, googleProvider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.user.email,
          name: result.user.displayName,
          firebaseUid: result.user.uid,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create session");
      }

      window.location.href = "/todos";
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Google sign-in failed. Check Firebase env."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={loading}
        onClick={handleGoogleSignIn}
      >
        {loading ? "Connecting..." : "Sign in with Google"}
      </Button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
