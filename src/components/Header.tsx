"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Popover,
  Button,
} from "@mui/material";
import { AccountCircle, Login as LoginIcon } from "@mui/icons-material";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import { useState } from "react";

export const Header = () => {
  const { user, loading } = useUser();
  const logout = useLogout();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleGoLogin = () => {
    router.push("/login");
  };

  const open = Boolean(anchorEl);
  if (loading) return <></>;
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">TaskBoard</Typography>

        <Box display="flex" alignItems="center">
          {user ? (
            <>
              <Tooltip title="アカウントメニュー">
                <IconButton color="inherit" onClick={handleIconClick}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>

              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box sx={{ p: 2, minWidth: 180 }}>
                  <Typography sx={{ mb: 1 }}>
                    {user.name} さんとしてログイン中
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => logout()}
                  >
                    ログアウト
                  </Button>
                </Box>
              </Popover>
            </>
          ) : (
            <Tooltip title="ログイン">
              <IconButton color="inherit" onClick={handleGoLogin}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
