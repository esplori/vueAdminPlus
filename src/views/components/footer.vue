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
const initWebStat = () => {
  let webStats = new webStatistics({
    baseUrl: "/manage-service", // 基础接口地址url
    url: "/stats/getStats.gif", // 请求上报api的接口地址
    routeMode: "history", // 填写单页面应用中使用的路由模式。
    autoUpload: true, // 是否自动请求接口，在setUserId之后会以baseUrl+url形式在页面切换时自动请求上报PV/UV的接口
    prop: {
      //请求参数映射，参数名默认如下，可以自定义修改参数名。
      id: "visitorId",
    },
  });
  setTimeout(() => {
    webStats.setUserId();
  }, 1000);
}
initWebStat()
</script>
<style lang="scss" scoped>
.footer {
  bottom: 20px;
  margin-top: 20px;
  padding: 20px 0;
  text-align: center;
}
</style>
