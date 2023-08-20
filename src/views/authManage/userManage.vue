<template>
  <div class="user-manage">
    <searchHeader :title="'用户管理'"></searchHeader>
    <el-table :data="state.data">
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="role" label="角色Id" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="valid" label="是否有效">
        <template #default="scope">
          <span v-show="scope.row.valid === '1'">是</span>
          <span style="color: red" v-show="scope.row.valid === '0'">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间"> </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button link @click="edit(scope.row)" type="primary"
            >编辑</el-button
          >
          <!-- 不允许删除管理员 -->
          <el-button
            @click="delConfirm(scope.row.id, scope.row.username)"
            type="danger"
            link
            :disabled="scope.row.role.indexOf('admin') !== -1"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="state.params.page"
        :page-size="state.params.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="5"
        layout="total, prev, pager, next"
        :total="state.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="state.editObj.currUsername + '角色修改'"
      v-model="state.editObj.dialogVisible"
      width="30%"
    >
      <div>
        <el-table
          :data="state.Roledata"
          ref="RoleTable"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="roleName" label="角色"> </el-table-column>
          <el-table-column prop="roleId" label="角色ID"> </el-table-column>
        </el-table>
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
  getUserListApi,
  getRoleListApi,
  updateUserRoleApi,
  deleUserApi,
} from "../API/admin";

import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessageBox } from "element-plus";
import searchHeader from "../components/searchHeader.vue";

const state = reactive({
  data: [],
  Roledata: [],
  params: {
    page: 1,
    pageSize: 10,
  },
  total: 0,
  editObj: {
    dialogVisible: false,
    currUsername: "",
  },
  multipleSelection: [],
});

onMounted(() => {
  getUserList();
});

const getUserList = async () => {
  const res: any = await getUserListApi({ pageNo: state.params.page });
  if (res) {
    state.data = res.data.result;
    state.total = res.data.total;
  }
};

const edit = (row: any) => {
  state.editObj.dialogVisible = true;
  state.editObj.currUsername = row.username;
  getRoleList(row);
};

const delConfirm = (id: string, username: string) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    del(id, username);
  });
};
const del = (id: string, username: string) => {
  delUser(id, username);
};

const delUser = async (id: string, username: string) => {
  const res = await deleUserApi({ id, username });
  if (res) {
    getUserList();
  }
};

const RoleTable = ref();

const getRoleList = async (row: any) => {
  const res: any = await getRoleListApi({});
  if (res) {
    state.Roledata = res.data.result;
    state.Roledata.forEach((item: any, index) => {
      if (row.role.indexOf(item.roleId) !== -1) {
        nextTick(() => {
          RoleTable.value.toggleRowSelection(state.Roledata[index], true);
        });
      }
    });
  }
};

const submit = () => {
  updateRole();
  // todo
  state.editObj.dialogVisible = false;
};

const updateRole = async () => {
  const res = await updateUserRoleApi({
    roleList: state.multipleSelection,
    username: state.editObj.currUsername,
  });
  if (res) {
    state.editObj.dialogVisible = false;
    getUserList();
  }
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};

const handleSizeChange = (val: any) => {
  state.params.pageSize = val;
  getUserList();
};

const handleCurrentChange = (val: any) => {
  state.params.page = val;
  getUserList();
};
</script>
