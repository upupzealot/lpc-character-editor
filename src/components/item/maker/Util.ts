import type { Color } from '@/components/character/types'

export type DataPoint = {
  x: number
  y: number
  color: Color
}

export type DataRect = {
  count: number
  left: number
  right: number
  top: number
  bottom: number
}

export type TileData = {
  point: DataPoint | null
  rect: DataRect
}

export type TilesetData = TileData[]

export type ItemTileset = {
  imageCanvas: HTMLCanvasElement
  dataCanvas: HTMLCanvasElement
  data: TilesetData
}

export function parsePoints(
  size: number,
  canvas: HTMLCanvasElement,
): (DataPoint | null)[] {
  const framesData = getFrames(size, canvas)

  const framePoints = framesData.map((imageData) => {
    const data = imageData.data
    let point: DataPoint
    for (let p = 0; p < data.length / 4; p++) {
      const a = data[p * 4 + 3]
      if (a) {
        const x = p % size
        const y = Math.floor(p / size)
        const r = data[p * 4]
        const g = data[p * 4 + 1]
        const b = data[p * 4 + 2]
        point = {
          x,
          y,
          color: [r, g, b, a],
        }
        return point
      }
    }
    return null
  })
  return framePoints
}

export function parseRect(size: number, canvas: HTMLCanvasElement) {
  const framesData = getFrames(size, canvas)

  const frameRects = framesData.map((imageData) => {
    const { data } = imageData
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

export function getFrames(
  size: number,
  canvas: HTMLCanvasElement,
): ImageData[] {
  const frameWidth = Math.floor(canvas.width / size)
  const frameHeight = Math.floor(canvas.height / size)
  const frameCount = frameWidth * frameHeight

  const g2d = canvas.getContext('2d', {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D
  const frames = [] as ImageData[]
  for (let i = 0; i < frameCount; i++) {
    const x = i % frameWidth
    const y = Math.floor(i / frameWidth)

    const data = g2d.getImageData(x * size, y * size, size, size)
    frames[i] = data
  }
  return frames
}
