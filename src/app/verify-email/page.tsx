"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Alert,
  Button,
} from "@mui/material";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!uid || !token) {
      setStatus("error");
      setErrorMessage("URLが無効です。");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/verify-email/?uid=${uid}&token=${token}`
        );
        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json();
          setStatus("error");
          setErrorMessage(data.error || "認証に失敗しました。");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("サーバーへの接続に失敗しました。");
      }
    };

    verifyEmail();
  }, [uid, token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        {status === "loading" && (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        {status === "success" && (
          <>
            <Typography variant="h5" gutterBottom>
              メールアドレスの認証が完了しました 🎉
            </Typography>
            <Button variant="contained" onClick={() => router.push("/login")}>
              ログイン画面へ
            </Button>
          </>
        )}
        {status === "error" && <Alert severity="error">{errorMessage}</Alert>}
      </Paper>
    </Container>
  );
}
