import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginClient } from "@/components/LoginClient";

export const metadata: Metadata = {
  title: "로그인",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="px-container-mobile pt-28 text-on-surface-variant">
          로그인 준비 중…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
