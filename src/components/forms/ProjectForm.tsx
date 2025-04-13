"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Alert,
} from "@mui/material";
import { useState, ChangeEvent, FormEvent, DragEvent, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { ImageCropDialog } from "@/components/forms/ImageCropDialog";

export type ProjectFormValues = {
  name: string;
  description: string;
  thumbnail: File | null;
};

type Props = {
  onSubmit: (
    values: ProjectFormValues
  ) => Promise<Record<string, string[]> | null>;
  isSubmitting?: boolean;
};

export const ProjectForm = ({ onSubmit, isSubmitting = false }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawPreview, setRawPreview] = useState<string | null>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const validateFile = (file: File): string | null => {
    const isValidType = ["image/jpeg", "image/png"].includes(file.type);
    const isValidSize = file.size <= MAX_FILE_SIZE;

    if (!isValidType) return "jpg または png の画像を選択してください。";
    if (!isValidSize) return "画像サイズは 2MB 以下にしてください。";
    return null;
  };

  const handleRawFile = (file: File | null) => {
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }

    const url = URL.createObjectURL(file);
    setFileError("");
    setRawPreview(url);
    setCropDialogOpen(true);
  };

  const handleCropDone = (file: File) => {
    setThumbnail(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearThumbnail = () => {
    setThumbnail(null);
    setPreviewUrl(null);
    setRawPreview(null);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    e.target.value = "";
    handleRawFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    handleRawFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    const errors = await onSubmit({ name, description, thumbnail });
    if (errors) {
      setFormErrors(errors);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <TextField
        label="プロジェクト名 *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        error={!!formErrors.name}
        helperText={formErrors.name?.[0]}
      />

      <TextField
        label="説明 (任意)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        fullWidth
        error={!!formErrors.description}
        helperText={formErrors.description?.[0]}
      />

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          textAlign: "center",
          borderStyle: "dashed",
          bgcolor: "#f9f9f9",
          cursor: "pointer",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Image
              src={previewUrl}
              alt="preview"
              width={200}
              height={120}
              style={{ objectFit: "cover", borderRadius: 4 }}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                clearThumbnail();
              }}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: "rgba(255,255,255,0.8)",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Typography color="text.secondary">
            画像をドラッグ＆ドロップ または クリックして選択（2MB以内の jpg /
            png）
          </Typography>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={onInputChange}
          style={{ display: "none" }}
        />
      </Paper>

      {fileError && <Alert severity="error">{fileError}</Alert>}

      <Button type="submit" variant="contained" disabled={isSubmitting}>
        作成する
      </Button>

      {/* ✂️ トリミング用モーダル */}
      {rawPreview && (
        <ImageCropDialog
          open={cropDialogOpen}
          image={rawPreview}
          onClose={() => setCropDialogOpen(false)}
          onComplete={handleCropDone}
        />
      )}
    </Box>
  );
};
