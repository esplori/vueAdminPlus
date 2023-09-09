<template>
  <searchHeader :title="'电子书'"></searchHeader>
  <div class="ebook">
    <div v-for="item in state.data" class="item" @click="detail(item.filename)">
      {{ item.filename.split(".")[0] }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getBookListApi } from "../../API/tools";
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import searchHeader from "../../components/searchHeader.vue";
const router = useRouter();
const state = reactive({
  data: [{ filename: "" }],
  total: 0,
  params: {
    page: 1,
    pageSize: 10,
  },
});
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
const detail = (filename: any) => {
  router.push({
    path: "ebookDetail",
    query: {
      filename: filename,
    },
  });
};
</script>
<style scoped lang="scss">
.ebook {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .item {
    cursor: pointer;
    width: 140px;
    height: 160px;
    border: 1px solid #ddd;
    background: #ebe5d8;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-top: 10px;
    padding: 0 10px;
    text-align: center;
    word-break: break-word;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
}
</style>
