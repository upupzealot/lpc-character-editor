import pako from 'pako'

type Frame = {
  /** 帧索引 */
  index: number
  /** 帧持续时间 */
  duration: number
}

type Layer = {
  /** 图层索引 */
  index: number
  /** 图层名称 */
  name: string
  flags: number
  /** 是否可见 */
  visible: boolean
  /** 图层类型 */
  type: number // 0:'Normal' | 1:'Group' | 2:'Tilemap'
  /** 图层层级 */
  childLevel: number
  /** 混合模式 */
  blendMode: number
  /** 不透明度 */
  opacity: number
  /** 子图层 */
  layers: Array<Layer>
  /** 父图层 */
  parentLayer: Layer | null
}

type Cel = {
  /** 帧索引 */
  frameIndex: number
  /** 图层索引 */
  layerIndex: number
  /** x 坐标 */
  x: number
  /** y 坐标 */
  y: number
  /** 不透明度 */
  opacity: number
  /** Cel 类型 */
  type: number
  /** zIndex */
  zIndex: number
  width: number
  height: number
  canvas: HTMLCanvasElement | OffscreenCanvas
}

export interface IAse {
  file: File
  /** 文件大小 */
  fileSize: number
  /** 帧数 */
  frameCount: number
  /** 画布宽度 */
  width: number
  /** 画布高度 */
  height: number
  /** 颜色深度 */
  colorDepth: number

  /** 帧数据 */
  frames: Array<Frame>
  /** 图层数据 */
  layers: Array<Layer>
  /** 细胞数据 */
  cels: Array<Array<Cel>>
  /** 预览画布 */
  canvas: OffscreenCanvas | null

  parse(): Promise<void>
}

export class Ase implements IAse {
  file: File
  fileSize: number = 0
  frameCount: number = 0
  width: number = 0
  height: number = 0
  colorDepth: number = 0
  frames: Array<Frame> = []
  layers: Array<Layer> = []
  cels: Array<Array<Cel>> = []
  canvas: OffscreenCanvas | null = null

  private _parsed: boolean = false

  constructor(file: File) {
    this.file = file
  }

  private reset() {
    this.fileSize = 0
    this.frameCount = 0
    this.width = 0
    this.height = 0
    this.colorDepth = 0
    this.frames = []
    this.canvas = null
  }

  async parse() {
    this.reset()

    const arrayBuffer = await this.file.arrayBuffer()
    const view = new DataView(arrayBuffer)

    // 解析文件头
    this.fileSize = view.getUint32(0, true) // 文件大小
    const magicNumber = view.getUint16(4, true) // 魔数（应为 0xA5E0）
    if (magicNumber !== 0xa5e0) {
      throw new Error('Aseprite 文件格式错误!')
    }
    this.frameCount = view.getUint16(6, true)
    this.width = view.getUint16(8, true)
    this.height = view.getUint16(10, true)
    this.canvas = new OffscreenCanvas(this.width, this.height)
    this.colorDepth = view.getUint16(12, true)
    let offset = 128 // 文件头固定长度为 128 字节

    let frameStart = 128
    // 帧数据解析
    for (let frameIndex = 0; frameIndex < this.frameCount; frameIndex++) {
      offset = frameStart
      const frameSize = view.getUint32(offset, true) // 帧大小
      const frameEnd = frameStart + frameSize
      const frameMagicNumber = view.getUint16(offset + 4, true) // 帧魔数（应为 0xF1FA）
      if (frameMagicNumber !== 0xf1fa) {
        throw new Error(`帧格式错误，当前帧数：${frameIndex}`)
      }
      // const oldChunks = view.getUint16(offset + 6, true) // 旧版 Chunk 数量（忽略）
      const frameDuration = view.getUint16(offset + 8, true) // 帧持续时间
      const frame: Frame = {
        index: frameIndex,
        duration: frameDuration,
      }
      this.frames.push(frame)
      this.cels.push([])
      console.log('parsed frame', frameIndex)
      offset += 16 // 帧头固定长度为 16 字节

      // 图层数据解析
      let layerIndex = 0
      while (offset < frameEnd) {
        const chunkSize = view.getUint32(offset, true) // Chunk 大小
        const chunkType = view.getUint16(offset + 4, true) // Chunk 类型

        if (chunkType === 0x2004) {
          // 图层类型 Layer
          const offset0 = offset
          offset += 6

          const layerFlags = view.getUint16(offset, true) // 图层标志
          const layerVisible = !!(layerFlags % 2)
          const layerType = view.getUint8(offset + 2) // 图层类型
          const layerChildLevel = view.getUint16(offset + 4, true) // 子图层层级
          // const defaultLayerWidth = view.getUint16(offset + 6, true) // 默认宽度（已废弃）
          // const defaultLayerHeight = view.getUint16(offset + 8, true) // 默认高度（已废弃）
          const blendMode = view.getUint16(offset + 10, true) // 混合模式
          const opacity = view.getUint8(offset + 12) // 不透明度
          offset += 13 + 3
          const nameLength = view.getUint16(offset, true) // 名称长度
          offset += 2
          let layerName = ''
          for (let i = 0; i < nameLength; i++) {
            layerName += String.fromCharCode(view.getUint8(offset))
            offset++
          }
          const canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          canvas.style.imageRendering = 'pixelated'
          // document.body.prepend(canvas)

          let parentLayer: Layer | null = null
          if (layerChildLevel === 0) {
            parentLayer = null
          } else {
            for (let i = layerIndex; i >= 0; i--) {
              if (this.layers[i]?.childLevel === layerChildLevel - 1) {
                parentLayer = this.layers[i]
                break
              }
            }
          }
          const layer: Layer = {
            index: layerIndex,
            name: layerName,
            flags: layerFlags,
            visible: layerVisible,
            type: layerType,
            childLevel: layerChildLevel,
            blendMode,
            opacity,
            layers: [],
            parentLayer: parentLayer,
          }
          parentLayer?.layers.push(layer)
          this.layers.push(layer)
          console.log('parsed layer', layerIndex, layerName)

          offset = offset0 + chunkSize
          layerIndex++
        } else if (chunkType === 0x2005) {
          // 图层类型 Cel
          const offset0 = offset
          offset += 6

          const layerIndex = view.getUint16(offset, true) // 图层索引
          const x = view.getUint16(offset + 2, true)
          const y = view.getUint16(offset + 4, true)
          const opacity = view.getUint8(offset + 6)
          const celType = view.getUint16(offset + 7, true)
          const zIndex = view.getUint16(offset + 9, true)
          offset += 11 + 5

          let pixelData: Uint8Array = new Uint8Array()
          if (celType === 0 || celType === 2) {
            const celWidth = view.getUint16(offset, true) // Cel 宽度
            const celHeight = view.getUint16(offset + 2, true) // Cel 高度
            offset += 4
            // 读取像素数据
            if (celType === 0) {
              // 原始图像
              pixelData = new Uint8Array(
                arrayBuffer,
                offset,
                celWidth * celHeight * 4,
              )
              offset += celWidth * celHeight * 4
            } else if (celType === 2) {
              // 压缩图像
              const compressedSize = chunkSize - 26 // 压缩数据大小
              const compressedData = new Uint8Array(
                arrayBuffer,
                offset,
                compressedSize,
              )
              // 使用 ZLIB 解压缩
              pixelData = pako.inflate(compressedData)
              offset += compressedSize
            }

            // const canvas = this.frames[frameIndex].layers[layerIndex].canvas
            // const canvas = document.createElement('canvas')
            // const g2d = canvas.getContext('2d') as CanvasRenderingContext2D
            const canvas = new OffscreenCanvas(celWidth, celHeight)
            const g2d = canvas.getContext(
              '2d',
            ) as OffscreenCanvasRenderingContext2D
            const imageData = new ImageData(celWidth, celHeight)
            for (let i = 0; i < pixelData.length; i++) {
              imageData.data[i] = pixelData[i]
            }
            g2d.putImageData(imageData, 0, 0)

            const cel: Cel = {
              frameIndex,
              layerIndex,
              x,
              y,
              opacity,
              type: celType,
              zIndex,
              width: celWidth,
              height: celHeight,
              canvas,
            }
            if (!this.cels[frameIndex].length) {
              this.cels[frameIndex] = new Array(this.layers.length)
            }
            this.cels[frameIndex][layerIndex] = cel
            console.log('add cel', frameIndex, layerIndex)
          }
          offset = offset0 + chunkSize
        } else {
          offset += chunkSize
        }
      }
      frameStart = frameEnd
    }

    this._parsed = true
    this.render(0)
  }

  private checkParsed() {
    if (!this._parsed) {
      throw new Error('没有初始化，使用 parse 方法初始化 Ase 对象')
    }
  }

  render(frameIndex: number, layerIndex?: number) {
    this.checkParsed()

    if (!this.frameCount) return
    const cels = this.cels[frameIndex]
      .filter((frameCel) => {
        return typeof layerIndex === 'number'
          ? frameCel.layerIndex === layerIndex
          : true
      })
      .sort((c1, c2) => {
        const order1 = c1.layerIndex + c1.zIndex
        const order2 = c2.layerIndex + c2.zIndex
        if (order1 === order2) {
          return c1.zIndex - c2.zIndex
        } else {
          return order1 - order2
        }
      })

    const g2d = this.canvas?.getContext(
      '2d',
    ) as OffscreenCanvasRenderingContext2D
    cels.forEach((cel) => {
      const layer = this.layers[cel.layerIndex]
      let visible = layer.visible
      const alpha = layer.opacity / 255
      let parentLayer = layer.parentLayer
      while (parentLayer) {
        visible = visible && parentLayer.visible
        parentLayer = parentLayer.parentLayer
      }

      if (visible) {
        g2d.save()
        g2d.globalAlpha = (cel.opacity / 255) * alpha
        g2d.drawImage(cel.canvas, cel.x, cel.y)
        g2d.restore()
      }
    })
  }
}
