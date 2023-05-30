<template>
  <div class="msg">
    {{ successMsg }}
  </div>
</template>
<script lang="ts" setup>
import { getValidEmailEffectiveApi } from "@/views/account/api";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const successMsg = ref("");

onMounted(() => {
  const id: any = route.query.id || "";
  getValidEmailEffective(id);
});

const getValidEmailEffective = async (id: string) => {
  const res = await getValidEmailEffectiveApi({ id: id });
  if (res) {
    successMsg.value = "激活成功，即将跳转到登录页面";
    setTimeout(() => {
      localStorage.clear();
      router.push({ path: "/login" });
    }, 3000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.msg {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
