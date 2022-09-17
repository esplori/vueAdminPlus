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
          router
        >
          <div v-for="(item, index) in state.menuList" :key="index">
            <el-menu-item
              v-if="
                !item.children &&
                userInfo.some((role:any) => {
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
                userInfo.some((role:any) => {
                  return item.auth.includes(role);
                })
              "
            >
              <template #title>{{ item.title }}</template>
              <el-menu-item
                :index="it.path"
                v-for="(it, idx) in item.children"
                :key="idx"
                v-show="
                  it.auth &&
                  userInfo.some((role:any) => {
                    return it.auth.includes(role);
                  })
                "
              >
                <template #title>{{ it.title }}</template>
              </el-menu-item>
            </el-sub-menu>
          </div>
        </el-menu>
      </div>
      <div class="right-content">
        <adminHeader :userInfoObj="state.userInfoObj"></adminHeader>
        <RouterView />
        <commonFooter></commonFooter>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, reactive, computed, onMounted, toRefs, watchEffect } from "vue";
import adminHeader from "./components/admin-header.vue";
import commonFooter from "./components/footer.vue";
import { getUserInfoApi } from "@/views/API/admin.js";

const state = reactive({
  menuList: [
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
        {
          title: "导航列表",
          path: "/navigationList",
          id: "",
          auth: "ROLE_admin",
        },
        {
          title: "分类管理",
          path: "/navigationCate",
          id: "",
          auth: "ROLE_admin",
        },
        {
          title: "新增导航",
          path: "/navigationEdit",
          id: "",
          auth: "ROLE_admin",
        },
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
      {
          title: "ip归属地查询",
          path: "/tools/getRegionFromIp",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          title: "json格式化",
          path: "/tools/jsonviewer",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          title: "抽奖",
          path: "/tools/choujiang",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          title: "点名",
          id: "",
          path: "/tools/dianming",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          title: "图片转成base64",
          path: "/tools/img2base64",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
        {
          title: "二维码生成",
          path: "/tools/qrcode",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
      ],
    },
    {
      title: "权限管理",
      path: "/userManage",
      id: "",
      auth: "ROLE_admin",
      icon: "el-icon-s-custom",
      children: [
        { title: "用户管理", path: "/userManage", id: "", auth: "ROLE_admin" },
        { title: "角色管理", path: "/roleManage", id: "", auth: "ROLE_admin" },
      ],
    },
    {
      title: "个人设置",
      path: "/userSetting",
      id: "",
      auth: "ROLE_admin,ROLE_author",
      icon: "el-icon-user",
      children: [
        {
          title: "个人资料",
          path: "/userSetting",
          id: "",
          auth: "ROLE_admin,ROLE_author",
        },
      ],
    },
    {
      title: "推广",
      path: "/caijiList",
      id: "",
      auth: "ROLE_admin",
      icon: "el-icon-sell",
      children: [
        { title: "采集", path: "/caiji", id: "", auth: "ROLE_admin" },
        { title: "采集列表", path: "/caijiList", id: "", auth: "ROLE_admin" },
        { title: "分类", path: "/tbkType", id: "", auth: "ROLE_admin" },
      ],
    },
    {
      title: "系统设置",
      path: "/systemSetting",
      id: "",
      auth: "ROLE_admin",
      icon: "el-icon-setting",
      children: [
        {
          title: "站点设置",
          path: "/systemSetting",
          id: "",
          auth: "ROLE_admin",
        },
        { title: "资源管理", path: "/sourceList", id: "", auth: "ROLE_admin" },
        { title: "编译部署", path: "/deploy", id: "", auth: "ROLE_admin" },
        { title: "回收站", path: "/recycle", id: "", auth: "ROLE_admin" },
        {
          title: "发送邮件",
          path: "/mail",
          id: "",
          auth: "ROLE_admin",
        },
      ],
    },
  ],
  activeName: "/home",
  userInfoObj: {},
});

const userInfo = computed(() => {
  let userIn = localStorage.getItem("userInfo") || "";
  if (userIn) {
    userIn = JSON.parse(userIn).role.split(",");
  }
  return userIn as any;
});

const getUserInfo = async () => {
  const res: any = await getUserInfoApi({});
  state.userInfoObj = res.data;
};
onMounted(() => {
  getUserInfo();
});
</script>
<style lang="scss" scoped>
.admin-home {
  height: 100%;
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
      padding: 20px 0;
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
    margin-left: 5px;
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
  .eltabs {
    width: 80%;
  }
}
</style>
