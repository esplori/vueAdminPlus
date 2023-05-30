<template>
  <div class="admin-home">
    <adminHeader :userInfoObj="state.userInfoObj"></adminHeader>
    <div class="content-container">
      <div :class="['left-menu', state.hasMusicPlayer ? 'hasMusicPlayer' : '']">
        <el-scrollbar>
          <el-menu
            :unique-opened="false"
            style="height: 100%; overflow-y: auto"
            default-active="/home"
            class="el-menu-vertical"
            router
          >
            <div v-for="(item, index) in state.menuList" :key="index">
              <el-menu-item
                v-if="!(item.children && item.children.length)"
                :index="item.path"
              >
                <template #title>{{ item.name }}</template>
              </el-menu-item>
              <el-sub-menu
                :index="item.path"
                v-if="item.children && item.children.length"
              >
                <template #title>{{ item.name }}</template>
                <el-menu-item
                  :index="it.path"
                  v-for="(it, idx) in item.children"
                  :key="idx"
                >
                  <template #title>{{ it.name }}</template>
                </el-menu-item>
              </el-sub-menu>
            </div>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="right-content">
        <RouterView />
        <commonFooter></commonFooter>
      </div>
    </div>
    <musicPlayer
      v-if="state.userInfoObj.musicPlayerSwitch === '1'"
    ></musicPlayer>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { reactive, computed, onMounted } from "vue";
import adminHeader from "./components/admin-header.vue";
import commonFooter from "./components/footer.vue";
import musicPlayer from "./components/musicPlayer.vue";
import { getUserInfoApi, getMenusApi } from "@/views/API/admin.js";
import { userInfoStore } from "@/stores/userInfo";

const state = reactive({
  menuList: [
    {
      name: "首页",
      path: "/home",
      id: "",
      icon: "el-icon-s-home",
      auth: "ROLE_admin,ROLE_author",
    },
    {
      name: "导航管理",
      path: "/navigationList",
      id: "",
      auth: "ROLE_admin",
      icon: "el-icon-s-promotion",
      children: [
        {
          name: "导航列表",
          path: "/navigationList",
          id: "",
          auth: "ROLE_admin",
        },
        {
          name: "分类管理",
          path: "/navigationCate",
          id: "",
          auth: "ROLE_admin",
        },
        {
          name: "新增导航",
          path: "/navigationEdit",
          id: "",
          auth: "ROLE_admin",
        },
      ],
    },
    {
      name: "内容管理",
      path: "/pageList",
      id: "",
      icon: "el-icon-s-order",
      auth: "ROLE_admin,ROLE_author",
      children: [
        {
          name: "文章列表",
          path: "/pageList",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          name: "新增文章",
          path: "/post",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          name: "评论管理",
          path: "/commentList",
          id: "",
          auth: "ROLE_admin",
        },
        {
          name: "分类管理",
          path: "/cateList",
          id: "",
          auth: "ROLE_author",
        },
        {
          name: "专题管理",
          path: "/topic",
          id: "",
          auth: "ROLE_admin",
        },
      ],
    },
    {
      name: "小工具",
      path: "/tools/jsonviewer",
      id: "",
      auth: "ROLE_admin,ROLE_author",
      icon: "el-icon-crop",
      children: [
        {
          name: "电子书",
          path: "/tools/ebook",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          name: "ip归属地查询",
          path: "/tools/getRegionFromIp",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          name: "抽奖",
          path: "/tools/choujiang",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          name: "点名",
          id: "",
          path: "/tools/dianming",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          name: "图片转成base64",
          path: "/tools/img2base64",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          name: "二维码生成",
          path: "/tools/qrcode",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
      ],
    },
    {
      name: "权限管理",
      path: "/userManage",
      id: "",
      auth: "ROLE_admin",
      icon: "el-icon-s-custom",
      children: [
        { name: "用户管理", path: "/userManage", id: "", auth: "ROLE_admin" },
        { name: "角色管理", path: "/roleManage", id: "", auth: "ROLE_admin" },
        { name: "菜单管理", path: "/menuManage", id: "", auth: "ROLE_admin" },
      ],
    },
    {
      name: "个人设置",
      path: "/userSetting",
      id: "",
      auth: "ROLE_admin,ROLE_author",
      icon: "el-icon-user",
      children: [
        {
          name: "个人资料",
          path: "/userSetting",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
      ],
    },
    {
      name: "系统设置",
      path: "/systemSetting",
      id: "",
      auth: "ROLE_admin",
      icon: "el-icon-setting",
      children: [
        {
          name: "站点设置",
          path: "/systemSetting",
          id: "",
          auth: "ROLE_admin",
        },
        { name: "资源管理", path: "/sourceList", id: "", auth: "ROLE_admin" },
        { name: "回收站", path: "/recycle", id: "", auth: "ROLE_admin" },
        {
          name: "发送邮件",
          path: "/mail",
          id: "",
          auth: "ROLE_admin",
        },
      ],
    },
  ],
  activeName: "/home",
  userInfoObj: {
    musicPlayerSwitch: "0",
  },
  hasMusicPlayer: false,
});

const us = userInfoStore();

const getUserInfo = async () => {
  const res: any = await getUserInfoApi({});
  state.userInfoObj = res.data;
  // 开启播放器后调整左侧菜单高度，避免被播放器盖住
  if (res.data.musicPlayerSwitch === "1") {
    const leftMenu = document.querySelector(".left-menu");
    if (leftMenu) {
      state.hasMusicPlayer = true;
    }
  }
  // 保存每日一句
  if (res.data.dailySentence) {
    us.userInfo.dailySentence = res.data.dailySentence;
  }
};
const getMenus = async () => {
  getMenusApi({}).then((res: any) => {
    state.menuList = res.data.result;
  });
};
onMounted(() => {
  getUserInfo();
  getMenus();
});
</script>
<style lang="scss" scoped>
.admin-home {
  height: 100%;

  .content-container {
    position: relative;
    width: 1200px;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    overflow-x: hidden;
  }

  .left-menu {
    border-radius: 8px;
    background: #fff;
    padding: 10px;
    position: fixed;
    width: 210px;
    top: 70px;
    height: calc(100% - 80px);
    bottom: 120px;
    overflow-y: auto;
    border-right: 1px solid #f5f5f5;

    &.hasMusicPlayer {
      height: calc(100% - 140px);
    }
  }

  .right-content {
    margin-left: 220px;
    width: 100%;
    padding: 20px;
    padding-bottom: 60px;
    background: #fff;
    border-radius: 8px;
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 180px;
    min-height: 400px;
    overflow-x: hidden;
  }

  .el-menu {
    border-right: none;
  }

  .global-music {
    width: 100%;
    position: absolute;
    bottom: 0;
    color: #fff;
  }

  .eltabs {
    width: 80%;
  }
}
</style>
