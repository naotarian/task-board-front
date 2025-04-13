"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const isPasswordValid = /^[a-zA-Z0-9]{8,}$/.test(password);

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    if (!isPasswordValid) {
      setError("パスワードは半角英数字で8文字以上にしてください。");
      return;
    }

    const res = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        password_confirm: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("登録が完了しました。認証メールを送信しました。");
      setTimeout(
        () => router.push(`/register/success?username=${username}`),
        3000
      );
    } else {
      setFieldErrors(data);
      setError("入力内容に誤りがあります。");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          ユーザー登録
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField
            label="ユーザー名 *"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            error={!!fieldErrors.username}
            helperText={fieldErrors.username?.[0]}
          />
          <TextField
            label="メールアドレス *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            error={!!fieldErrors.email}
            helperText={fieldErrors.email?.[0]}
          />
          <TextField
            label="パスワード *（半角英数字8文字以上）"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            error={!!fieldErrors.password || (!!password && !isPasswordValid)}
            helperText={
              fieldErrors.password?.[0] ||
              (!!password && !isPasswordValid
                ? "半角英数字で8文字以上にしてください"
                : "")
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
            label="パスワード（確認用） *"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            error={
              !!fieldErrors.password_confirm ||
              (!!confirmPassword && password !== confirmPassword)
            }
            helperText={
              fieldErrors.password_confirm?.[0] ||
              (!!confirmPassword && password !== confirmPassword
                ? "パスワードが一致しません"
                : "")
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="姓（任意）"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            error={!!fieldErrors.last_name}
            helperText={fieldErrors.last_name?.[0]}
          />
          <TextField
            label="名（任意）"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            error={!!fieldErrors.first_name}
            helperText={fieldErrors.first_name?.[0]}
          />

          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={
              !username ||
              !email ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              !isPasswordValid
            }
          >
            登録する
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
