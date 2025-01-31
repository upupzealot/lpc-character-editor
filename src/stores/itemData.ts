import type { Color, Item } from '@/components/character/types'
import bodyItems from '@/assets/item-data/body'
import hairItems from '@/assets/item-data/hair'
import eyeItems from '@/assets/item-data/eye'
import earItems from '@/assets/item-data/ear'
import upperItems from '@/assets/item-data/upper'
import lowerItems from '@/assets/item-data/lower'
import weaponItems from '@/assets/item-data/weapon'
import { encodeColor } from '@/util/GraphicUtil'

type RawItemData = {
  key: string
  name: string
  image: string
  palettes: {
    colors: Color[]
  }[]
}

function initItems(items: RawItemData[]) {
  return items.map((item) => {
    return {
      ...item,
      palettes: item.palettes.map((palette) => {
        return {
          key: palette.colors.map(encodeColor).join(';'),
          colors: palette.colors,
        }
      }),
    }
  }) as Item[]
}
export const itemListGroup = {
  body: initItems(bodyItems as RawItemData[]),
  hair: initItems(hairItems as RawItemData[]),
  eye: initItems(eyeItems as RawItemData[]),
  ear: initItems(earItems as RawItemData[]),
  upper: initItems(upperItems as RawItemData[]),
  lower: initItems(lowerItems as RawItemData[]),
  weapon: initItems(weaponItems as RawItemData[]),
} as unknown as {
  [k: string]: Item[]
}
export const itemMapGroup = {} as {
  [k: string]: {
    [k: string]: Item
  }
}
for (const part in itemListGroup) {
  itemListGroup[part].forEach((item) => {
    if (!itemMapGroup[part]) {
      itemMapGroup[part] = {}
    }
    itemMapGroup[part][item.key] = item
  })
}
