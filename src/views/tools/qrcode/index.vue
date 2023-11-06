<template>
  <div class="qrcode">
    <searchHeader :title="'二维码生成'"></searchHeader>
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
    <div style="text-align: center; padding: 10px">
      <el-button type="primary" @click="genereateQrcode">生成二维码</el-button>
    </div>
    <div style="text-align: center;" v-if="state.qrcodeUrl">右键另存为即可下载</div>
    <div style="text-align: center; padding: 10px">
        <img :src="state.qrcodeUrl" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { genereateQrcodeApi } from "../../API/tools";
import { reactive } from "vue";
import searchHeader from "../../components/searchHeader.vue";

const state = reactive({
  form: {
    url: "https://www.dsiab.com",
    width: 400,
    height: 400,
  },
  qrcodeUrl: "",
});

const genereateQrcode = async () => {
  const res: any = await genereateQrcodeApi(state.form);
  if (res) {
    state.qrcodeUrl = res.data;
  }
};
</script>
