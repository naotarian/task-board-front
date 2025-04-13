"use client";

import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { useUser } from "@/context/UserContext";
import { publicFetch, authFetch } from "@/lib/fetcher";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loading, shouldRender } = useRedirectIfAuthenticated("/");
  const { setUser } = useUser();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // 前回のエラークリア

    try {
      const tokenRes = await publicFetch("/token", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!tokenRes.ok) {
        throw new Error(
          "ログインに失敗しました。ユーザー名またはパスワードが正しくありません。"
        );
      }

      const tokenData = await tokenRes.json();
      localStorage.setItem("access_token", tokenData.access);
      localStorage.setItem("refresh_token", tokenData.refresh);

      const meRes = await authFetch("/me", {
        headers: {
          Authorization: `Bearer ${tokenData.access}`,
        },
      });

      if (!meRes.ok) {
        throw new Error("ユーザー情報の取得に失敗しました");
      }

      const me = await meRes.json();

      setUser({
        id: me.id,
        name: me.username,
        verified_at: me.verified_at,
      });

      window.location.href = "/";
      // router.push("/");
    } catch (err: any) {
      setError(err.message || "ログイン中にエラーが発生しました");
    }
  };

  if (loading || !shouldRender) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          ログイン
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="ユーザー名"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button variant="contained" onClick={handleLogin}>
            ログイン
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <a
              href="/forgot-password"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              パスワードをお忘れですか？
            </a>
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <a
              href="/register"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              アカウントをお持ちでない方はこちら
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
