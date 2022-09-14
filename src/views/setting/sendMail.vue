<template>
  <div class="mail">
    <el-form :model="form" label-width="80px">
      <el-form-item label="收件人：">
        <el-input v-model="state.form.mailTo"></el-input>
      </el-form-item>
      <el-form-item label="内容：">
        <el-input type="textarea" :rows="8" v-model="state.form.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendMail">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { sendMailApi } from "@/views/API/admin.js";
import { reactive } from "vue";
import { ElMessage } from "element-plus"
const state = reactive({
  form: {
    mailTo: "2381773226@qq.com",
    content: "",
  },
});
const sendMail = async () => {
  const res = await sendMailApi(state.form);
  if (res) {
    ElMessage.success("发送成功");
  }
};
</script>

<style scoped lang="scss">
.mail {
  width: 100%;
}
</style>
