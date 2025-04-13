"use client";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { publicFetch } from "@/lib/fetcher";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const { loading, shouldRender } = useRedirectIfAuthenticated("/");
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    const res = await publicFetch("/password-reset/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier }),
    });

    if (res.ok) {
      setMessage("パスワードリセット用のメールを送信しました。");
      setIdentifier("");
    } else {
      const data = await res.json();
      setError(data.error || "送信に失敗しました");
    }
  };
  if (loading || !shouldRender) return null;
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          パスワードを忘れた方
        </Typography>

        <Typography variant="body2" mb={2}>
          登録済みのメールアドレスまたはユーザー名を入力してください。
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="メールアドレスまたはユーザー名"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!identifier}
          >
            送信する
          </Button>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
}
