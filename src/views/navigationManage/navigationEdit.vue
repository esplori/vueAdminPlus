<template>
  <div class="post">
    <el-form label-width="80px" :model="state.form">
      <el-form-item label="名称：">
        <el-input v-model="state.form.title"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="state.form.url" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea" v-model="state.form.content" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="分类：">
        <el-select v-model="state.form.cate">
          <el-option v-for="(item, index) in state.cateList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit" type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import {
  postPageApi,
  editPageApi,
  getDetailApi,
} from "@/views/API/navigation.js";
import { getNavCateApi } from "@/views/API/admin.js";
import { ref, reactive, onMounted, toRef } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
let route = useRoute();
let router = useRouter();
let state = reactive({
  form: {
    id: "",
    title: "",
    content: "",
    cate: "",
    url: "",
  },
  cateList: [{name:"",id:""}]
});
onMounted(() => {
  const id = route.query.id;
  if (id) {
    getDetail(id);
  }
  getNavCateList();
});
const getNavCateList = async () => {
  const res: any = await getNavCateApi({});
  if (res) {
    state.cateList = res.data.map((item: any) => {
      item.id = String(item.id);
      return item;
    });
  }
};

const submit = async () => {
  if (state.form.id) {
    editPage();
  } else {
    postPage();
  }
};

const editPage = async () => {
  const res = await editPageApi({ ...state.form });
  if (res) {
    ElMessage.success("修改成功");
    router.push({ path: "list" });
  }
};

const postPage = async () => {
  const res = await postPageApi({ ...state.form });
  if (res) {
    ElMessage.success("添加成功");
    router.push({ path: "list" });
  }
};

const getDetail = async (id: any) => {
  const res: any = await getDetailApi({ id: id });
  if (res) {
    let { cate, content, id, title, url } = res.data.result;
    state.form.id = id;
    state.form.cate = cate;
    state.form.content = content;
    state.form.title = title;
    state.form.url = url;
  }
};
</script>

<style scoped lang="scss">
.post {
  width: 100%;
}
</style>
