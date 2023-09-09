<template>
  <div class="ebook" v-loading="state.loading">
    <div class="title"></div>
    <pre>{{ state.currPageStr }}</pre>
    <div class="pagination">
      <span class="total">共:{{ state.total }} 页</span>
      <span>第{{ state.params.page + 1 }} 页</span>
      <span class="pre-next">
        <span @click="prePage" v-if="state.params.page > 0">上一页</span>
        <span @click="nextPage" v-if="state.params.page < state.total"
          >下一页</span
        >
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import contextPath from "@/utils/context-path.js";
const route = useRoute();
const state = reactive({
  loading: false,
  params: {
    page: 0,
    pageSize: 2000,
  },
  total: 0,
  txtList: [],
  currPageStr: "",
  txtPre: "",
});
const urlToBlob = () => {
  const file_url =
    contextPath + "/tools/getBookDetail?filename=" + route.query.filename;
  //可以是具体.txt也可以是接口返回的blob，或者web转换
  const xhr = new XMLHttpRequest();
  state.loading = true;
  xhr.open("get", file_url, true);
  let userinfo: any = localStorage.getItem("userInfo");
  if (userinfo) {
    userinfo = JSON.parse(userinfo);
    xhr.setRequestHeader("Authorization", userinfo.token);
  }
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.response);
      const reader = new FileReader();
      reader.onload = function () {
        state.txtPre = reader.result as any; //获取的数据data
        // 显示第一页
        state.currPageStr = state.txtPre.slice(0, 2000);
        state.total = Math.ceil(state.txtPre.length / state.params.pageSize);
      };
      reader.readAsText(this.response, "utf8");
      state.loading = false;
    }
  };
  xhr.send();
};
const nextPage = () => {
  if (state.params.page < state.total) {
    state.currPageStr = state.txtPre.slice(
      state.params.pageSize * ++state.params.page,
      state.params.pageSize * state.params.page + state.params.pageSize
    );
  }
};
const prePage = () => {
  if (state.params.page <= state.total && state.params.page > 0) {
    state.currPageStr = state.txtPre.slice(
      state.params.pageSize * --state.params.page,
      state.params.pageSize * state.params.page + state.params.pageSize
    );
  }
};
onMounted(() => {
  urlToBlob();
});
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

  .pagination {
    text-align: center;
    padding-top: 20px;
    .total {
      margin-right: 20px;
    }
    .pre-next {
      margin-left: 20px;
      padding-left: 20px;
      span {
        margin-right: 20px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }

        &:last-child:hover {
          text-decoration: none;
        }
      }
    }
  }
}
</style>
