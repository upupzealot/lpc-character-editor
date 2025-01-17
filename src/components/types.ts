export type Color = [number, number, number, number]

export type Item = {
  key: string
  name: string
  image: string
  palette: Color[]
}

export type Palette = {
  key: string
  name: string
  colors: Color[]
  materials: string[]
}
