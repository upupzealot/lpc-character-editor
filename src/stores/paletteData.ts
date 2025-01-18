import type { Palette } from '@/components/types'

// PaletteData comes from:
// https://github.com/vitruvianstudio/vitruvian-web/blob/main/src/data/colors.json
import PaletteData from '@/stores/PaletteData.json'
import { encodeColor } from '@/util/GraphicUtil'
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
