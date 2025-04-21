'use client'

import { useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/cropImage'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>画像のトリミング</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[300px] bg-muted rounded-md overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>

        <div className="mt-4">
          <Slider
            value={[zoom]}
            onValueChange={val => setZoom(val[0])}
            min={1}
            max={3}
            step={0.1}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleCropComplete}>トリミングして確定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
