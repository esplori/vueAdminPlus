<template>
  <div class="role-manage">
    <searchHeader :title="'角色管理'"></searchHeader>
    <el-table :data="state.data">
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleId" label="角色id"> </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button link @click="edit(scope.row)" type="primary"
            >编辑</el-button
          >
          <el-button link @click="deleteMenuConfirm(scope.row)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="角色修改"
      v-model="state.editObj.dialogVisible"
      width="50%"
    >
      <div>
        <el-form>
          <el-form-item label="角色名称：">
            <el-input v-model="state.editObj.rolename"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限：">
            <div class="tree-container">
              <el-tree
                check-strictly
                node-key="menuId"
                v-model="state.checkedKeys"
                ref="treeRef"
                show-checkbox
                default-expand-all
                :data="state.treeData"
                :expand-on-click-node="false"
                :props="state.defaultProps"
              >
              </el-tree>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.editObj.dialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  getRoleListApi,
  updateRoleNameApi,
  getMenuByRoleApi,
} from "../API/admin";
import { getAllMenusApi } from "../API/auth";
import { ref, onMounted, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";

const state = reactive({
  data: [],
  editObj: {
    dialogVisible: false,
    rolename: "",
    roleId: 0,
  },
  treeData: [],
  defaultProps: {
    children: "children",
    label: "name",
  },
  checkedKeys: [],
});
onMounted(() => {
  getRoleList();
});

const getRoleList = async () => {
  const res: any = await getRoleListApi({});
  if (res) {
    state.data = res.data.result;
  }
};

const getMenuByRole = async (roleId: number) => {
  const res: any = await getMenuByRoleApi({
    roleId,
  });
  if (res) {
    treeRef.value.setCheckedKeys(res.data.result);
  }
};

const treeRef = ref();

const edit = (row: any) => {
  state.editObj.dialogVisible = true;
  state.editObj.rolename = row.roleName;
  state.editObj.roleId = row.id;
  getMenuList();
  getMenuByRole(state.editObj.roleId);
};

const deleteMenuConfirm = (row: any) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // deleteMenu(state.form);
  });
};

const submit = async (row: any) => {
  const checkedKeys = treeRef.value.getCheckedKeys();
  updateRoleNameApi({
    roleName: state.editObj.rolename,
    id: state.editObj.roleId,
    checkedKeys: checkedKeys,
  }).then((res: any) => {
    state.editObj.dialogVisible = false;
    ElMessage.success("保存成功");
    getRoleList();
  });
};

const getMenuList = async () => {
  getAllMenusApi({}).then((res: any) => {
    // 添加默认菜单
    // let defaultMenu = [{ name: "javascript技术分享", children: res.data.result }]
    state.treeData = res.data.result;
  });
};
</script>

<style scoped lang="scss">
.role-manage {
  .tree-container {
    height: 400px;
    padding: 20px 0;
    overflow-y: auto;
  }
}
</style>
