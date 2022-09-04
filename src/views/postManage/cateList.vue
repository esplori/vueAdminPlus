<template>
  <div class="page-list">
    <el-button type="text" @click="insertCate">新增分类</el-button>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column label="标题">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="edit(scope.row)" type="text">编辑</el-button>
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            v-if="scope.row.valid === 1 && scope.$index !== 0"
            >删除</el-button
          >
          <el-button
            @click="revertConfirm(scope.row.id)"
            type="text"
            class="cus-button-info"
            v-if="scope.row.valid === 0"
            >恢复</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="30%"
      @close="handleClose"
    >
      <div>
        <el-input v-model="row.name" placeholder="请输入名称"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit(row)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  delCateApi,
  getCateApi,
  updateCateApi,
  insertCateApi,
  revertCateApi,
} from "@/views/API/admin.js";

export default {
  data() {
    return {
      list: [],
      dialogVisible: false,
      title: "新增",
      row: {
        id: "",
        name: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    insertCate() {
      this.dialogVisible = true;
      this.title = "新增";
    },
    async getList() {
      const res = await getCateApi(this.params);
      if (res) {
        this.list = res.data.result;
        this.total = res.data.total;
      }
    },
    revertConfirm(id) {
      this.$confirm("此操作恢复该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.revert(id);
      });
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
      const res = await delCateApi({ id: id });
      if (res) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
    async revert(id) {
      const res = await revertCateApi({ id: id });
      if (res) {
        this.$message.success("恢复成功");
        this.getList();
      }
    },
    /**
     * 编辑
     */
    edit(row) {
      this.title = "编辑";
      this.dialogVisible = true;
      this.row = row;
    },
    async submit(row) {
      if (row.id) {
        const res = await updateCateApi(row);
        if (res) {
          this.getList();
        }
      } else {
        const res = await insertCateApi(row);
        if (res) {
          this.getList();
        }
      }
      this.dialogVisible = false;
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    handleClose() {
      this.row = {
        id: "",
        name: "",
      };
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
