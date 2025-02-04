<script lang="ts">
export default {
  emits: ['switchMode'],
  methods: {
    btnType(value: unknown) {
      return value ? 'primary' : 'default'
    },
    downloadImage(image: HTMLImageElement) {
      if (!image) return
      const dataUrl = image.src
      const link = document.createElement('a') // 创建下载链接
      link.href = dataUrl
      link.download = 'item-tile.png' // 设置下载的文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  },
}
</script>
