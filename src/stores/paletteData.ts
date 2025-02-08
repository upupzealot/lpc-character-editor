import type { Color, Palette } from '@/components/character/types'

// PaletteData comes from:
// https://github.com/vitruvianstudio/vitruvian-web/blob/main/src/data/colors.json
import PaletteData from '@/stores/PaletteData.json'
import { encodeColor, loadCanvas, replaceCanvasColor } from '@/util/GraphicUtil'
export const paletteList = (PaletteData as Palette[]).map((palette) => {
  const key = palette.colors.map((color) => encodeColor(color)).join(';')
  return {
    ...palette,
    key,
  }
}) as Palette[]
export const paletteMap = {} as { [k: string]: Palette }
paletteList.forEach((palette) => {
  paletteMap[palette.key] = palette
})

import marbleImageUrl from '@/assets/images/marble.png'
export const iconUrl = marbleImageUrl
export const ICON_SIZE = 16
export async function getIconCanvas(palettes: Palette[]) {
  const canvas = document.createElement('canvas')

  canvas.width = ICON_SIZE * palettes.length
  canvas.height = ICON_SIZE
  canvas.style.imageRendering = 'pixelated'
  const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
  g2d.imageSmoothingEnabled = false

  // 图标原始色板
  const srcColors = [
    [255, 255, 255, 255],
    [235, 237, 233, 255],
    [216, 212, 192, 255],
    [173, 152, 142, 255],
    [111, 100, 100, 255],
    [56, 43, 51, 255],
  ] as Color[]
  // 待预览的色板列表
  const dstColors = palettes.map((p) => p.colors)
  const marbleCanvas = await loadCanvas(marbleImageUrl)
  const marbleG2d = marbleCanvas.getContext('2d') as CanvasRenderingContext2D
  const marbleImageData = marbleG2d.getImageData(
    0,
    0,
    marbleCanvas.width,
    marbleCanvas.height,
  )
  for (let i = 0; i < dstColors.length; i++) {
    const imageCanvas = await replaceCanvasColor(
      [srcColors],
      [dstColors[i]],
      marbleImageData,
    )
    g2d.drawImage(
      imageCanvas,
      0,
      0,
      16,
      16,
      i * ICON_SIZE,
      0,
      ICON_SIZE,
      ICON_SIZE,
    )
  }

  return canvas
}
