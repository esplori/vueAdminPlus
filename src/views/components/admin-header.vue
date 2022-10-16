<template>
  <div class="admin-header">
    <div class="header-container">
      <div class="logo">
          <a href="https://www.dsiab.com" target="_blank">javascript技术分享</a>
        </div> 
      <div class="left-header">
        <div class="tips">
          <span class="welcomeMsg">每日一句：{{ dailySentence }}</span>
        </div>
      </div>
      <div class="user-info">
        <div class="userInfo">
          <div v-if="state.userInfo" class="info-flex">
            <el-dropdown @command="handleCommand">
              <div class="el-dropdown-link">
                {{ state.userInfo.username
                }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <span v-else @click="toLogin" class="login-in">登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { delHtmlTag } from "@/utils/common.js";
import { logoutApi } from "@/views/account/api";
import { ArrowDown } from "@element-plus/icons-vue";
import { computed, watchEffect, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const dailySentence = computed(() => {
  return (
    state.userInfo.dailySentence && delHtmlTag(state.userInfo.dailySentence)
  );
});

const state = reactive({
  userInfo:{
    dailySentence: "",
    username: ""
  }
})

const handleCommand = (command: string) => {
  switch (command) {
    case "logout":
      logout();
      break;
  }
};

const toLogin = () => {
  router.push("/login");
};

const logout = async () => {
  const res = await logoutApi({});
  if (res) {
    toLogin();
  }
};

const propsState = defineProps(["userInfoObj"]);

watchEffect(() => {
  state.userInfo = propsState.userInfoObj;
});
</script>

<style scoped lang="scss">
.admin-header {
  width: 100%;
  padding: 20px 0;
  margin: 0 auto 5px;
  background: #fff;
  color: #71777c;
  // border-bottom: 1px solid #ddd;
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px;
    .logo {
      font-size: 16px;
      text-align: left;
      width: 220px;
      a{
        color: #333;
      }
    }
    .user-info {
      width: 100px;
      display: flex;
      justify-content: flex-end;
    }
    .left-header {
      display: flex;
      align-items: center;
      width: 100%;
      height:45px
    }
    .tips {
      width: 100%;
      .welcomeMsg {
        // margin-left: 10px;
        font-size: 12px;
      }
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
}
</style>
