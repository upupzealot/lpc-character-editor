import { loadCanvas } from '@/util/GraphicUtil'
import type { TilesetData, DataPoint } from '@/components/item/maker/Util'
import { parsePoints } from '@/components/item/maker/Util'
import { getTilesetData } from '@/components/item/maker/TilesetMaker'
import { getTransformData } from '@/components/item/maker/tileset-transform'

export async function makeItemLayer(
  bodyItemKey: string,
  partKey: string,
  size: number,
  tilesetImageCanvas: HTMLCanvasElement,
  tilesetData: TilesetData | HTMLCanvasElement,
): Promise<{
  tileSize: number
  canvas: HTMLCanvasElement
}> {
  const transformData = getTransformData(partKey)

  const anchorDataImageUrl = `images/body/${bodyItemKey}.${partKey}data.png`
  const anchorDataCanvas = await loadCanvas(anchorDataImageUrl)
  const anchorPoints = parsePoints(size, anchorDataCanvas)
  let data: TilesetData
  if (tilesetData instanceof HTMLCanvasElement) {
    data = getTilesetData(size, tilesetImageCanvas, tilesetData)
  } else {
    data = tilesetData
  }
  const padding = getOversizePadding(partKey, size, anchorPoints, data)
  const tileSize = size + padding * 2

  const tileWidth = Math.floor(anchorDataCanvas.width / size)
  const tileHeight = Math.floor(anchorDataCanvas.height / size)
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

    const anchorPoint = anchorPoints[i]
    if (!anchorPoint) continue
    const tileIndex =
      (anchorPoint.color[0] - 127) / (128 / transformData.transform.length) - 1
    const pivotPoint = data[tileIndex].point
    if (!pivotPoint) continue
    const tx = tileIndex % transformData.tileWidth
    const ty = Math.floor(tileIndex / transformData.tileWidth)
    g2d.save()
    g2d.translate(
      padding + anchorPoint.x - pivotPoint.x,
      padding + anchorPoint.y - pivotPoint.y,
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
  partKey: string,
  size: number,
  anchorPoints: (DataPoint | null)[],
  tilesetData: TilesetData,
): number {
  const boundingBoxes = anchorPoints.map((anchorPoint) => {
    if (!anchorPoint) return null

    const transformData = getTransformData(partKey)
    const tileIndex =
      (anchorPoint.color[0] - 127) / (128 / transformData.transform.length) - 1
    const pivotPoint = tilesetData[tileIndex].point
    if (!pivotPoint) return null
    const boundingRect = tilesetData[tileIndex].rect
    if (!boundingRect.count) return null

    const left = anchorPoint.x - (pivotPoint.x - boundingRect.left)
    const right = anchorPoint.x + (boundingRect.right - pivotPoint.x)
    const top = anchorPoint.y - (pivotPoint.y - boundingRect.top)
    const bottom = anchorPoint.y + (boundingRect.bottom - pivotPoint.y)
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
