<template>
  <div class="not-found">
    <img src="@/assets/images/404.png" alt="" width="400" />
    <div class="msg">抱歉，你访问的页面不存在</div>
    <div class="seconds">{{ state.seconds }} 秒后将跳转到登录页面</div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount } from "vue";
const state = reactive({
  seconds: 5,
  setIn: 0,
});
onMounted(() => {
  state.setIn = setInterval(() => {
    state.seconds = state.seconds - 1;
    if (state.seconds <= 0) {
      state.seconds = 0;
      localStorage.clear();
      location.href = "/#/login";
    }
  }, 1000);
});
onBeforeUnmount(() => {
  clearInterval(state.setIn);
});
</script>
<style lang="scss" scoped>
.not-found {
  background: #fff;
  height: 100%;
  padding-bottom: 200px;
  text-align: center;

  .msg,
  .seconds {
    text-align: center;
  }
}
</style>
