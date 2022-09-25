<template>
  <div class="ebook">
  </div>
</template>

<script lang="ts" setup>
import { getBookListApi } from "../../API/tools";
import { reactive, onMounted } from "vue";
let state = reactive({
  data: [],
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
</script>
<style scoped lang="scss">

</style>
