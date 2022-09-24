<template>
  <div class="ebook">
    <!-- <div v-html="state.txtPre"></div> -->
    <pre>{{state.txtPre}}</pre>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from "vue";

let state = reactive({
  txtPre: ""
});
const urlToBlob = () => {
  // let file_url= 'http://admin.dsiab.com/eb/%E7%88%B1%E6%83%85%E6%95%85%E4%BA%8B.txt'
  // let file_url = '/static/eb/%E7%88%B1%E6%83%85%E6%95%85%E4%BA%8B.txt'
  let file_url = '/static/eb/船上_77119小说.txt'
  //可以是具体.txt也可以是接口返回的blob，或者web转换
  let xhr = new XMLHttpRequest();
  xhr.open("get", file_url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.response)
      const reader = new FileReader()
      reader.onload = function () {
        debugger
        state.txtPre = reader.result//获取的数据data
        console.log('reader.result', reader.result)
      }
      reader.readAsText(this.response, "GBK");
      // reader.readAsText(this.response);
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
  font-size: 18px;
  line-height: 2rem;
}
</style>
