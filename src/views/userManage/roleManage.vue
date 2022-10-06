<template>
  <div class="role-manage">
    <el-table :data="state.data">
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleId" label="角色id"> </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button @click="edit(scope.row)" type="primary">编辑</el-button>
          <el-button @click="deleteMenuConfirm(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="角色修改"
      v-model="state.editObj.dialogVisible"
      width="30%"
    >
      <div>
        <el-input v-model="state.editObj.rolename"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.editObj.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getRoleListApi,updateRoleNameApi } from "../API/admin";
import { ref, onMounted,reactive } from "vue";
import { ElMessageBox } from "element-plus";

let state = reactive({
  data: [],
  editObj: {
    dialogVisible: false,
    rolename: "",
    roleId: ""
  }
});
onMounted(() => {
  getRoleLis();
});

const getRoleLis = async () => {
  const res:any = await getRoleListApi({});
  if (res) {
    state.data = res.data.result;
  }
};

const edit = (row: any) => {
  state.editObj.dialogVisible = true;
  state.editObj.rolename = row.roleName;
  state.editObj.roleId = row.id;
};

const deleteMenuConfirm = (row: any) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // deleteMenu(state.form);
  });
}

const submit = async (row: any) => {
  updateRoleNameApi({
    roleName: state.editObj.rolename,
    id:state.editObj.roleId
  }).then((res:any) =>{
    state.editObj.dialogVisible = false;
    getRoleLis();
  })
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
