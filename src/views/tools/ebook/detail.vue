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
  let file_url = '/bootService/tools/getBookDetail?filename=' + route.query.filename
  //可以是具体.txt也可以是接口返回的blob，或者web转换
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
      reader.readAsText(this.response, "utf8");
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
