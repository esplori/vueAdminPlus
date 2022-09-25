<template>
  <div class="ebook">
    <div class="title"></div>
    <pre>{{txtPre}}</pre>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"
let route = useRoute()
let txtPre: any = ref("");
const urlToBlob = () => {
  // let file_url= 'http://admin.dsiab.com/eb/%E7%88%B1%E6%83%85%E6%95%85%E4%BA%8B.txt'
  // let file_url = '/static/eb/%E7%88%B1%E6%83%85%E6%95%85%E4%BA%8B.txt'
  // let file_url = '/static/eb/船上.txt'
  let file_url = '/bootService/tools/getBookDetail?filename=' + route.query.filename
  //可以是具体.txt也可以是接口返回的blob，或者web转换
  debugger
  let xhr = new XMLHttpRequest();

  xhr.open("get", file_url, true);
  let userinfo: any = localStorage.getItem("userInfo");
  if (userinfo) {
    userinfo = JSON.parse(userinfo);
    xhr.setRequestHeader("Authorization", userinfo.token);
  }
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.response)
      const reader = new FileReader()
      reader.onload = function () {
        txtPre.value = reader.result//获取的数据data
        console.log('reader.result', reader.result)
      }
      reader.readAsText(this.response, "GBK");
    }
  };
  xhr.send();
}
onMounted(() => {
  urlToBlob()
})
</script>
<style scoped lang="scss">
.ebook {
  background: #ebe5d8;
  padding: 20px;
  font-size: 20px;
  line-height: 2rem;

  .title {
    text-align: center;
    font-size: 24px;
  }
}
</style>
