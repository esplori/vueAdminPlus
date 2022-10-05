<template>
  <div class="menu-manage">
    <el-row>
      <el-col :span="12">
        <el-tree node-key="menuId" :load="loadNode" lazy :data="state.data" :expand-on-click-node="false"
          :props="state.defaultProps" @node-click="handleNodeClick">
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
          <el-form-item label="">
            <el-button type="primary" @click="state.showAdd = true">新增</el-button>
            <el-button type="primary" @click="updateMenu(state.form)">保存</el-button>
            <el-button type="danger" @click="deleteMenuConfirm(state.form)">删除</el-button>
          </el-form-item>
        </el-form>
        <div v-if="state.showAdd">
          <div style="text-align: center;padding:10px;border-bottom: 1px solid #ddd;margin-bottom:10px;">新增菜单</div>
          <el-form :model="state.addForm">
            <el-form-item label="菜单名称">
              <el-input v-model="state.addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单地址">
              <el-input v-model="state.addForm.path"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button @click="append(state.addForm)">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script lang="ts" setup>
import {
  insertMenuApi,
  getMenuListApi,
  updateMenuApi,
  deleteMenuApi
} from "../API/auth";

import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

let state = reactive({
  data: [],
  defaultProps: {
    children: 'children',
    label: 'name',
  },
  form: {
    name: "",
    path: "",
    menuId: ""
  },
  addForm: {
    name: "",
    path: ""
  },
  showAdd: false
});

onMounted(() => {
  getMenuList();
});
const getMenuList = async () => {
  getMenuListApi({}).then((res: any) => {
    // 添加默认菜单
    // let defaultMenu = [{ name: "javascript技术分享" }]
    state.data = res.data.result;
    state.form = {
      name: "",
      path: "",
      menuId: ""
    },
      state.addForm = {
        name: "",
        path: ""
      }
  })
}

const handleNodeClick = (data: any) => {
  state.form = JSON.parse(JSON.stringify(data))
};
const append = async (form: any) => {
  let parms = { ...form }
  if (state.form.menuId) {
    parms = Object.assign(parms, { parentId: state.form.menuId })
  }
  insertMenuApi({ ...parms }).then(() => {
    ElMessage.success("新增成功")
    getMenuList();
  })
  // getMenuList()
};
const loadNode = async (node: any, resolve: (data: any) => void) => {
  if (!node.data.menuId) {
    return
  }
  setTimeout(() => {
    let data = []
    getMenuListApi({ menuId: node.data.menuId }).then((res: any) => {
      // 添加默认菜单
      // let defaultMenu = [{ name: "javascript技术分享" }]
      data = res.data.result;
      resolve(data)
    })
  }, 200)
}
const updateMenu = async (form: any) => {
  updateMenuApi({ ...form }).then((res: any) => {
    ElMessage.success("保存成功")
    getMenuList();
  })
}
const remove = (data: any, parentNode: any) => {
};
const deleteMenuConfirm = () => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteMenu(state.form);
  });
}
const deleteMenu = (form: any) => {
  deleteMenuApi({ menuId: form.menuId }).then((res: any) => {
    ElMessage.success("删除成功")
    getMenuList();
  })
}
</script>

<style scoped lang="scss">
.menu-manage {
  padding: 20px;
}
</style>
