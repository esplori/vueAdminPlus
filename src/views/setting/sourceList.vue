<template>
  <div class="sourceList">
    <searchHeader :title="'资源管理'">
      <el-button type="primary" @click="addFile">新增文件</el-button>
    </searchHeader>
    <el-tabs v-model="state.activeName" @tab-click="handleClick">
      <el-tab-pane label="所有" name="all"></el-tab-pane>
      <el-tab-pane label="图片" name="image"></el-tab-pane>
      <el-tab-pane label="视频" name="media"></el-tab-pane>
      <el-tab-pane label="音乐" name="music"></el-tab-pane>
      <el-tab-pane label="文档" name="file"></el-tab-pane>
    </el-tabs>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="55px"></el-table-column> -->
      <el-table-column prop="" label="名称">
        <template #default="scope">
          <div class="filename">
            <div
              v-if="
                state.typeConfig.music.includes(
                  scope.row.filename.split('.')[1]
                )
              "
            >
              <span>{{ scope.row.filename }}</span>
              <audio
                :src="state.sourceUrl + scope.row.filename"
                controls
              ></audio>
            </div>
            <div
              v-else-if="
                state.typeConfig.image.includes(
                  scope.row.filename.split('.')[1]
                )
              "
            >
              <span style="margin-right: 40px">{{ scope.row.filename }}</span>
              <img
                loading="lazy"
                :src="state.sourceUrl + scope.row.filename"
                alt=""
                height="40px"
              />
            </div>
            <div v-else>
              <span>{{ scope.row.filename }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="名称">
        <template #default="scope">
          <a target="_blank" :href="state.sourceUrl + scope.row.filename">{{
            state.sourceUrl + scope.row.filename
          }}</a>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="120" label="操作">
        <template #default="scope">
          <el-button link @click="del(scope.row.filename)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" v-model="state.dialogVisible" width="30%">
      <el-upload
        class="upload-demo"
        drag
        :action="fileUploadApi()"
        multiple
        :headers="headers"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="state.dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { delFileApi, getSourceListApi } from "@/views/API/admin.js";
import { fileUploadApi } from "@/views/API/auth.js";
import { reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  list: [],
  dialogVisible: false,
  activeName: "",
  sourceUrl: "",
  typeConfig: {
    image: ["jpg", "png", "gif", "jpeg"],
    media: ["mp4"],
    music: ["mp3"],
    file: ["docx", "doc", "xslx", "txt", "zip"],
  },
});

onMounted(() => {
  getList(state.activeName);
});
const headers = computed(() => {
  let userinfo = localStorage.getItem("userInfo") as any;
  if (userinfo) {
    userinfo = JSON.parse(userinfo);
    return { Authorization: userinfo.token };
  }
  return { Authorization: "" };
});

const handleClick = (val: any) => {
  getList(val);
};
const addFile = () => {
  state.dialogVisible = true;
};

const getList = async (type: any) => {
  const res: any = await getSourceListApi({});
  if (res) {
    state.sourceUrl = res.data.sourceUrl;
    state.list = res.data.result.filter((item: any) => {
      const fig = state.typeConfig[type];
      if (type && fig) {
        const fn = item.filename.split(".")[1];
        return fig.includes(fn);
      }
      return item;
    });
  }
};

const del = async (filename: any) => {
  const res = await delFileApi({ filename: filename });
  if (res) {
    ElMessage.success("删除成功");
    getList(state.activeName);
  }
};
</script>

<style scoped lang="scss">
.sourceList {
  width: 100%;

  .filename {
    display: flex;
    align-items: center;

    audio {
      margin-left: 10px;
      width: 300px;
      height: 20px;
    }
  }
}
</style>
