import type { TilesetData, ItemTileset } from '@/components/item/maker/Util'
import { parsePoints, parseRect } from '@/components/item/maker/Util'

import weaponTransform from '@/components/item/maker/tileset-transform/Weapon.json'
import hairTransform from '@/components/item/maker/tileset-transform/Hair.json'

type TransformData = {
  tileWidth: number
  transform: [number, number, number, number][]
}

const ItemTransformDataMap = {
  weapon: weaponTransform as TransformData,
  hair: hairTransform as TransformData,
} as { [k: string]: TransformData }

export async function makeItemTile(
  partKey: string,
  size: number,
  miniImageCanvas: HTMLCanvasElement,
  miniDataCanvas: HTMLCanvasElement,
): Promise<ItemTileset> {
  const transformData = ItemTransformDataMap[partKey]
  if (!transformData) {
    throw new Error(`Unsuppoted part: ${partKey}`)
  }
  const { transform, tileWidth } = transformData
  const tileCount = transform.length
  const tWidth = tileWidth || tileCount
  const tHeight = Math.ceil(tileCount / tWidth)
  const imageCanvas = document.createElement('canvas') as HTMLCanvasElement

  imageCanvas.style.imageRendering = 'pixelated'
  imageCanvas.width = size * tWidth
  imageCanvas.height = size * tHeight
  const imageG2d = imageCanvas.getContext('2d') as CanvasRenderingContext2D

  const dataCanvas = document.createElement('canvas') as HTMLCanvasElement
  dataCanvas.style.imageRendering = 'pixelated'
  dataCanvas.width = imageCanvas.width
  dataCanvas.height = imageCanvas.height
  const dataG2d = dataCanvas.getContext('2d') as CanvasRenderingContext2D

  function draw(s: number, d: number, scaleX: number, rotate: number) {
    const tileX = d % tWidth
    const tileY = Math.floor(d / tWidth)
    imageG2d.save()
    imageG2d.translate(size * (tileX + 0.5), size * (tileY + 0.5))
    imageG2d.scale(scaleX, 1)
    imageG2d.rotate((Math.PI / 2) * rotate)
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
    dataG2d.translate(size * (tileX + 0.5), size * (tileY + 0.5))
    dataG2d.scale(scaleX, 1)
    dataG2d.rotate((Math.PI / 2) * rotate)
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

  transform.forEach((trans) => {
    draw(...trans)
  })

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
