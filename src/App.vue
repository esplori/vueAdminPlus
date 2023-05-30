<template>
  <el-config-provider :locale="locale" :size="'default'" :z-index="3000">
  </el-config-provider>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
const locale = ref(zhCn);
</script>
