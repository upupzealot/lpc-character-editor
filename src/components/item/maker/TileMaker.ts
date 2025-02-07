import type { TilesetData, ItemTile } from '@/components/item/maker/Util'
import { parsePoints, parseRect } from '@/components/item/maker/Util'

export async function makeItemTile(
  size: number,
  miniImageCanvas: HTMLCanvasElement,
  miniDataCanvas: HTMLCanvasElement,
): Promise<ItemTile> {
  const imageCanvas = document.createElement('canvas') as HTMLCanvasElement
  imageCanvas.style.imageRendering = 'pixelated'
  imageCanvas.width = size * 4
  imageCanvas.height = size * 4
  const imageG2d = imageCanvas.getContext('2d') as CanvasRenderingContext2D

  const dataCanvas = document.createElement('canvas') as HTMLCanvasElement
  dataCanvas.style.imageRendering = 'pixelated'
  dataCanvas.width = size * 4
  dataCanvas.height = size * 4
  const dataG2d = dataCanvas.getContext('2d') as CanvasRenderingContext2D

  function draw(s: number, d: number, scaleX: number, rotate: number) {
    const x = d % 4
    const y = Math.floor(d / 4)
    imageG2d.save()
    imageG2d.translate(size * (x + 0.5), size * (y + 0.5))
    imageG2d.scale(scaleX, 1)
    imageG2d.rotate((Math.PI / 4) * rotate)
    imageG2d.drawImage(
      miniImageCanvas,
      s * size,
      0,
      size,
      size,
      -0.5 * size,
      -0.5 * size,
      size,
      size,
    )
    imageG2d.restore()

    dataG2d.save()
    dataG2d.translate(size * (x + 0.5), size * (y + 0.5))
    dataG2d.scale(scaleX, 1)
    dataG2d.rotate((Math.PI / 4) * rotate)
    dataG2d.drawImage(
      miniDataCanvas,
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

  const data = getTilesetData(size, imageCanvas, dataCanvas)

  return {
    imageCanvas,
    dataCanvas,
    data,
  }
}

export function getTilesetData(
  size: number,
  imageCanvas: HTMLCanvasElement,
  dataCanvas: HTMLCanvasElement,
): TilesetData {
  const tileRects = parseRect(size, imageCanvas)
  const pivotPoints = parsePoints(size, dataCanvas)
  const data = pivotPoints.map((point, i) => {
    return {
      point,
      rect: tileRects[i],
    }
  })
  return data
}
