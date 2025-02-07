import type { TileData, DataPoint } from '@/components/item/maker/Util'
import { parsePoints } from '@/components/item/maker/Util'
import { getTileData } from '@/components/item/maker/TileMaker'

export async function makeItemLayer(
  size: number,
  bodyHandPointImage: HTMLImageElement,
  tileImage: HTMLImageElement,
  tileData: TileData | HTMLImageElement,
): Promise<{
  frameSize: number
  imageUrl: string
}> {
  const frameHandPoints = parsePoints(size, bodyHandPointImage)
  let data
  if (tileData instanceof HTMLImageElement) {
    data = getTileData(size, tileImage, tileData)
  } else {
    data = tileData
  }
  const padding = getOversizePadding(size, frameHandPoints, data)
  const frameSize = size + padding * 2

  const frameWidth = Math.floor(bodyHandPointImage.naturalWidth / size)
  const frameHeight = Math.floor(bodyHandPointImage.naturalHeight / size)
  const frameCount = frameWidth * frameHeight

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = frameWidth * frameSize
  canvas.height = frameHeight * frameSize
  // document.body.prepend(canvas)
  canvas.style.imageRendering = 'pixelated'
  canvas.style.transformOrigin = 'top left'
  canvas.style.transform = 'scale(2,2)'
  const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
  for (let i = 0; i < frameCount; i++) {
    const x = i % frameWidth
    const y = Math.floor(i / frameWidth)

    const handPoint = frameHandPoints[i]
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
      tileImage,
      tx * size,
      ty * size,
      size,
      size,
      x * frameSize,
      y * frameSize,
      size,
      size,
    )
    g2d.restore()
  }

  return {
    frameSize,
    imageUrl: canvas.toDataURL(),
  }
}

function getOversizePadding(
  size: number,
  handPoints: (DataPoint | null)[],
  tileData: TileData,
): number {
  const boundingBoxes = handPoints.map((handPoint) => {
    if (!handPoint) return null

    const tileIndex = (handPoint.color[0] - 127) / 8 - 1
    const anchorPoint = tileData[tileIndex].point
    if (!anchorPoint) return null
    const boundingRect = tileData[tileIndex].rect
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
