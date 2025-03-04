export type Color = [number, number, number, number]

export type Item = {
  key: string
  name: string
  size?: number
  image: string
  palettes: Palette[]
}

export type Palette = {
  key: string
  name?: string
  colors: Color[]
  materials?: string[]
}
