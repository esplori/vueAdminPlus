<template>
  <div class="page-list">
    <div class="handle">
      <!-- <el-button type="primary" @click="multipleDel">批量删除</el-button> -->
    </div>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" width="55" label="序号"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="content" label="描述"> </el-table-column>
      <el-table-column prop="url" label="地址"> </el-table-column>
      <el-table-column prop="createDate" label="创建日期"> </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { delApi, getListApi } from "@/views/API/navigation.js";

export default {
  data() {
    return {
      list: [],
      params: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      let res = await getListApi(this.params);
      if (res) {
        this.list = res.data.result;
        this.total = res.data.total;
      }
    },
    delConfirm(id) {
      this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.del(id);
      });
    },
    async del(id) {
      let res = await delApi({ id: id });
      if (res) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
    /**
     * 编辑
     */
    edit(id) {
      this.$router.push({ path: "navigationEdit", query: { id: id } });
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    multipleDel(condition) {},
  },
};
</script>

<style scoped lang="less">
.page-list {
  width: 100%;
  .content-item {
    font-size: 18px;
    text-align: left;
    padding: 5px;
  }
}
</style>
