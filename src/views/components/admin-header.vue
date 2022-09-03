<template>
  <div class="admin-header">
    <div class="header-container">
      <div class="left-header">
        <div class="tips">
          <span class="welcomeMsg">每日一句：{{ dailySentence }}</span>
        </div>
      </div>
      <div class="user-info">
        <div class="userInfo">
          <div v-if="userInfo" class="info-flex">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ userInfo.username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item  command="logout"
                    >退出</el-dropdown-item
                  >
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

<script>
import { delHtmlTag } from "@/utils/common.js";
import { logoutApi } from "../API/common.js";
export default {
  name: "admin-header",
  data() {
    return {};
  },
  computed: {
    dailySentence() {
      return (
        this.userInfoObj.dailySentence &&
        delHtmlTag(this.userInfoObj.dailySentence)
      );
    },
    userInfo() {
      const userinfo = localStorage.getItem("userInfo");
      if (userinfo) {
        return JSON.parse(userinfo);
      } else {
        return false;
      }
    },
  },
  props: {
    userInfoObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    userInfo: () => import("@/views/components/userInfo.vue"),
  },
  methods: {
    handleCommand(command) {
      debugger
      switch (command) {
        case "logout":
          this.logout();
          break;
      }
    },
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    async logout() {
      const res = await logoutApi({});
      if (res) {
        this.$router.push({ path: "/login" });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.admin-header {
  width: 100%;
  padding: 20px 0;
  margin: 0 auto 10px;
  background: #fff;
  color: #71777c;
  border-bottom: 1px solid #ddd;
  .header-container {
    // max-width: 1280px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin: 0 20px;
    .user-info {
      display: flex;
      justify-content: flex-end;
    }
    .left-header {
      display: flex;
      align-items: center;
      width: 100%;
    }
    .tips {
      width: 100%;
      .welcomeMsg {
        // margin-left: 10px;
        font-size: 12px;
      }
    }
  }
}
</style>
