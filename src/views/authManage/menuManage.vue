<template>
  <div class="menu-manage">
    <searchHeader :title="'菜单管理'"></searchHeader>
    <el-row>
      <el-col :span="12">
        <el-tree node-key="menuId" default-expand-all :data="state.data" :expand-on-click-node="false"
          :props="state.defaultProps" @node-click="handleNodeClick">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span class="add-delete">
                <el-icon @click="state.showAdd = true">
                  <Plus />
                </el-icon>
                <el-icon @click="deleteMenuConfirm()">
                  <Delete />
                </el-icon>
              </span>
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="12">
        <el-form :model="state.form">
          <el-form-item label="菜单名称">
            <el-input v-model="state.form.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单地址">
            <el-input v-model="state.form.path"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序">
            <el-input-number v-model="state.form.sortIndex" :min="0" :max="100" />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="updateMenu(state.form)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="新增菜单" v-model="state.showAdd" width="30%">
      <div>
        <el-form :model="state.addForm">
          <el-form-item label="菜单名称">
            <el-input v-model="state.addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单地址">
            <el-input v-model="state.addForm.path"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.showAdd = false">取 消</el-button>
          <el-button type="primary" @click="append(state.addForm)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Delete } from "@element-plus/icons-vue";
import {
  insertMenuApi,
  getAllMenusApi,
  updateMenuApi,
  deleteMenuApi,
} from "../API/auth";

import { reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import searchHeader from "../components/searchHeader.vue";

const state = reactive({
  data: [],
  defaultProps: {
    children: "children",
    label: "name",
  },
  form: {
    name: "",
    path: "",
    menuId: "",
    sortIndex: null
  },
  addForm: {
    name: "",
    path: "",
  },
  showAdd: false,
});

onMounted(() => {
  getMenuList();
});
const getMenuList = async () => {
  getAllMenusApi({}).then((res: any) => {
    // 添加默认菜单
    const defaultMenu = [
      { name: "javascript技术分享", children: res.data.result },
    ];
    state.data = defaultMenu as any;
    state.form = {
      name: "",
      path: "",
      menuId: "",
    }
    state.addForm = {
      name: "",
      path: "",
    }
  });
};

const handleNodeClick = (data: any) => {
  state.form = JSON.parse(JSON.stringify(data));
};
const append = async (form: any) => {
  let parms = { ...form };
  if (state.form.menuId) {
    parms = Object.assign(parms, { parentId: state.form.menuId });
  }
  insertMenuApi({ ...parms }).then(() => {
    ElMessage.success("新增成功");
    state.showAdd = false;
    getMenuList();
  });
};
const updateMenu = async (form: any) => {
  updateMenuApi({ ...form }).then((res: any) => {
    ElMessage.success("保存成功");
    getMenuList();
  });
};
const deleteMenuConfirm = () => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteMenu(state.form);
  });
};
const deleteMenu = (form: any) => {
  deleteMenuApi({ menuId: form.menuId }).then((res: any) => {
    ElMessage.success("删除成功");
    getMenuList();
  });
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  align-items: center;

  .add-delete {
    margin-left: 8px;

    i {
      margin-left: 10px;
    }
  }
}
</style>
