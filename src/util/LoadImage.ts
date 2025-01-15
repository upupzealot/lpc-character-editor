export default async function loadImage(
  src: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onerror = (error) => {
      console.log('image load error', src, error)
      reject(error)
    }
    image.src = src
  })
}
