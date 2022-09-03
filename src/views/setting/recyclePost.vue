<template>
  <div class="page-list">
    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <a
            style="color: #333"
            :href="'https://www.dsiab.com/post/' + scope.row.id"
            target="_blank"
            >{{ scope.row.title }}</a
          >
        </template>
      </el-table-column>
      <el-table-column label="分类" width="120px">
        <template slot-scope="scope">
          {{ scope.row.cateName }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="120px">
        <template slot-scope="scope">
          {{ scope.row.createBy }}
        </template>
      </el-table-column>
      <el-table-column label="阅读" width="120px">
        <template slot-scope="scope">
          {{ scope.row.views }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="delMul">
      <el-button @click="delMul">批量删除</el-button>
    </div>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  deletePostApi,
  getPostListByCateApi,
  getCateValidApi,
} from "@/views/API/admin.js";

export default {
  data() {
    return {
      list: [],
      params: {
        page: 1,
        cate: "",
        pageSize: 10,
      },
      total: 0,
      cateList: [],
      multipleSelection: [],
    };
  },
  created() {
    // 恢复之前查询的参数
    let { page, cate, pageSize } = this.$route.query;
    this.params.page = parseInt(page) || 1;
    this.params.pageSize = parseInt(pageSize) || 10;
    this.params.cate = parseInt(cate) || "";
    this.getList();
  },
  methods: {
    getList() {
      this.getListByCate();
    },
    async getListByCate() {
      const res = await getPostListByCateApi(this.params);
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
        this.delMultiple([id]);
      });
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delMul() {
      this.$confirm("此操作将删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.delMultiple(
          this.multipleSelection.map((item) => {
            return item.id;
          })
        );
      });
    },
    async delMultiple(ids) {
      const res = await deletePostApi({ ids: ids });
      if (res) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
  },
};
</script>

<style scoped lang="less">
.page-list {
  width: 100%;
  .select-by-cate {
    margin-bottom: 20px;
  }
  .content-item {
    font-size: 18px;
    text-align: left;
    padding: 5px;
  }
  .delMul {
    padding: 10px 0;
  }
}
</style>
