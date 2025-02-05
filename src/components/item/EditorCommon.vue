<script lang="ts">
export default {
  emits: ['switchMode'],
  methods: {
    btnType(value: unknown) {
      return value ? 'primary' : 'default'
    },
    downloadImage(image: HTMLImageElement, filename: string) {
      if (!image) return
      const dataUrl = image.src
      // 创建下载链接
      const link = document.createElement('a')
      link.href = dataUrl
      // 设置下载的文件名
      link.download = filename
      // 触发下载
      document.body.appendChild(link)
      link.click()
      // 清理
      document.body.removeChild(link)
    },
    downloadJson(jsonObj: object, filename: string) {
      if (!jsonObj) return
      const jsonString = JSON.stringify(jsonObj, null, 2)
      // 创建 Blob 对象
      const blob = new Blob([jsonString], { type: 'application/json' })
      // 创建下载链接
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      // 设置下载的文件名
      link.download = filename
      // 触发下载
      document.body.appendChild(link)
      link.click()
      // 清理
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)
    },
  },
}
</script>
