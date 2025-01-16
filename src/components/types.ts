export type Item = {
  key: string
  name: string
  image: string
  palette: [number, number, number, number][]
}

export type Palette = {
  key: string
  name: string
  palette: [number, number, number, number][]
  materials: string[]
}
