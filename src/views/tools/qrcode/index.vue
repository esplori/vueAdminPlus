<template>
  <div class="qrcode">
    <el-form :model="state.form" label-width="60px">
      <el-form-item label="文本：">
        <el-input v-model="state.form.url"></el-input>
      </el-form-item>
      <el-form-item label="宽：">
        <el-input v-model.number="state.form.width"></el-input>
      </el-form-item>
      <el-form-item label="高：">
        <el-input v-model.number="state.form.height"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: center; padding: 20px">
      <el-button type="primary" @click="genereateQrcode">生成二维码</el-button>
    </div>
    <div style="text-align: center; padding: 20px">
      <img :src="state.qrcodeUrl" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { genereateQrcodeApi } from "../../API/tools";
import { reactive } from "vue";

let state = reactive({
  form: {
    url: "https://www.dsiab.com",
    width: 300,
    height: 300,
  },
  qrcodeUrl: "",
});

const genereateQrcode = async () => {
  const res:any = await genereateQrcodeApi(state.form);
  if (res) {
    state.qrcodeUrl = res.data;
  }
};
</script>
