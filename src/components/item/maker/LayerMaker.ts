import type { TilesetData, DataPoint } from '@/components/item/maker/Util'
import { parsePoints } from '@/components/item/maker/Util'
import { getTilesetData } from '@/components/item/maker/TileMaker'

export async function makeItemLayer(
  size: number,
  bodyHandPointCanvas: HTMLCanvasElement,
  tilesetImageCanvas: HTMLCanvasElement,
  tilesetData: TilesetData | HTMLCanvasElement,
): Promise<{
  tileSize: number
  canvas: HTMLCanvasElement
}> {
  const anchorPoints = parsePoints(size, bodyHandPointCanvas)
  let data: TilesetData
  if (tilesetData instanceof HTMLCanvasElement) {
    data = getTilesetData(size, tilesetImageCanvas, tilesetData)
  } else {
    data = tilesetData
  }
  const padding = getOversizePadding(size, anchorPoints, data)
  const tileSize = size + padding * 2

  const tileWidth = Math.floor(bodyHandPointCanvas.width / size)
  const tileHeight = Math.floor(bodyHandPointCanvas.height / size)
  const tileCount = tileWidth * tileHeight

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = tileWidth * tileSize
  canvas.height = tileHeight * tileSize
  // document.body.prepend(canvas)
  canvas.style.imageRendering = 'pixelated'
  canvas.style.transformOrigin = 'top left'
  canvas.style.transform = 'scale(2,2)'
  const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
  for (let i = 0; i < tileCount; i++) {
    const x = i % tileWidth
    const y = Math.floor(i / tileWidth)

    const handPoint = anchorPoints[i]
    if (!handPoint) continue
    const tileIndex = (handPoint.color[0] - 127) / 8 - 1
    const anchorPoint = data[tileIndex].point
    if (!anchorPoint) continue
    const tx = tileIndex % 4
    const ty = Math.floor(tileIndex / 4)
    g2d.save()
    g2d.translate(
      padding + handPoint.x - anchorPoint.x,
      padding + handPoint.y - anchorPoint.y,
    )
    g2d.drawImage(
      tilesetImageCanvas,
      tx * size,
      ty * size,
      size,
      size,
      x * tileSize,
      y * tileSize,
      size,
      size,
    )
    g2d.restore()
  }

  return {
    tileSize,
    canvas,
  }
}

function getOversizePadding(
  size: number,
  anchorPoints: (DataPoint | null)[],
  tilesetData: TilesetData,
): number {
  const boundingBoxes = anchorPoints.map((handPoint) => {
    if (!handPoint) return null

    const tileIndex = (handPoint.color[0] - 127) / 8 - 1
    const anchorPoint = tilesetData[tileIndex].point
    if (!anchorPoint) return null
    const boundingRect = tilesetData[tileIndex].rect
    if (!boundingRect.count) return null

    const left = handPoint.x - (anchorPoint.x - boundingRect.left)
    const right = handPoint.x + (boundingRect.right - anchorPoint.x)
    const top = handPoint.y - (anchorPoint.y - boundingRect.top)
    const bottom = handPoint.y + (boundingRect.bottom - anchorPoint.y)
    return { left, right, top, bottom }
  })
  let minLeft = NaN
  let maxRight = NaN
  let minTop = NaN
  let maxBottom = NaN
  boundingBoxes.forEach((bb) => {
    if (!bb) return
    const { left, right, top, bottom } = bb
    minLeft = isNaN(minLeft) ? left : Math.min(minLeft, left)
    maxRight = isNaN(maxRight) ? right : Math.max(maxRight, right)
    minTop = isNaN(minTop) ? top : Math.min(minTop, top)
    maxBottom = isNaN(maxBottom) ? bottom : Math.max(maxBottom, bottom)
  })
  const paddingLeft = minLeft < 0 ? Math.abs(minLeft) : 0
  const paddingRight = maxRight >= size ? maxRight - size + 1 : 0
  const paddingTop = minTop < 0 ? Math.abs(minTop) : 0
  const paddingBottom = maxBottom >= size ? maxBottom - size + 1 : 0
  let padding = Math.max(paddingLeft, paddingRight, paddingTop, paddingBottom)
  padding = Math.ceil(padding / 8) * 8
  return padding
}
