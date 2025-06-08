<template>
  <div class="ai-qianwen">
    <searchHeader :title="'AI模型'"></searchHeader>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
setTimeout(() => {
  window.open("http://qw.dsiab.com/chat/share?shareId=ozvf9ai2r0juxiv0tyw6onal")
  location.reload()
}, 200);
router.push({path:"/home"})

</script>
<style scoped lang="scss">
.ai-qianwen {
  height: 600px;
}
</style>
