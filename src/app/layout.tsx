import "./globals.css";
import { ReactNode } from "react";
import { UserProvider } from "@/context/UserContext";
import { Header } from "@/components/Header";
import { CssBaseline } from "@mui/material";
import { UserProviderWrapper } from "@/components/UserProviderWrapper";

export const metadata = {
  title: "TaskBoard",
  description: "MUI × App Router × Context のサンプル",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <UserProvider>
          <CssBaseline />
          <Header />
          <UserProviderWrapper>{children}</UserProviderWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
