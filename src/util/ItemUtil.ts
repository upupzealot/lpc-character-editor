import type { Color } from '@/components/character/types'

type DataPoint = {
  x: number
  y: number
  color: Color
}

type DataRect = {
  count: number
  left: number
  right: number
  top: number
  bottom: number
}

export type FrameData = {
  points: DataPoint[]
  rect: DataRect
}

export type TileData = FrameData[]

export type ItemTile = {
  image: HTMLImageElement
  imageUrl: string
  dataImage: HTMLImageElement
  dataImageUrl: string
  data: TileData
}

export async function makeItemLayer(
  size: number,
  bodyHandPointImage: HTMLImageElement,
  tileImage: HTMLImageElement,
  tileData: TileData | HTMLImageElement,
): Promise<{
  frameSize: number
  imageUrl: string
}> {
  const frameHandPoints: DataPoint[][] = parsePoints(size, bodyHandPointImage)
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

    const handPoint = frameHandPoints[i].length ? frameHandPoints[i][0] : null
    if (!handPoint) continue
    const tileIndex = (handPoint.color[0] - 127) / 8 - 1
    const anchorPoint = data[tileIndex].points.length
      ? data[tileIndex].points[0]
      : null
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
  const frameRects = parseBoundingBox(size, image)
  const data = framePoints.map((points, i) => {
    return {
      points,
      rect: frameRects[i],
    }
  })
  return data
}

function getFrames(
  size: number,
  image: HTMLImageElement,
): Uint8ClampedArray<ArrayBufferLike>[] {
  const frameWidth = Math.floor(image.naturalWidth / size)
  const frameHeight = Math.floor(image.naturalHeight / size)
  const frameCount = frameWidth * frameHeight

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.style.imageRendering = 'pixelated'
  canvas.width = image.width
  canvas.height = image.height
  const g2d = canvas.getContext('2d', {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D
  g2d.drawImage(image, 0, 0)

  const frames = [] as Uint8ClampedArray<ArrayBufferLike>[]
  for (let i = 0; i < frameCount; i++) {
    const x = i % frameWidth
    const y = Math.floor(i / frameWidth)

    const { data } = g2d.getImageData(x * size, y * size, size, size)
    frames[i] = data
  }
  return frames
}

function getOversizePadding(
  size: number,
  handPoints: DataPoint[][],
  tileData: TileData,
): number {
  const boundingBoxes = handPoints.map((handPoints) => {
    const handPoint = handPoints.length ? handPoints[0] : null
    if (!handPoint) return null

    const tileIndex = (handPoint.color[0] - 127) / 8 - 1
    const anchorPoints = tileData[tileIndex].points
    const anchorPoint = anchorPoints.length ? anchorPoints[0] : null
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

export function parseBoundingBox(size: number, image: HTMLImageElement) {
  const framesData = getFrames(size, image)

  const frameRects = framesData.map((data) => {
    let [count, left, right, top, bottom] = [0, -1, -1, -1, -1]
    for (let p = 0; p < data.length / 4; p++) {
      const a = data[p * 4 + 3]
      if (a) {
        count++
        const x = p % size
        const y = Math.floor(p / size)
        left = left >= 0 ? Math.min(left, x) : x
        right = right >= 0 ? Math.max(right, x) : x
        top = top >= 0 ? Math.min(top, y) : y
        bottom = bottom >= 0 ? Math.max(bottom, y) : y
      }
    }
    return { count, left, right, top, bottom }
  })
  return frameRects
}

export function parsePoints(size: number, image: HTMLImageElement) {
  const framesData = getFrames(size, image)

  const framePoints = framesData.map((data) => {
    const points = [] as { x: number; y: number; color: Color }[]
    for (let p = 0; p < data.length / 4; p++) {
      const a = data[p * 4 + 3]
      if (a) {
        const x = p % size
        const y = Math.floor(p / size)
        const r = data[p * 4]
        const g = data[p * 4 + 1]
        const b = data[p * 4 + 2]
        points.push({
          x,
          y,
          color: [r, g, b, a],
        })
      }
    }
    return points
  })
  return framePoints
}
