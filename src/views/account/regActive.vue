<template>
  <div class="msg">
    {{ successMsg }}
  </div>
</template>
<script lang="ts">
import { getValidEmailEffectiveApi } from "@/views/account/api.ts";
export default {
  data() {
    return {
      successMsg: "",
    };
  },
  created() {
    const id = this.$route.query.id;
    this.getValidEmailEffective(id);
  },
  methods: {
    async getValidEmailEffective(id: String) {
      const res = await getValidEmailEffectiveApi({ id: id });
      if (res) {
        this.successMsg = "激活成功，即将跳转到登录页面";
        setTimeout(() => {
          this.$router.push({ path: "/login" });
        }, 3000);
      }
    },
  },
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
