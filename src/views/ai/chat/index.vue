<template>
  <div class="chatbox">
    <div class="chat-header">
      <h1>AI 聊天助手</h1>
      <div class="header-subtitle">随时为您解答问题</div>
    </div>
    <el-scrollbar height="85vh">
      <div ref="messages" class="messages">
        <div v-for="(msg, index) in messages" :key="index"
          :class="{ 'user-message': msg.user === 'user', 'bot-message': msg.user === 'bot' }">
          <div class="loading-text" v-if="msg.user == 'bot' && isNotLoading">思考中...</div>
          <v-md-preview :text="msg.content"></v-md-preview>
        </div>
      </div>
      <div class="input-box">
        <el-input v-model="input" type="textarea" :rows="5" @keyup.enter="sendMessage"
          placeholder="Type a message..." />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { fetchEventSource } from '@microsoft/fetch-event-source'
export default {
  components: {
    // MarkdownRenderer
  },
  data() {
    return {
      input: '',
      messages: [],
      content: '',
      isNotLoading: true
    };
  },
  created() {
  },
  methods: {
    sendMessage() {
      if (this.input.trim()) {
        this.messages.push({ user: 'user', content: this.input });
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        });
        this.fetchData();
        this.input = '';
      }
    },
    async fetchData() {

      this.messages.push({ user: 'bot', content: '' });
      const url = 'http://localhost/v1/chat-messages'; // 替换为你的 API 地址
      const headers = {
        'Authorization': 'Bearer app-tEZfc1byRys1dMjUhshnWfSl', // 替换为你自己的 API Key
        'Content-Type': 'application/json'
      };
      const requestBody = JSON.stringify({
        inputs: {},
        query: this.input,
        response_mode: "streaming",
        conversation_id: "", // 可选，根据需要填写
        user: "abc-123"     // 根据 API 文档填写
      });


      let _this = this
      
      await fetchEventSource(url, {
        method: 'POST',
        headers: headers,
        body: requestBody,
        async onmessage(ev) {
          // const chunk = decoder.decode(ev.data, { stream: false });
          _this.isNotLoading = false;
          try {
            let jsonObj = JSON.parse(ev.data);
            console.log(jsonObj.answer); // 输出解析后的对象
            _this.messages[_this.messages.length - 1].content += jsonObj.answer || ''
          } catch (e) {
            console.log("err", e);
          }

        },
        onclose(params) {
          console.log("close", params);
        },
        onerror(err) {
          console.log("err", err);
        }
      })
    }
  }
};
</script>

<style scoped>
/* 新增的头部样式 */
.chat-header {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.chat-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.header-subtitle {
  font-size: 14px;
  opacity: 0.8;
}

/* 优化现有样式 */
.chatbox {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.messages {
  flex: 1;
  /* padding: 20px; */
  overflow-y: auto;
  background-color: white;
  margin: 0 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-message {
  text-align: right;
  /* color: #3a86ff; */
  margin-bottom: 16px;
  border-bottom: 1px dashed #e9ecef;
  margin-top: 20px;
}

.bot-message {
  text-align: left;
  /* color: #4cc9f0; */
  margin-bottom: 16px;
}

.input-box {
  position: sticky;
  bottom: 0;
  width: calc(100% - 40px);
  margin: 0 20px 20px;
  box-sizing: border-box;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  margin-top: 20px;
}
.loading-text{
  padding-left: 40px;
  opacity: 0.8;
}
</style>