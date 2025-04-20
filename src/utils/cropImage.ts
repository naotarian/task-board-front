export const getCroppedImg = async (
  imageSrc: string,
  crop: { width: number; height: number; x: number; y: number }
): Promise<File> => {
  const image = await createImage(imageSrc)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(new File([blob!], 'cropped.jpg', { type: 'image/jpeg' }))
    }, 'image/jpeg')
  })
}
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = e => reject(e)
  })
