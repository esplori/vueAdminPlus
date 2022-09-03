<template>
  <div class="user-info">
    <el-form
      :model="form"
      label-width="130px"
      label-position="left"
      class="setting-form"
    >
      <el-form-item label="站点名称:">
        <el-input v-model="form.siteName"></el-input>
      </el-form-item>
      <el-form-item label="站点描述:">
        <el-input v-model="form.siteDesc" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="站点地址:">
        <el-input v-model="form.siteUrl"> </el-input>
      </el-form-item>
      <el-form-item label="文件引用路径:">
        <el-input v-model="form.sourceUrl"> </el-input>
      </el-form-item>
      <el-form-item label="文件上传实际路径:">
        <el-input v-model="form.sourceRealUrl"> </el-input>
      </el-form-item>
      <el-form-item label="文件备份实际路径:">
        <el-input v-model="form.bakRealUrl"> </el-input>
      </el-form-item>
      <el-form-item label="备案号:">
        <el-input v-model="form.beianNo" type="textarea"> </el-input>
      </el-form-item>
      <el-form-item label="站长邮箱:">
        <el-input v-model="form.siteEmail"> </el-input>
      </el-form-item>
      <el-form-item label="重新生成关键字:">
        <el-button type="primary" @click="generateKeywords">生成</el-button>
      </el-form-item>
      <el-form-item label="清空redis缓存:">
        <el-button type="primary" @click="clearCache">清空</el-button>
      </el-form-item>
      <el-form-item label="启用轮播分类推荐:" style="width: 100%">
        <el-switch
          v-model="form.carouselEnable"
          active-value="Y"
          inactive-value="N"
        >
        </el-switch>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="55px"
          ></el-table-column>
          <el-table-column label="轮播图片地址" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.imgUrl"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="轮播描述" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.desc"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="跳转链接">
            <template slot-scope="scope">
              <el-input v-model="scope.row.url"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button
                @click="add"
                v-show="scope.$index === tableData.length - 1"
                >新增</el-button
              >
              <el-button
                type="danger"
                @click="del($index)"
                v-show="scope.$index === tableData.length - 1"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  updateSiteInfoApi,
  getSiteInfoApi,
  generateKeywordsApi,
  clearCacheApi,
} from "@/views/API/admin.js";

export default {
  data() {
    return {
      form: {
        siteName: "",
        siteDesc: "",
        siteUrl: "",
        sourceUrl: "",
        sourceRealUrl: "",
        beianNo: "",
        bakRealUrl: "",
        siteEmail: "",
        carouselEnable: 'N'
      },
      tableData: [{ imgUrl: "", desc: "", url: "" }],
    };
  },
  created() {
    this.getSiteInfo();
  },
  methods: {
    async generateKeywords() {
      let res = await generateKeywordsApi({});
      if (res) {
        this.$message.success("重新生成成功");
      }
    },
    async clearCache() {
      let res = await clearCacheApi({});
      if (res) {
        this.$message.success("清空成功");
      }
    },
    async submit() {
      const res = await updateSiteInfoApi(
        Object.assign({}, this.form, {
          carouselUrl: JSON.stringify(this.tableData),
        })
      );

      if (res) {
        this.$message.success("更新成功");
      }
    },
    async getSiteInfo() {
      const res = await getSiteInfoApi({});
      if (res) {
        this.form = res.data;
        this.tableData = JSON.parse(res.data.carouselUrl);
      }
    },
    add() {
      this.tableData.push({ imgUrl: "", desc: "", url: "" });
    },
    del(index) {
      this.tableData.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="less">
.user-info {
  padding: 20px 0;
  .setting-form {
    & > div {
      width: 50%;
    }
  }
}
</style>
