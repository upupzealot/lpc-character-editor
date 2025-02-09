import weaponTransform from '@/components/item/maker/tileset-transform/Weapon.json'
import hairTransform from '@/components/item/maker/tileset-transform/Hair.json'
import eyeTransform from '@/components/item/maker/tileset-transform/Eye.json'
import earTransform from '@/components/item/maker/tileset-transform/Ear.json'

type TransformData = {
  tileWidth: number
  transform: [number, number, number, number][]
}

const ItemTransformDataMap = {
  weapon: weaponTransform as TransformData,
  hair: hairTransform as TransformData,
  eye: eyeTransform as TransformData,
  ear: earTransform as TransformData,
} as { [k: string]: TransformData }

export function getTransformData(partKey: string) {
  const transformData = ItemTransformDataMap[partKey]
  if (!transformData) {
    throw new Error(`Unsuppoted part: ${partKey}`)
  }
  return transformData
}
