<template>
  <div id="img2base64">
    <searchHeader :title="'图片转base64'"></searchHeader>
    <h2 style="padding: 20px 0">方案一：网络图片生成base64</h2>
    <div>
      <el-input v-model="state.url"></el-input>
    </div>
    <div style="padding: 20px 0">
      <el-button @click="generated" type="primary">生成base64</el-button>
    </div>
    <div id="pic" style="margin-bottom: 20px"></div>
    <el-input type="textarea" v-model="state.base64Url1" :rows="8"></el-input>
    <h2 style="padding: 20px 0">方案二：本地上传图片生成base64</h2>
    <div style="padding: 20px 0">
      <input type="file" id="imagefile" />
      <input
        style="paddding: 20px 0"
        type="button"
        value="读取图像"
        @click="readAsDataURL"
      />
    </div>
    <div id="localPic" style="margin-bottom: 20px"></div>
    <el-input type="textarea" v-model="state.base64Url2" :rows="8"></el-input>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import searchHeader from "../../components/searchHeader.vue";

const state = reactive({
  url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile03.16sucai.com%2F2017%2F1100%2F16sucai_p567c138.JPG&refer=http%3A%2F%2Ffile03.16sucai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664888945&t=1d8aa77d380843401cd596f5573a8a84",
  base64Url1: "",
  base64Url2: "",
});
const getBase64Image = (img: any) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return false;
  }
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const dataURL = canvas.toDataURL("image/png");
  return dataURL;
};

const generated = () => {
  const img = document.createElement("img");
  img.src = state.url;
  // 此处自己替换本地图片的地址
  img.crossOrigin = "anonymous";
  img.onload = function () {
    const data: any = getBase64Image(img);
    const imgDom: any = document.createElement("img");
    imgDom.src = data;
    imgDom.width = "200";
    state.base64Url1 = data;
    const picdom: any = document.getElementById("pic");
    picdom.appendChild(imgDom);
  };
};

const readAsDataURL = () => {
  if (typeof FileReader === "undefined") {
    // 判断浏览器是否支持filereader
    document.body.innerHTML = "<p>抱歉，你的浏览器不支持 FileReader</p>";
    return false;
  }
  const dom = document.getElementById("imagefile") as any;
  const file = dom.files[0];
  if (!file) {
    return false;
  }
  if (!/image\/\w+/.test(file.type)) {
    // 判断获取的是否为图片文件
    alert("请确保文件为图像文件");
    return false;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    const result = document.getElementById("localPic");
    if (!result) {
      return false;
    }
    result.innerHTML =
      '<img style="width:400px" src="' + this.result + '" alt=""/>';
    state.base64Url2 = this.result as any;
  };
};
</script>

<style scoped lang="scss">
.img2base64 {
  .localPic {
    img {
      width: 30%;
    }
  }
}
</style>
