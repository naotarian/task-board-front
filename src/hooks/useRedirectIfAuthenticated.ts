"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export const useRedirectIfAuthenticated = (redirectTo = "/") => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (!user.verified_at) {
        console.log("未認証 → メール認証ページにリダイレクト");
        router.replace(`/register/success?username=${user.name}`);
      } else {
        console.log("認証済 → 通常ページにリダイレクト");
        router.replace(redirectTo);
      }
    }
  }, [user, loading, redirectTo, router]);

  return { loading, shouldRender: !user && !loading };
};
