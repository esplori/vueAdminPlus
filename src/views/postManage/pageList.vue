<template>
  <div class="page-list">
    <searchHeader :title="'文章管理'">
      <div class="select-by-cate">
        <div class="pdding">
          <span>分类：</span>
          <el-select v-model="state.params.cate" @change="typeChange" clearable>
            <el-option v-for="(item, index) in state.cateList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="pdding">
          <el-input v-model="state.params.tag" placeholder="输入关键字搜索" @change="tagChange"></el-input>
        </div>
        <span class="pdding"><el-button type="primary" @click="insert">新增文章</el-button></span>
        <span class="pdding"><el-button type="danger" @click="batchdel(state.multipleSelection)">批量删除</el-button></span>
      </div>
    </searchHeader>

    <el-table :data="state.list" @sort-change="sortCchange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30"> </el-table-column>
      <el-table-column label="标题" show-overflow-tooltip>
        <template #default="scope">
          <a style="color: #333" :href="'https://www.dsiab.com/post/' + (scope.row.uid || scope.row.id)
            " target="_blank">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="draft" sortable="draft" width="120px">
        <template #default="scope">
          <span :class="[scope.row.draft == '1' ? 'primary-active-color' : '']">{{ scope.row.draft == "1" ? "草稿" :
            "已发布" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cateName" width="120px"></el-table-column>
      <el-table-column label="阅读" sortable="custom" prop="views" width="80px"></el-table-column>
      <el-table-column label="字数" sortable="custom" prop="wordsNum" width="80px"></el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="createDate" width="180px"></el-table-column>
      <el-table-column fixed="right" width="160px" label="操作">
        <template #default="scope">
          <div class="operate">
            <el-button link type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <el-button link @click="delConfirm(scope.row.id)" type="danger">删除</el-button>
            <el-button link v-if="userInfo.includes('ROLE_admin')" @click="addToTopic(scope.row)" type="primary">加专题
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="state.params.page" :page-size="state.params.pageSize" :page-sizes="[10, 20, 30, 50, 100, 200]"
        :pager-count="5" layout="sizes, total, prev, pager, next, jumper" :total="state.total">
      </el-pagination>
    </div>

    <el-dialog title="添加到专题" v-model="state.dialogVisible" width="30%">
      <div class="add-topic">
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
  batchDelApi,
} from "@/views/API/admin.js";
import { reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import searchHeader from "../components/searchHeader.vue";
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
    tag: "",
  },
  form: {
    postId: "",
    name: "",
    topicId: "",
  },
  total: 0,
  cateList: [{ name: "", id: "" }],
  dialogVisible: false,
  topicList: [{ name: "", id: "" }],
  multipleSelection: [],
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
  // router.push({ path: "/post" });
  // 新开窗口
  const rt = router.resolve({ path: "/post" });
  window.open(rt.href, "_blank");
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
  const res: any = await getListByTagsApi({ tag: val, page: 1 });
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
  }
};
const sortCchange = (column: any) => {
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
  // router.push({ path: "/post", query: { id: id, ...state.params } });
  // 新开窗口
  const rt = router.resolve({
    path: "/post",
    query: { id: id, ...state.params },
  });
  window.open(rt.href, "_blank");
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
const handleSelectionChange = (val: any) => {
  state.multipleSelection = val.map((item: any) => {
    return item.uid;
  });
};
const batchdel = async (ids: any) => {
  if (!ids.length) {
    ElMessage.warning("请至少勾选一条数据")
    return false
  }
  const res = await batchDelApi({ ids: ids });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;

  .operate {
    display: flex;

    div {
      cursor: pointer;
      padding-right: 10px;
    }
  }

  .add-topic {
    text-align: center;
  }
}
</style>
