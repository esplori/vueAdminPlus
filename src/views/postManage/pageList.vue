<template>
  <div class="page-list">
    <div class="select-by-cate">
      <div>
        <span class="insert"><el-button type="primary" @click="insert">新增文章</el-button></span>
        <span>按分类筛选：</span>
        <el-select v-model="state.params.cate" @change="typeChange" clearable>
          <el-option v-for="(item, index) in state.cateList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-input v-model="state.params.tag" placeholder="输入关键字搜索" @change="tagChange"></el-input>
      </div>
    </div>
    <el-table :data="state.list" @sort-change="sortCchange">
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column label="标题" width="200px">
        <template #default="scope">
          <a style="color: #333; text-decoration: underline" :href="
            'https://www.dsiab.com/post/' + (scope.row.uid || scope.row.id)
          " target="_blank">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cateName"> </el-table-column>
      <el-table-column label="作者" prop="createBy"> </el-table-column>
      <el-table-column label="阅读" sortable="custom" prop="views">
      </el-table-column>
      <el-table-column label="字数" sortable="custom" prop="wordsNum">
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createDate">
      </el-table-column>
      <el-table-column fixed="right" width="270" label="操作">
        <template #default="scope">
          <el-button @click="edit(scope.row.id)" type="primary">编辑</el-button>
          <el-button @click="delConfirm(scope.row.id)" type="danger" class="cus-button-danger">删除</el-button>
          <el-button v-if="userInfo.includes('ROLE_admin')" @click="addToTopic(scope.row)" type="primary">添加到专题
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="state.params.page" :page-size="state.params.pageSize" :page-sizes="[10, 20, 30, 50]"
        :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="state.total">
      </el-pagination>
    </div>

    <el-dialog title="添加到专题" v-model="state.dialogVisible" width="30%">
      <div>
        <el-select v-model="state.form.topicId">
          <el-option v-for="(item, index) in state.topicList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTopic()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  delApi,
  getListByCateApi,
  getAdminCateValidApi,
  getTopicListApi,
  addPostToTopicApi,
  getListByTagsApi,
} from "@/views/API/admin.js";
import { reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const state = reactive({
  list: [],
  params: {
    page: 1,
    cate: null,
    pageSize: 10,
    order: "desc",
    orderBy: "createDate",
    tag: ""
  },
  form: {
    postId: "",
    name: "",
    topicId: "",
  },
  total: 0,
  cateList: [{name:"",id:""}],
  dialogVisible: false,
  topicList: [{name:"",id:""}],
});
onMounted(() => {
  getCate();
  // 恢复之前查询的参数
  const { page, cate, pageSize } = route.query as any;
  state.params.page = parseInt(page) || 1;
  state.params.pageSize = parseInt(pageSize) || 10;
  state.params.cate = (parseInt(cate) || null) as any;
  getList();
});

const insert = () => {
  router.push({ path: "post"});
};

const userInfo = computed(() => {
  let uinfo = localStorage.getItem("userInfo") as any;
  if (uinfo) {
    uinfo = JSON.parse(uinfo).role.split(",");
  } else {
    uinfo = [];
  }
  return uinfo;
});

const tagChange = (val: any) => {
  getListByTags(val);
};
const getListByTags = async (val: any) => {
  const res: any = await getListByTagsApi({ tag: val ,page: 1 });
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
  }
};
const sortCchange = (column: any ) => {
  state.params.page = 1;
  // 需要转换成sql对应的排序字段
  state.params.order = column.order === "ascending" ? "asc" : "desc";
  state.params.orderBy = column.prop;
  getList();
};

const getTopicList = async () => {
  const res: any = await getTopicListApi({});
  if (res) {
    state.topicList = res.data.result;
  }
};

const typeChange = async () => {
  state.params.page = 1;
  getList();
};

const getList = async () => {
  getListByCate();
};

const getCate = async () => {
  const res: any = await getAdminCateValidApi({});
  if (res) {
    state.cateList = res.data.result;
  }
};

const getListByCate = async () => {
  const res: any = await getListByCateApi(state.params);
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
  }
};

const delConfirm = async (id: any) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    del(id);
  });
};

const del = async (id: any) => {
  const res = await delApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};

const edit = async (id: any) => {
  router.push({ path: "post", query: { id: id, ...state.params } });
};

const handleSizeChange = async (val: any) => {
  state.params.pageSize = val;
  getList();
};

const handleCurrentChange = async (val: any) => {
  state.params.page = val;
  getList();
};

const addToTopic = async (row: any) => {
  getTopicList();
  state.dialogVisible = true;
  state.form.postId = row.uid || row.id;
  state.form.name = row.title;
};

const submitTopic = async () => {
  const res = await addPostToTopicApi(state.form);
  if (res) {
    ElMessage.success("添加成功");
    state.dialogVisible = false;
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;

  .select-by-cate {
    margin: 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
    .insert{
      margin-right: 20px;
    }
  }

  .content-item {
    font-size: 18px;
    text-align: left;
    padding: 5px;
  }
}
</style>
