<template>
  <div class="post">
    <el-form label-width="80px" :model="form">
      <el-form-item label="名称：">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="form.url" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea" v-model="form.content" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="分类：">
        <el-select v-model="form.cate">
          <el-option
            v-for="(item, index) in cateList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit" type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import {
  postPageApi,
  editPageApi,
  getDetailApi,
} from "@/views/API/navigation.js";
import { getNavCateApi } from "@/views/API/admin.js";
export default {
  data() {
    return {
      form: {
        id: "",
        title: "",
        content: "",
        cate: "",
        url: "",
      },
      cateList: [
        { name: "开发工具", id: "1" },
        { name: "网络资讯", id: "2" },
        { name: "资源分享", id: "3" },
        { name: "友情链接", id: "4" },
      ],
    };
  },
  components: {},
  mounted() {},
  computed: {},
  created() {
    const id = this.$route.query.id;
    if (id) {
      this.getDetail(id);
    }
    this.getNavCateList();
  },
  methods: {
    async getNavCateList() {
      const res = await getNavCateApi(this.params);
      if (res) {
        this.cateList = res.data.map((item) => {
          item.id = String(item.id);
          return item;
        });
      }
    },
    submit() {
      if (this.form.id) {
        this.editPage();
      } else {
        this.postPage();
      }
    },
    async editPage() {
      const res = await editPageApi({ ...this.form });
      if (res) {
        this.$message.success("修改成功");
        this.$router.push({ path: "/navigationList" });
      }
    },
    async postPage() {
      const res = await postPageApi({ ...this.form });
      if (res) {
        this.$message.success("添加成功");
        this.$router.push({ path: "/navigationList" });
      }
    },
    async getDetail(id) {
      const res = await getDetailApi({ id: id });
      if (res) {
        this.form = res.data.result;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.post {
  width: 100%;
}
</style>
