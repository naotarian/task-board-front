'use client'

import Cropper from 'react-easy-crop'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Slider } from '@mui/material'
import { useState } from 'react'
import { getCroppedImg } from '@/utils/cropImage' // ← utils に別ファイルで後述

type Props = {
  open: boolean
  image: string
  onClose: () => void
  onComplete: (file: File) => void
}

export const ImageCropDialog = ({ open, image, onClose, onComplete }: Props) => {
  const [zoom, setZoom] = useState(1)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const handleCropComplete = async () => {
    const croppedFile = await getCroppedImg(image, croppedAreaPixels)
    onComplete(croppedFile)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>画像のトリミング</DialogTitle>
      <DialogContent sx={{ position: 'relative', height: 300 }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3} // 表示比率に合わせて調整可能
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
        />
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(_, value) => setZoom(value as number)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleCropComplete} variant="contained">
          トリミングして確定
        </Button>
      </DialogActions>
    </Dialog>
  )
}
