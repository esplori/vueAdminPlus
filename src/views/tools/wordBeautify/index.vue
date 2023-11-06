<template>
  <div class="wordBeautify">
    <searchHeader :title="'文字美化'"></searchHeader>
    <el-form :model="state.form" style="width: 100%">
      <el-form-item label="内容：">
        <el-input type="textarea" v-model="state.form.content" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="签名：">
        <el-input type="textarea" v-model="state.form.sign" :rows="2"></el-input>
      </el-form-item>
    </el-form>
    <div class="word-container">
      <div class="word-style">
        <!-- 需要对文本域中的换行符特殊处理 -->
        <div v-html="state.form.content.replace(/[\r\n]/g, '<div style=height:10px;color:transparent>_</div>')"></div>
        <div class="word-sign" v-if="state.form.sign">
          {{ state.form.sign }}
        </div>
      </div>
    </div>
    <div style="text-align: center;">
      <el-button type="primary" @click="generateToImg">导出图片</el-button>
    </div>
    <img :src="state.imgurl" alt="">
  </div>
</template>

<script lang="ts" setup>

import { reactive } from "vue";
import searchHeader from "../../components/searchHeader.vue";
import Html2canvas from "html2canvas";
const state = reactive({
  form: {
    content: `忽有故人心上过，
回首山河已是秋。
两处相思同淋雪，
此生也算共白头。`,
    sign: "部分取自龚自珍-《己亥杂诗》",
  },
  imgurl: ""
});
const generateToImg = () => {
  setTimeout(() => {
    // #capture 就是我们要获取截图对应的 DOM 元素选择器
    Html2canvas(document.querySelector('.word-container') as any, {
      useCORS: true, // 【重要】开启跨域配置
      backgroundColor: null, // null或transparent可将canvas背景设置为透明，解决圆角问题
      // scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
      // dpi: window.devicePixelRatio * 2, //设备像素比
      allowTaint: true, // 允许跨域图片
    }).then((canvas) => {
      const url = canvas.toDataURL('image/png', 1.0);
      let a = document.createElement("a"); // 生成一个a元素
      a.download = "download.png"; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.click();
    });
  }, 300);
} 
</script>
<style lang="scss" scoped>
.word-container {
  width: 400px;
  margin: 20px auto;
  background: url("../../../assets/images/wordbg.jpg") no-repeat;
  background-size: cover;
  border-radius: 10px;

  .word-style {
    text-align: left;
    // border: 1px solid #ccc;
    opacity: 1;
    color: #fff;
    padding: 20px;
    // border-radius: 10px;
    font-size: 16px;
    line-height: 1.6rem;
    word-break: break-all;
    
    .word-sign {
      padding-top: 10px;
      font-size: 0.8rem;
    }
  }
}
</style>
