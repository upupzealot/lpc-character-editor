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

export function getFrames(
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
