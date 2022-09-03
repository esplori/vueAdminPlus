<template>
  <div class="page-list">
    <el-button type="text" @click="insertCate">新增专题</el-button>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column label="名称">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="edit(scope.row)" type="text">编辑</el-button>
          <el-button @click="manage(scope.row)" type="text">管理</el-button>
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            v-if="scope.row.valid === '1'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" v-model="dialogVisible" width="30%">
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

<script>
import {
  deleteTopicApi,
  getTopicListApi,
  updateTopicApi,
  insertTopicApi,
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
      let res = await getTopicListApi(this.params);
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
      let res = await deleteTopicApi({ id: id });
      if (res) {
        this.$message.success("删除成功");
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
    manage(row) {
      this.$router.push({ path: "/topicManage", query: { id: row.id } });
    },
    async submit(row) {
      if (row.id) {
        let res = await updateTopicApi(row);
        if (res) {
          this.getList();
        }
      } else {
        let res = await insertTopicApi(row);
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
