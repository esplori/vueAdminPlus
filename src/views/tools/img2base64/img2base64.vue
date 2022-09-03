<template>
  <div id="img2base64">
    <h2 style="padding: 20px 0">方案一：网络图片生成base64</h2>
    <div><el-input v-model="url"></el-input></div>
    <div style="padding: 20px 0">
      <el-button @click="generated" type="primary">生成base64</el-button>
    </div>
    <div id="pic"></div>
    <el-input type="textarea" v-model="base64Url1" :rows="8"></el-input>
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
    <div id="localPic"></div>
    <el-input type="textarea" v-model="base64Url2" :rows="8"></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url:
        "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3922290090,3177876335&fm=26&gp=0.jpg?v=" +
        Math.random(),
      base64Url1: "",
      base64Url2: "",
    };
  },
  created() {},

  methods: {
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
      // return dataURL.replace("data:image/png;base64,", "");
    },
    generated() {
      var img = document.createElement("img");
      img.src = this.url;
      // 此处自己替换本地图片的地址
      img.crossOrigin = "anonymous";
      const _this = this;
      img.onload = function () {
        var data = _this.getBase64Image(img);
        var img1 = document.createElement("img");
        img1.src = data;
        _this.base64Url1 = data;
        document.getElementById("pic").appendChild(img1);
      };
    },
    readAsDataURL() {
      const _this = this;
      if (typeof FileReader === "undefined") {
        // 判断浏览器是否支持filereader
        document.body.innerHTML = "<p>抱歉，你的浏览器不支持 FileReader</p>";
        return false;
      }
      var file = document.getElementById("imagefile").files[0];
      if (!/image\/\w+/.test(file.type)) {
        // 判断获取的是否为图片文件
        alert("请确保文件为图像文件");
        return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        var result = document.getElementById("localPic");
        result.innerHTML =
          '<img style="width:400px" src="' + this.result + '" alt=""/>';
        _this.base64Url2 = this.result;
      };
    },
  },
};
</script>

<style scoped lang="less">
.img2base64 {
  .localPic {
    img {
      width: 30%;
    }
  }
}
</style>
