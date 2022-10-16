<template>
   <div class="not-found">
    <img src="@/assets/img/404.png" alt="" width="100%" />
    <div class="msg">抱歉，你访问的页面不存在</div>
    <div class="seconds">{{ state.seconds }} 秒后将跳转到登录页面</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive,onMounted } from "vue";
const state = reactive({
  seconds: 5
})
onMounted(()=>{
  setInterval(() => {
    state.seconds = state.seconds - 1;
        if (state.seconds <= 0) {
          state.seconds = 0
          location.href = "/#/login";
        }
      }, 1000);
})
</script>
<style lang="scss" scoped>
.not-found {
  background: #fff;
  height: 100%;
  padding-bottom: 200px;
  .msg,
  .seconds {
    text-align: center;
  }
}
</style>
