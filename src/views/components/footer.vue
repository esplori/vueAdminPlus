<template>
  <div class="footer">
    <el-backtop :right="20" :bottom="80" />
    <!-- <span v-html="copyRight"></span>copyRight {{currentDate}} <a href="http://beian.miit.gov.cn/"> 粤ICP备20013202号</a> -->
    <span v-html="copyRight"></span>
    {{ currentDate }} javascript技术分享
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const copyRight = ref("&copy");
const currentDate = ref(new Date().getFullYear());
</script>
<style lang="scss" scoped>
.footer {
  bottom: 20px;
  margin-top: 20px;
  padding: 20px 0;
  text-align: center;
}
</style>
