import type { Item } from '@/components/types'
import bodyItems from '@/assets/item-data/body'
import hairItems from '@/assets/item-data/hair'
import upperItems from '@/assets/item-data/upper'
export const itemListGroup = {
  body: bodyItems,
  hair: hairItems,
  upper: upperItems,
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
