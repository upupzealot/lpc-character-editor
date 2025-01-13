import { Spritesheet, Texture, type SpritesheetData } from 'pixi.js'
import CharactorActions from './CharacterActionsData.json'

interface AtlasData extends SpritesheetData {
  animations: { [key: string]: string[] }
}

export default class CharactorSheet extends Spritesheet {
  constructor(image: Texture) {
    const atlasData: AtlasData = {
      frames: {},
      meta: {
        scale: 1,
      },
      animations: {},
    }

    CharactorActions.forEach((action) => {
      const size = 32
      const { x, y, frameCount } = action
      const frames = []
      for (let i = 0; i < frameCount; i++) {
        const frameName = `${action.name}-${i}`
        atlasData.frames[frameName] = {
          frame: {
            x: (x + i) * size,
            y: y * size,
            w: size,
            h: size,
          },
          sourceSize: { w: size, h: size },
          spriteSourceSize: {
            x: 0,
            y: 0,
            w: size,
            h: size,
          },
        }
        frames.push(frameName)
      }
      atlasData.animations[action.name] = frames
    })

    super(image, atlasData)
  }
}
