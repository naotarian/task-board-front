"use client";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { publicFetch } from "@/lib/fetcher";

export default function ResetPasswordPage() {
  const { loading, shouldRender } = useRedirectIfAuthenticated("/");
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isValidPassword = /^[a-zA-Z0-9]{8,}$/.test(password);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (!isValidPassword) {
      setError("パスワードの形式が正しくありません");
      return;
    }

    const res = await publicFetch("/password-reset-confirm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        token,
        new_password: password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("パスワードをリセットしました。ログイン画面へ移動します。");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.error || "パスワードのリセットに失敗しました。");
    }
  };

  if (!uid || !token) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">不正なURLです。</Alert>
      </Container>
    );
  }

  if (loading || !shouldRender) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          新しいパスワードを設定
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="新しいパスワード"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            error={!!password && !isValidPassword}
            helperText={
              !!password && !isValidPassword
                ? "半角英数字8文字以上で入力してください"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="確認用パスワード"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            error={!!confirmPassword && password !== confirmPassword}
            helperText={
              !!confirmPassword && password !== confirmPassword
                ? "パスワードが一致しません"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              !isValidPassword
            }
          >
            パスワードを変更する
          </Button>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
}
