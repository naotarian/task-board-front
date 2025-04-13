"use client";

import { useUser } from "@/context/UserContext";

export const useLogout = () => {
  const { setUser } = useUser();

  const logout = (onAfterLogout?: () => void) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    if (onAfterLogout) onAfterLogout();
    window.location.href = "/login";
  };

  return logout;
};
