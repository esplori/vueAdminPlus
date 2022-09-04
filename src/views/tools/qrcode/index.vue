<template>
  <div class="qrcode">
    <el-form :model="form" label-width="60px">
      <el-form-item label="文本：">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="宽：">
        <el-input v-model.number="form.width"></el-input>
      </el-form-item>
      <el-form-item label="高：">
        <el-input v-model.number="form.height"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: center; padding: 20px">
      <el-button type="primary" @click="genereateQrcode">生成二维码</el-button>
    </div>
    <div style="text-align: center; padding: 20px">
      <img :src="qrcodeUrl" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { genereateQrcodeApi } from "../../API/tools";
export default {
  data() {
    return {
      form: {
        url: "https://www.dsiab.com",
        width: 300,
        height: 300,
      },
      qrcodeUrl: "",
    };
  },
  methods: {
    async genereateQrcode() {
      const res = await genereateQrcodeApi(this.form);
      if (res) {
        this.qrcodeUrl = res.data;
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
