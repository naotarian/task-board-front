'use client'

import { useRef, useState, ChangeEvent, DragEvent } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Trash2 } from 'lucide-react'
import { ImageCropDialog } from './ImageCropDialog'

type Props = {
  label?: string
  value: File | null
  onChange: (file: File | null) => void
  previewUrl: string | null
  onPreviewChange: (url: string | null) => void
  error?: string
  onError?: (err: string) => void
}

export const ImageUploader = ({
  label = 'プロフィール画像',
  value,
  onChange,
  previewUrl,
  onPreviewChange,
  error,
  onError,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [rawPreview, setRawPreview] = useState<string | null>(null)

  const MAX_FILE_SIZE = 2 * 1024 * 1024

  const validateFile = (file: File): string | null => {
    const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
    const isValidSize = file.size <= MAX_FILE_SIZE
    if (!isValidType) return 'jpg または png の画像を選択してください。'
    if (!isValidSize) return '画像サイズは 2MB 以下にしてください。'
    return null
  }

  const handleRawFile = (file: File | null) => {
    if (!file) return
    const error = validateFile(file)
    if (error) {
      onError?.(error)
      return
    }
    const url = URL.createObjectURL(file)
    onError?.('')
    setRawPreview(url)
    setCropDialogOpen(true)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    e.target.value = ''
    handleRawFile(file)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] || null
    handleRawFile(file)
  }

  const handleCropDone = (file: File) => {
    onChange(file)
    const url = URL.createObjectURL(file)
    onPreviewChange(url)
  }

  const clearImage = () => {
    onChange(null)
    onPreviewChange(null)
    setRawPreview(null)
  }

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Card
        className="p-4 text-center border-dashed border-muted-foreground bg-muted/40 cursor-pointer"
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div className="relative inline-block">
            <Image
              src={previewUrl}
              alt="preview"
              width={200}
              height={120}
              className="rounded border object-cover"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-0 right-0 bg-white/80 hover:bg-white"
              onClick={e => {
                e.stopPropagation()
                clearImage()
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            画像をドラッグ＆ドロップ または クリックして選択（2MB以内の jpg / png）
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={onInputChange}
          className="hidden"
        />
      </Card>
      {error && <Alert variant="destructive">{error}</Alert>}
      {rawPreview && (
        <ImageCropDialog
          open={cropDialogOpen}
          image={rawPreview}
          onClose={() => setCropDialogOpen(false)}
          onComplete={handleCropDone}
        />
      )}
    </div>
  )
}
