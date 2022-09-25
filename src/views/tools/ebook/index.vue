<template>
  <div class="ebook">
    <div v-for="item in state.data" class="item" @click="detail">
      {{item.filename}}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getBookListApi } from "../../API/tools";
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router"
let router = useRouter()
let state = reactive({
  data: [
    {filename:""}
  ],
  total: 0,
  params: {
    page: 1,
    pageSize: 10
  }
})
onMounted(() => {
  getBookList();
});

const getBookList = async () => {
  const res: any = await getBookListApi({ page: state.params.page });
  if (res) {
    state.data = res.data.result;
    state.total = res.data.total;
  }
};
const detail = () => {
  debugger
  router.push({
    path: "ebookDetail"
  })
}
</script>
<style scoped lang="scss">
.ebook {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .item {
    cursor: pointer;
    width: 120px;
    height: 140px;
    border: 1px solid #ddd;
    background: #ebe5d8;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-top: 10px;

  }
}
</style>
