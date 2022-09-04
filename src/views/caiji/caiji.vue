<template>
  <div class="page-list">
    <div class="handle">
      <el-form :model="params" label-width="80px">
        <el-form-item label="采集页码:">
          <el-input v-model.number="params.pageNo"></el-input>
        </el-form-item>
        <el-form-item label="采集条数:">
          <el-input v-model.number="params.pageSize"></el-input>
        </el-form-item>
        <el-form-item label="分类:">
          <el-select
            v-model="params.cate"
            placeholder="请选择"
            @change="optionChange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">开始采集</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" style="width: 100%">
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

<script lang="ts">
import { getCateApi, getTbkShopListApi, delTbkApi } from "@/views/API/tbk.js";

export default {
  data() {
    return {
      list: [],
      params: {
        pageNo: 1,
        pageSize: 20,
        keyWords: "",
        cate: "",
      },
      options: [],
    };
  },
  created() {
    this.getCate();
  },
  methods: {
    optionChange(val) {
      const filterArr = this.options.filter((item) => {
        return item.id === val;
      });
      if (filterArr.length) {
        this.params.keyWords = filterArr[0].name;
      }
    },
    async getCate() {
      const res = await getCateApi({});
      if (res) {
        this.options = res.data;
      }
    },
    async getList() {
      if (!this.params.cate) {
        this.$message.warning("请选择分类");
        return;
      }
      const res = await getTbkShopListApi(this.params);
      if (res) {
        this.list = res.data.result;
      }
    },
  },
};
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
