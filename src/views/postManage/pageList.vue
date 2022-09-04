<template>
  <div class="page-list">
    <div class="select-by-cate">
      <div>
        <span>按分类筛选：</span>
        <el-select v-model="params.cate" @change="typeChange">
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="(item, index) in cateList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-input
          v-model="params.tag"
          placeholder="输入关键字搜索"
          @change="tagChange"
        ></el-input>
      </div>
    </div>
    <el-table :data="list" @sort-change="sortCchange">
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column label="标题" width="200px">
        <template #default="scope">
          <a
            style="color: #333; text-decoration: underline"
            :href="
              'https://www.dsiab.com/post/' + (scope.row.uid || scope.row.id)
            "
            target="_blank"
            >{{ scope.row.title }}</a
          >
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
      <el-table-column fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            >删除</el-button
          >
          <el-button
            v-if="userInfo.includes('ROLE_admin')"
            @click="addToTopic(scope.row)"
            type="text"
            >添加到专题</el-button
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

    <el-dialog title="添加到专题" v-model="dialogVisible" width="30%">
      <div>
        <el-select v-model="form.topicId">
          <el-option
            v-for="(item, index) in topicList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTopic()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  delApi,
  getListByCateApi,
  getAdminCateValidApi,
  getTopicListApi,
  addPostToTopicApi,
  getListByTagsApi,
} from "@/views/API/admin.js";

export default {
  data() {
    return {
      list: [],
      params: {
        page: 1,
        cate: "",
        pageSize: 10,
        order: "desc",
        orderBy: "createDate",
      },
      form: {
        postId: "",
        name: "",
        topicId: "",
      },
      total: 0,
      cateList: [],
      dialogVisible: false,
      topicList: [],
    };
  },
  created() {
    this.getCate();
    // 恢复之前查询的参数
    const { page, cate, pageSize } = this.$route.query;
    this.params.page = parseInt(page) || 1;
    this.params.pageSize = parseInt(pageSize) || 10;
    this.params.cate = parseInt(cate) || "";
    this.getList();
  },
  computed: {
    userInfo() {
      let userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        userInfo = JSON.parse(userInfo).role.split(",");
      } else {
        userInfo = [];
      }
      return userInfo;
    },
  },
  methods: {
    /**
     *  tab切换后查询文章
     */
    tagChange(val) {
      this.getListByTags(val);
    },
    /**
     * 通过关键字查询文章
     */
    async getListByTags(val) {
      const res = await getListByTagsApi({ tag: val });
      if (res) {
        this.list = res.data.result;
        this.total = res.data.total;
      }
    },
    sortCchange({ column, prop, order }) {
      this.params.page = 1;
      // 需要转换成sql对应的排序字段
      this.params.order = order === "ascending" ? "asc" : "desc";
      this.params.orderBy = prop;
      this.getList();
    },
    async getTopicList() {
      const res = await getTopicListApi({});
      if (res) {
        this.topicList = res.data.result;
      }
    },
    typeChange() {
      this.params.page = 1;
      this.getList();
    },
    getList() {
      this.getListByCate();
    },
    async getCate() {
      const res = await getAdminCateValidApi({});
      if (res) {
        this.cateList = res.data.result;
      }
    },
    async getListByCate() {
      const res = await getListByCateApi(this.params);
      if (res) {
        this.list = res.data.result;
        this.total = res.data.total;
      }
    },
    delConfirm(id) {
      this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.del(id);
      });
    },
    async del(id) {
      const res = await delApi({ id: id });
      if (res) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
    /**
     * 编辑
     */
    edit(id) {
      this.$router.push({ path: "post", query: { id: id, ...this.params } });
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    // 添加到专题
    addToTopic(row) {
      this.getTopicList();
      this.dialogVisible = true;
      this.form.postId = row.uid || row.id;
      this.form.name = row.title;
    },
    async submitTopic() {
      const res = await addPostToTopicApi(this.form);
      if (res) {
        this.$message.success("添加成功");
        this.dialogVisible = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  .select-by-cate {
    margin: 20px;
    display: flex;
    justify-content: space-between;
  }
  .content-item {
    font-size: 18px;
    text-align: left;
    padding: 5px;
  }
}
</style>
