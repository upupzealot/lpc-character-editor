import type { Color } from '@/components/types'

export async function makeWeaponLayer(
  size: number,
  bodyHandPointImage: HTMLImageElement,
  weaponTileImage: HTMLImageElement,
  weaponData: {
    x: number
    y: number
    color: Color
  }[][],
) {
  const frameWidth = Math.floor(bodyHandPointImage.naturalWidth / size)
  const frameHeight = Math.floor(bodyHandPointImage.naturalHeight / size)
  const frameCount = frameWidth * frameHeight

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  document.body.prepend(canvas)
  canvas.style.imageRendering = 'pixelated'
  canvas.style.transformOrigin = 'top left'
  canvas.style.transform = 'scale(2,2)'
  canvas.width = bodyHandPointImage.width
  canvas.height = bodyHandPointImage.height
  const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

  const handData = parseData(size, bodyHandPointImage)

  for (let i = 0; i < frameCount; i++) {
    const x = i % frameWidth
    const y = Math.floor(i / frameWidth)

    const handPoint = handData[i].length ? handData[i][0] : null
    if (!handPoint) continue
    const tileIndex = (handPoint.color[0] - 127) / 16 - 1
    const weaponPoint = weaponData[tileIndex].length
      ? weaponData[tileIndex][0]
      : null
    if (!weaponPoint) continue
    g2d.save()
    g2d.translate(handPoint.x - weaponPoint.x, handPoint.y - weaponPoint.y)
    g2d.drawImage(
      weaponTileImage,
      tileIndex * size,
      0,
      size,
      size,
      x * size,
      y * size,
      size,
      size,
    )
    g2d.restore()
  }
}

export async function makeWeaponTile(
  size: number,
  miniImage: HTMLImageElement | HTMLCanvasElement,
  miniDataImage: HTMLImageElement,
): Promise<{
  image: HTMLImageElement
  data: {
    x: number
    y: number
    color: Color
  }[][]
}> {
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.style.imageRendering = 'pixelated'
  canvas.width = size * 8
  canvas.height = size
  const g2d = canvas.getContext('2d') as CanvasRenderingContext2D

  const dataCanvas = document.createElement('canvas') as HTMLCanvasElement
  dataCanvas.style.imageRendering = 'pixelated'
  dataCanvas.width = size * 8
  dataCanvas.height = size
  const dataG2d = dataCanvas.getContext('2d') as CanvasRenderingContext2D

  function draw(s: number, d: number, scaleX: number, rotate: number) {
    g2d.save()
    g2d.translate(size * (d + 0.5), size * 0.5)
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
    dataG2d.translate(size * (d + 0.5), size * 0.5)
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

  g2d.drawImage(miniImage, 0, 0)
  dataG2d.drawImage(miniDataImage, 0, 0)
  draw(0, 2, -1, -2)
  draw(1, 3, 1, 2)
  draw(0, 4, 1, 4)
  draw(1, 5, -1, 2)
  draw(0, 6, 1, -2)
  draw(1, 7, -1, 0)

  const image = new Image(canvas.width, canvas.height)
  image.src = canvas.toDataURL('image/png')
  image.style.imageRendering = 'pixelated'

  const dataImage = new Image(dataCanvas.width, dataCanvas.height)
  await new Promise((resolve) => {
    dataImage.onload = resolve
    dataImage.src = dataCanvas.toDataURL('image/png')
  })
  dataImage.style.imageRendering = 'pixelated'
  const frameData = parseData(size, dataImage)
  console.log('frameData', frameData)

  return { image, data: frameData }
}

export function parseData(size: number, image: HTMLImageElement) {
  const frameWidth = Math.floor(image.naturalWidth / size)
  const frameHeight = Math.floor(image.naturalHeight / size)
  const frameCount = frameWidth * frameHeight

  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.style.imageRendering = 'pixelated'
  canvas.width = image.width
  canvas.height = image.height
  const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
  g2d.drawImage(image, 0, 0)

  const frames = [] as { x: number; y: number; color: Color }[][]
  for (let i = 0; i < frameCount; i++) {
    const x = i % frameWidth
    const y = Math.floor(i / frameWidth)

    const { data } = g2d.getImageData(x * size, y * size, size, size)

    frames.push([] as { x: number; y: number; color: Color }[])
    for (let p = 0; p < data.length / 4; p++) {
      const a = data[p * 4 + 3]

      if (a) {
        const r = data[p * 4]
        const g = data[p * 4 + 1]
        const b = data[p * 4 + 2]
        frames[i].push({
          x: p % size,
          y: Math.floor(p / size),
          color: [r, g, b, a],
        })
      }
    }
  }
  return frames
}
