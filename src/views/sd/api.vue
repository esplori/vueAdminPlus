<template>
  <div class="sd-setting">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form :model="state.form" label-width="150px" label-position="left" class="setting-form">
          <el-form-item label="模型:">
            <el-input v-model="state.form.sd_model_name"  disabled></el-input>
          </el-form-item>
          <el-form-item label="提示词:">
            <el-input v-model="state.form.prompt" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="反向词:">
            <el-input v-model="state.form.negative_prompt" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="迭代步数:">
            <el-slider v-model="state.form.steps" max="30" /> <span>{{ state.form.steps }}</span>
          </el-form-item>
          <el-form-item label="开启高清修复:">
            <el-switch v-model="state.form.enable_hr" />
          </el-form-item>
        </el-form>
        <el-button style="width:100%" size="medium" @click="generate" type="primary">生成</el-button>
      </el-col>
      <el-col :span="12">
        <div id="img-container" v-loading="state.loading">
          <img :src="state.imgeFormat + item" alt="" style="width:512px;" v-for="(item) in state.images" />
        </div>
      </el-col>
    </el-row>
    <el-row>
      
    </el-row>
  </div>

</template>
<script setup lang="ts">
import { reactive } from "vue";
import axios from "axios";
const state = reactive({
  images: [],
  loading: false,
  form: {
    prompt: "1girl,smile,solo,brown hair,(large breasts:0.8),looking at viewer,dress,large breasts,bare shoulders,lips,long hair,realistic,((indoors,blurry background,sunlight,nature,armlet)),short dress,<lora:ranxiaoran:0.15>,<lora:beautiful_girl:0.3>,",
    negative_prompt: "AS-YoungV2-neg,BadDream,badhandv4,BadNegAnatomyV1-neg,EasyNegative,FastNegativeV2,",
    enable_hr: false,
    steps: 20,
    sd_model_name:"majicMIX realistic_v7"
  },
  imgeFormat: "data:image/png;base64,"
})
const generate = () => {
  state.loading = true
  axios.post("/si/sdapi/v1/txt2img", {
    "sampler_name": "Euler a",
    "sd_vae_name": "vae-ft-mse-840000-ema-pruned.safetensors",
    "seed": -1,
    "subseed": -1,
    "cfg_scale": 7,
    "batch_size": 1,
    "width": 512,
    "height": 512,
    "seed_resize_from_w": -1,
    "seed_resize_from_h": -1,
    "denoising_strength": 0.7,
    "alwayson_scripts": {
      "ADetailer": {
        "args": [
          {
            "ad_model": "face_yolov8n.pt",
          }
        ]
      }
    },
    "clip_skip": 2,
    "hr_scale": 2,
    "hr_upscaler": "Latent",
    "save_images":true,
    ...state.form,
  }).then((res) => {
    if (res) {
      state.images = res.data.images
      console.log(state.images)
      state.loading = false
    }
  })
}

</script>
<style scoped>
#img-container {
  min-height: 512px;
  width: 512px;
  margin: 0 auto;
  background-color: #ddd;
  margin-top: 10px;
}

.sd-setting {
  padding: 20px;
}
</style>