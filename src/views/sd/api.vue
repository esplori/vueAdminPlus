<template>
  <el-button @click="generate" type="primary">生成</el-button>
  <img :src="state.imgeFormat + item" alt="" style="width:400px;" v-for="(item) in state.images" />
</template>
<script setup lang="ts">
import { reactive } from "vue";
import axios from "axios";
const state = reactive({
  images: [],
  imgeFormat: "data:image/png;base64,"
})
const generate = () => {
  axios.post("/si/sdapi/v1/txt2img", {
    "prompt": "1girl,smile,solo,brown hair,(large breasts:0.8),looking at viewer,dress,large breasts,bare shoulders,lips,long hair,realistic,((indoors,blurry background,sunlight,nature,armlet)),short dress,<lora:ranxiaoran:0.15>,<lora:beautiful_girl:0.3>,",
    "all_prompts": [
      "1girl,smile,solo,brown hair,(large breasts:0.8),looking at viewer,dress,large breasts,bare shoulders,lips,long hair,realistic,((indoors,blurry background,sunlight,nature,armlet)),short dress,<lora:ranxiaoran:0.15>,<lora:beautiful_girl:0.3>,"
    ],
    "negative_prompt": "AS-YoungV2-neg,BadDream,badhandv4,BadNegAnatomyV1-neg,EasyNegative,FastNegativeV2,",
    "all_negative_prompts": [
      "AS-YoungV2-neg,BadDream,badhandv4,BadNegAnatomyV1-neg,EasyNegative,FastNegativeV2,"
    ],
    "seed": -1,
    "all_seeds": [],
    "subseed": -1,
    "all_subseeds": [],
    "subseed_strength": 0,
    "width": 512,
    "height": 512,
    "sampler_name": "DPM++ 2M Karras",
    "cfg_scale": 7,
    "steps": 10,
    "batch_size": 3,
    "restore_faces": true,
    "face_restoration_model": "face_yolov8n",
    "sd_model_name": "majicMIX realistic_v7",
    "sd_model_hash": "7c819b6d13",
    "sd_vae_name": "vae-ft-mse-840000-ema-pruned.safetensors",
    "sd_vae_hash": "735e4c3a44",
    "seed_resize_from_w": -1,
    "seed_resize_from_h": -1,
    "denoising_strength": 0.7,
    "ADetailer model": "face_yolov8n.pt",
    "ADetailer confidence": 0.3,
    "ADetailer dilate erode": 4,
    "ADetailer mask blur": 4,
    "ADetailer denoising strength": 0.4,
    "ADetailer inpaint only masked": true,
    "ADetailer inpaint padding": 32,
    "ADetailer version": "24.5.1",
    "ad_model": [
      "face_yolov8n.pt",
      "face_yolov8s.pt",
      "hand_yolov8n.pt",
      "person_yolov8n-seg.pt",
      "person_yolov8s-seg.pt",
      "mediapipe_face_full",
      "mediapipe_face_short",
      "mediapipe_face_mesh",
      "mediapipe_face_mesh_eyes_only"
    ],
    "Denoising strength": 0.7,
    "Hires upscale": 2,
    "Hires upscaler": "Latent",
    "Lora hashes": "ranxiaoran: 66addc7c12ed, beautiful_girl: e11697f11586",
    "index_of_first_image": 0,
    "styles": [

    ],
    "job_timestamp": "20240615194619",
    "clip_skip": 2,
    "is_using_inpainting_conditioning": false,
    "version": "v1.8.0"
  }).then((res) => {
    if (res) {
      state.images = res.data.images
      console.log(state.images)
    }
  })
}

</script>