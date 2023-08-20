<template>
  <div class="admin-header">
    <div class="header-container">
      <div class="logo">
        <a href="https://www.dsiab.com" target="_blank"
          ><span class="logo_pic"></span> 管理中心</a
        >
      </div>
      <div class="user-info">
        <!-- <div class="userInfo"> -->
        <div v-if="state.userInfo" class="info-flex">
          <el-dropdown @command="handleCommand">
            <div class="el-dropdown-link">
              {{ state.userInfo.username
              }}<el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <span v-else @click="toLogin" class="login-in">登录</span>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logoutApi } from "@/views/account/api";
import { ArrowDown } from "@element-plus/icons-vue";
import { watchEffect, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  userInfo: {
    username: "",
  },
});

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
    localStorage.removeItem("userInfo");
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
  padding: 5px 0 5px 0;
  border-bottom: 1px solid #f5f5f5;
  color: #71777c;
  position: sticky;
  top: 0;
  left: 0;
  background: #fff;
  // background-image: radial-gradient(transparent 1px, #fff 1px);
  // backdrop-filter: saturate(50%) blur(2px);
  z-index: 105;
  background-size: 4px 4px;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    padding: 5px 0;

    .logo {
      font-size: 14px;
      text-align: left;
      width: 220px;
      display: flex;
      align-items: center;

      .logo_pic {
        display: inline-block;
        background: url("@/assets/images/logo_black.png") no-repeat;
        width: 80px;
        height: 40px;
        background-size: cover;
      }

      a {
        color: #333;
        text-decoration: none;
        display: flex;
        align-items: center;
        font-size: 1rem;
      }
    }

    .user-info {
      .info-flex {
        display: flex;
      }
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
}
</style>
