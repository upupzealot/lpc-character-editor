import type { TileData, ItemTile } from '@/components/item/maker/Util'
import { parsePoints, parseRect } from '@/components/item/maker/Util'

export async function makeItemTile(
  size: number,
  miniImage: HTMLImageElement | HTMLCanvasElement,
  miniDataImage: HTMLImageElement,
): Promise<ItemTile> {
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.style.imageRendering = 'pixelated'
  canvas.width = size * 4
  canvas.height = size * 4
  const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

  const dataCanvas = document.createElement('canvas') as HTMLCanvasElement
  dataCanvas.style.imageRendering = 'pixelated'
  dataCanvas.width = size * 4
  dataCanvas.height = size * 4
  const dataG2d = dataCanvas.getContext('2d') as CanvasRenderingContext2D

  function draw(s: number, d: number, scaleX: number, rotate: number) {
    const x = d % 4
    const y = Math.floor(d / 4)
    g2d.save()
    g2d.translate(size * (x + 0.5), size * (y + 0.5))
    g2d.scale(scaleX, 1)
    g2d.rotate((Math.PI / 4) * rotate)
    g2d.drawImage(
      miniImage,
      s * size,
      0,
      size,
      size,
      -0.5 * size,
      -0.5 * size,
      size,
      size,
    )
    g2d.restore()

    dataG2d.save()
    dataG2d.translate(size * (x + 0.5), size * (y + 0.5))
    dataG2d.scale(scaleX, 1)
    dataG2d.rotate((Math.PI / 4) * rotate)
    dataG2d.drawImage(
      miniDataImage,
      s * size,
      0,
      size,
      size,
      -0.5 * size,
      -0.5 * size,
      size,
      size,
    )
    dataG2d.restore()
  }

  draw(0, 0, 1, 0)
  draw(0, 1, -1, 0)
  draw(0, 2, 1, 2)
  draw(0, 3, -1, -2)
  draw(0, 4, 1, 4)
  draw(0, 5, -1, 4)
  draw(0, 6, 1, 6)
  draw(0, 7, -1, -6)

  draw(1, 8, 1, 0)
  draw(1, 9, -1, 2)
  draw(1, 10, 1, 2)
  draw(1, 11, -1, 0)
  draw(1, 12, 1, 4)
  draw(1, 13, -1, -2)
  draw(1, 14, 1, 6)
  draw(1, 15, -1, -4)

  const image = new Image(canvas.width, canvas.height)
  image.src = canvas.toDataURL('image/png')
  image.style.imageRendering = 'pixelated'

  const dataImage = new Image(dataCanvas.width, dataCanvas.height)
  await new Promise((resolve) => {
    dataImage.onload = resolve
    dataImage.src = dataCanvas.toDataURL('image/png')
  })
  dataImage.style.imageRendering = 'pixelated'

  const data = getTileData(size, image, dataImage)

  return {
    image,
    imageUrl: canvas.toDataURL(),
    dataImage,
    dataImageUrl: dataCanvas.toDataURL(),
    data,
  }
}

export function getTileData(
  size: number,
  image: HTMLImageElement,
  dataImage: HTMLImageElement,
): TileData {
  const framePoints = parsePoints(size, dataImage)
  const frameRects = parseRect(size, image)
  const data = framePoints.map((point, i) => {
    return {
      point,
      rect: frameRects[i],
    }
  })
  return data
}
