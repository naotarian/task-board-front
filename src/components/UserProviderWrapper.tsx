"use client";

import { useRequireVerified } from "@/hooks/useRequireVerified";
import { UserProvider } from "@/context/UserContext";

export const UserProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { shouldRender } = useRequireVerified();

  return <UserProvider>{shouldRender ? children : null}</UserProvider>;
};
