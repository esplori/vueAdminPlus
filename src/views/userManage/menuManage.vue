<template>
  <div class="role-manage">
    <el-table :data="data">
      <el-table-column  type="index" label="序号" width="55px"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleId" label="角色id"> </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
          <!-- <el-button @click="del(scope.row.id)" type="danger">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoleListApi } from "../API/admin";
export default {
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let res = await getRoleListApi({});
      if (res) {
        this.data = res.data.result;
      }
    },
    edit() {},
    del() {},
  },
};
</script>

<style scoped lang="scss">
.music {
  width: 100%;
  height: 100%;
  .music-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 600px;
    height: 400px;
    background: #001529;
    margin: auto;
  }
}
</style>
