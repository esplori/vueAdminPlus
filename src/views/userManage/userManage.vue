<template>
  <div class="user-manage">
    <el-button @click="insertUser" type="text ">新增用户</el-button>
    <el-table :data="data">
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="role" label="角色Id"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="valid" label="是否有效">
        <template #default="scope">
          <span v-show="scope.row.valid === '1'">是</span>
          <span style="color: red" v-show="scope.row.valid === '0'">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间"> </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button @click="edit(scope.row)" type="text">编辑</el-button>
          <!-- 不允许删除管理员 -->
          <el-button
            @click="delConfirm(scope.row.id, scope.row.username)"
            type="text"
            class="cus-button-danger"
            :disabled="scope.row.role.indexOf('admin') !== -1"
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
        :page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="editObj.currUsername + '角色修改'"
      v-model="editObj.dialogVisible"
      width="30%"
    >
      <div>
        <el-table
          :data="Roledata"
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
          <el-button @click="editObj.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="新增用户" v-model="insertObj.dialogVisible" width="30%">
      <div>
        <el-form :model="form" label-width="60px">
          <el-form-item label="用户名">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="insertObj.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="insert">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  getUserListApi,
  getRoleListApi,
  updateRoleApi,
  insertUserApi,
  deleUserApi,
} from "../API/admin";

import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessageBox } from "element-plus";

let data = ref([]);
let Roledata = ref([]);
let params = reactive({
  page: 1,
  pageSize: 10,
});
let total = ref(0);
let editObj = reactive({
  dialogVisible: false,
  currUsername: "",
});
let insertObj = reactive({
  dialogVisible: false,
});
let multipleSelection = ref([]);
let form = reactive({
  username: "",
  password: "",
});
onMounted(() => {
  getUserList();
});

const getUserList = async () => {
  const res = await getUserListApi({ page: params.page });
  if (res) {
    data.value = res.data.result;
    total.value = res.data.total;
  }
};

const insert = async () => {
  const res = await insertUserApi({
    ...form,
  });
  if (res) {
    insertObj.dialogVisible = false;
    getUserList();
  }
};

const insertUser = () => {
  insertObj.dialogVisible = true;
};

const edit = (row: any) => {
  editObj.dialogVisible = true;
  editObj.currUsername = row.username;
  getRoleList(row);
};

const delConfirm = (id: String, username: String) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    del(id, username);
  });
};
const del = (id: String, username: String) => {
  delUser(id, username);
};

const delUser = async (id: String, username: String) => {
  const res = await deleUserApi({ id, username });
  if (res) {
    getUserList();
  }
};

const RoleTable = ref();

const getRoleList = async (row: any) => {
  const res = await getRoleListApi({});
  if (res) {
    Roledata.value = res.data.result;
    Roledata.value.forEach((item:any, index) => {
      if (row.role.indexOf(item.roleId) !== -1) {
        nextTick(() => {
          RoleTable.value.toggleRowSelection(Roledata.value[index], true);
        });
      }
    });
  }
};

const submit = () => {
  updateRole();
  // todo
  editObj.dialogVisible = false;
};

const updateRole = async () => {
  const res = await updateRoleApi({
    roleList: multipleSelection.value,
    username: editObj.currUsername,
  });
  if (res) {
    editObj.dialogVisible = false;
    getUserList();
  }
};

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};

const handleSizeChange = (val: any) => {
  params.pageSize = val;
  getUserList();
};

const handleCurrentChange = (val: any) => {
  params.page = val;
  getUserList();
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
