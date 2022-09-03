<template>
  <div class="mail">
    <el-form :model="form">
      <el-form-item label="收件人：">
        <el-input v-model="form.mailTo"></el-input>
      </el-form-item>
      <el-form-item label="内容：">
        <el-input type="textarea" :rows="8" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendMail">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { sendMailApi } from "@/views/API/admin.js";

export default {
  data() {
    return {
      form: {
        mailTo: "2381773226@qq.com",
        content: "",
      },
    };
  },
  created() {},
  methods: {
    async sendMail() {
      let res = await sendMailApi(this.form);
      if (res) {
        this.$message.success("发送成功");
      }
    },
  },
};
</script>

<style scoped lang="less">
.mail {
  width: 100%;
}
</style>
