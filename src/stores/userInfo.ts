import { defineStore } from "pinia";

export const userInfoStore = defineStore({
  id: "userInfo",
  state: () => ({
    userInfo: {
      dailySentence: "",
      username: "",
      token:""
    },
    music_list: [],
  }),
  getters: {
    // doubleCount: (state) => state.userInfo,
  },
  actions: {},
});
