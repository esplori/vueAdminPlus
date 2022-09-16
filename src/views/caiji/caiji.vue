<template>
  <div class="page-list">
    <div class="handle">
      <el-form :model="state.params" label-width="80px">
        <el-form-item label="采集页码:">
          <el-input v-model.number="state.params.pageNo"></el-input>
        </el-form-item>
        <el-form-item label="采集条数:">
          <el-input v-model.number="state.params.pageSize"></el-input>
        </el-form-item>
        <el-form-item label="分类:">
          <el-select v-model="state.params.cate" placeholder="请选择" @change="optionChange">
            <el-option v-for="item in state.options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">开始采集</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="商品名称">
        <template #default="scope">
          <a :href="scope.row.url">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <img :src="scope.row.pict_url" alt="" width="200px" height="120px" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { getCateApi, getTbkShopListApi, delTbkApi } from "@/views/API/tbk.js";
import { reactive, onMounted } from "vue"
import { ElMessage } from "element-plus"
const state = reactive({
  list: [],
  params: {
    pageNo: 1,
    pageSize: 20,
    keyWords: "",
    cate: "",
  },
  options: [],
})
onMounted(() => {
  getCate();
})
const optionChange = (val:any) => {
  const filterArr = state.options.filter((item:any) => {
    return item.id === val;
  });
  if (filterArr.length) {
    state.params.keyWords = filterArr[0].name;
  }
}
const getCate = async () => {
  const res: any = await getCateApi({});
  if (res) {
    state.options = res.data;
  }
}

const getList = async () => {
  if (!state.params.cate) {
    ElMessage.warning("请选择分类");
    return;
  }
  const res: any = await getTbkShopListApi(state.params);
  if (res) {
    state.list = res.data.result;
  }
}
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;

  .content-item {
    font-size: 18px;
    text-align: left;
    padding: 5px;
  }
}
</style>
