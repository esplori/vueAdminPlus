<template>
  <div class="ai-qianwen">
    <searchHeader :title="'AI模型'"></searchHeader>
  </div>
</template>

<script>

setTimeout(() => {
  window.open("http://sd.dsiab.com");
  location.reload()
}, 200);
router.push({path:"/home"})

</script>
<style scoped lang="scss">
.ai-qianwen {
  height: 600px;
}
</style>
