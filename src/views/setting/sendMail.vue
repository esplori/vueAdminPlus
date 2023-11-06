<template>
  <div>
    <searchHeader :title="'邮件发送'"></searchHeader>
    <el-form
      ref="mailForm"
      :model="state.form"
      label-width="100px"
      :rules="state.rules"
    >
      <el-form-item label="收件人：" prop="mailTo">
        <el-input v-model="state.form.mailTo"></el-input>
      </el-form-item>
      <el-form-item label="标题：" prop="title">
        <el-input v-model="state.form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容：" prop="content">
        <el-input
          type="textarea"
          :rows="8"
          v-model="state.form.content"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendMail">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { sendMailApi } from "@/views/API/admin.js";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  form: {
    mailTo: "2381773226@qq.com",
    content: "",
    title: "",
  },
  rules: {
    mailTo: [{ required: true, message: "请输入收件人", trigger: "change" }],
    title: [{ required: true, message: "请输入标题", trigger: "change" }],
    content: [{ required: true, message: "请输入内容", trigger: "change" }],
  },
});

const mailForm = ref();

const sendMail = async () => {
  const bool = await mailForm.value.validate();
  if (!bool) {
    return;
  }
  const res = await sendMailApi(state.form);
  if (res) {
    ElMessage.success("发送成功");
  }
};
</script>
