<template>
  <div class="admin-home">
    <div class="content-container">
      <div class="left-menu">
        <div class="logo">
          <a href="https://www.dsiab.com" target="_blank">javascript技术分享</a>
        </div>
        <el-menu
          style="height: 100%; overflow-y: auto"
          default-active="/home"
          class="el-menu-vertical"
          @open="handleOpen"
          @close="handleClose"
          router
        >
          <div v-for="(item, index) in menuList" :key="index">
            <el-menu-item
              v-if="
                !item.children &&
                userInfo.some((role) => {
                  return item.auth.includes(role);
                })
              "
              :index="item.path"
            >
              <template #title>{{ item.title }}</template>
            </el-menu-item>
            <el-sub-menu
              :index="item.path"
              v-if="
                item.children &&
                userInfo.some((role) => {
                  return item.auth.includes(role);
                })
              "
            >
              <template #title>{{ item.title }}</template>
              <el-menu-item
                :index="it.path"
                v-for="(it, idx) in item.children"
                :key="idx"
                
              >
                <template #title>{{ it.title }}</template>
              </el-menu-item>
            </el-sub-menu>
          </div>
        </el-menu>
      </div>
      <div class="right-content">
        <adminHeader :userInfoObj="userInfoObj"></adminHeader>
        <RouterView />
        <commonFooter></commonFooter>
      </div>
    </div>
    <music class="global-music" v-if="false"></music>
  </div>
  
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, reactive, computed } from "vue";
import adminHeader from "./components/admin-header.vue"
import commonFooter from "./components/footer.vue"
const menuList = reactive([
  {
    title: "首页",
    path: "/home",
    id: "",
    icon: "el-icon-s-home",
    auth: "ROLE_admin,ROLE_author",
  },
  {
    title: "导航管理",
    path: "/navigationList",
    id: "",
    auth: "ROLE_admin",
    icon: "el-icon-s-promotion",
    children: [
      { title: "导航列表", path: "/navigationList", id: "" },
      { title: "分类管理", path: "/navigationCate", id: "" },
      { title: "新增导航", path: "/navigationEdit", id: "" },
    ],
  },
  {
    title: "文章管理",
    path: "/pageList",
    id: "",
    icon: "el-icon-s-order",
    auth: "ROLE_admin,ROLE_author",
    children: [
      {
        title: "文章列表",
        path: "/pageList",
        id: "",
        auth: "ROLE_admin,ROLE_author",
      },
      {
        title: "新增文章",
        path: "/post",
        id: "",
        auth: "ROLE_admin,ROLE_author",
      },
      {
        title: "评论管理",
        path: "/commentList",
        id: "",
        auth: "ROLE_admin",
      },
      {
        title: "分类管理",
        path: "/cateList",
        id: "",
        auth: "ROLE_author",
      },
      {
        title: "专题管理",
        path: "/topic",
        id: "",
        auth: "ROLE_admin",
      },
    ],
  },
  {
    title: "小工具",
    path: "/tools/jsonviewer",
    id: "",
    auth: "ROLE_admin,ROLE_author",
    icon: "el-icon-crop",
    children: [
      { title: "json格式化", path: "/tools/jsonviewer", id: "" },
      { title: "抽奖", path: "/tools/choujiang", id: "" },
      { title: "点名", id: "", path: "/tools/dianming" },
      {
        title: "图片转成base64",
        path: "/tools/img2base64",
        id: "",
      },
      { title: "二维码生成", path: "/tools/qrcode", id: "" },
    ],
  },
  {
    title: "权限管理",
    path: "/userManage",
    id: "",
    auth: "ROLE_admin",
    icon: "el-icon-s-custom",
    children: [
      { title: "用户管理", path: "/userManage", id: "" },
      { title: "角色管理", path: "/roleManage", id: "" },
      // { title: "菜单管理", path: "/admin/menuManage", id: "" },
    ],
  },
  {
    title: "个人设置",
    path: "/userSetting",
    id: "",
    auth: "ROLE_admin,ROLE_author",
    icon: "el-icon-user",
    children: [{ title: "个人资料", path: "/userSetting", id: "" }],
  },
  {
    title: "推广",
    path: "/caijiList",
    id: "",
    auth: "ROLE_admin",
    icon: "el-icon-sell",
    children: [
      { title: "采集", path: "/caiji", id: "" },
      { title: "采集列表", path: "/caijiList", id: "" },
      { title: "分类", path: "/tbkType", id: "" },
    ],
  },
  {
    title: "系统设置",
    path: "/systemSetting",
    id: "",
    auth: "ROLE_admin",
    icon: "el-icon-setting",
    children: [
      { title: "站点设置", path: "/systemSetting", id: "" },
      { title: "资源管理", path: "/sourceList", id: "" },
      { title: "编译部署", path: "/deploy", id: "" },
      { title: "回收站", path: "/recycle", id: "" },
      {
        title: "发送邮件",
        path: "/mail",
        id: "",
      },
    ],
  },
]);
const activeName = ref("/home");
const userInfo = computed(() => {
  let userInfoObj = localStorage.getItem("userInfo");
  if (userInfoObj) {
    userInfoObj = JSON.parse(userInfoObj).role.split(",");
  } else {
    userInfoObj = [];
  }
  return userInfoObj;
});
</script>
<style lang="scss" scoped>
.admin-home {
  height: 100%;
  .logo {
    font-size: 14px;
  }
  .content-container {
    height: 100%;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .left-menu {
    border-radius: 3px;
    background: #fff;
    .logo {
      font-size: 14px;
      text-align: center;
      padding: 15px 0;
      color: #fff;
      border-bottom: 1px solid #ddd;
    }
    .switch-icon {
      text-align: center;
      padding-top: 40px;
      padding-bottom: 20px;
    }
  }
  .right-content {
    width: 100%;
    padding: 0 20px 20px 20px;
    padding-bottom: 20px;
    background: #fff;
    margin-left: 10px;
    border-radius: 3px;
    height: fit-content;
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
    // background:rgba(#000,0.8);
    // height: 80px;
    color: #fff;
  }
  .eltabs{
    width: 80%;
  }
}
</style>
