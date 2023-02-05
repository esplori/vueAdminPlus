import { defineStore } from "pinia";

export const userInfoStore = defineStore({
  id: "userInfo",
  state: () => ({
    userInfo: {
      dailySentence: ''
    },
  }),
  getters: {
    // doubleCount: (state) => state.userInfo,
  },
  actions: {},
});
