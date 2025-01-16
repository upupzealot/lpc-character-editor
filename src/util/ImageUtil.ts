import type { Color } from '@/components/types'

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onerror = (error) => {
      console.error('image load error', src, error)
      reject(error)
    }
    image.src = src
  })
}

export async function replaceColor(
  image: HTMLImageElement,
  srcPalette: Color[],
  dstPalette: Color[],
) {
  const width = image.naturalWidth
  const height = image.naturalHeight
  const canvas = new OffscreenCanvas(width, height)
  const g2d = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D

  g2d.drawImage(image, 0, 0)
  const imageData = g2d.getImageData(0, 0, width, height)
  const { data } = imageData

  for (let x = 0; x < data.length; x += 4) {
    if (!data[x + 3]) continue
    for (let n = 0; n < srcPalette.length; n++) {
      const srcColor = srcPalette[n]
      const dstColor = dstPalette[n]
      if (
        data[x] === srcColor[0] &&
        data[x + 1] === srcColor[1] &&
        data[x + 2] === srcColor[2]
      ) {
        data[x] = dstColor[0]
        data[x + 1] = dstColor[1]
        data[x + 2] = dstColor[2]
        break
      }
    }
  }

  g2d.putImageData(imageData, 0, 0)
  return canvas
}
