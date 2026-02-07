<template>
  <div class="chatbox">
    <div class="chat-header">
      <h1>AI 聊天助手</h1>
      <div class="header-subtitle">随时为您解答问题</div>
    </div>
    <div class="model-list">
      <span>模型选择：</span>
      <el-select v-model="type" @change="modelChange">
        <el-option v-for="(item, index) in modelList" :key="index" :label="item.modelName"
          :value="item.modelCode"></el-option>
      </el-select>
    </div>
    <el-scrollbar height="85vh">
      <div ref="messages" class="messages">
        <div v-for="(msg, index) in messages" :key="index"
          :class="{ 'user-message': msg.user === 'user', 'bot-message': msg.user === 'bot' }">
          <div class="loading-text" v-if="msg.user == 'bot' && isNotLoading">思考中...</div>
          <div v-html="md.render(msg.content)"></div>
          <!-- <v-md-preview
            :text="msg.content"></v-md-preview> -->
        </div>
      </div>
      <div class="input-box">
        <el-row>
          <el-col :span="22">
            <el-input v-model="input" type="textarea" :rows="5" @keyup.enter="sendMessage"
              placeholder="Type a message..." />
          </el-col>
          <el-col :span="2">
            <div class="send-btn" @click="sendMessage">发送</div>
          </el-col>
        </el-row>

      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { fetchEventSource } from '@microsoft/fetch-event-source'
import MarkdownIt from 'markdown-it'
import { userInfoStore } from "@/stores/userInfo";
import { getListApi,getpostListApi,updateTagsByIdApi } from "./API";
export default {
  components: {
    // MarkdownRenderer
  },
  data() {
    return {
      input: '',
      messages: [],
      content: '',
      isNotLoading: true,
      type: "ollama",
      modelList: [],
      md: null,
      curretnModel: {}
    };
  },
  created() {
    // this.getModelList()
  },
  mounted() {
    // 创建 markdown-it 实例
    this.md = new MarkdownIt()
  },
  methods: {
    modelChange(val) {
      this.curretnModel = this.modelList.find(item => item.modelCode == this.type)
      console.log(this.curretnModel);

    },
    async getModelList() {
      const res = await getListApi();
      let listString = res.data
      // this.modelList = JSON.parse(listString)
      this.modelList = [
        {
          enabled: "Y",
          modelCode: "ollama",
          modelName: "ollama",
          question: "忘记上一个回答,生成1个关于js面试的常见问题并给出回答和解析，第一行直接返回问题，请注意不要生成重复的问题",
          token: "sk-2d0c0b6ea1c646c6aab109a19d5b1974",
          url: "http://localhost:11434/api/generate"  // 本地Ollama API端点
        }
      ]
      console.log(this.modelList);
      if (this.modelList.length) {
        this.curretnModel = this.modelList[0]
        console.log(this.modelList[0]);

      }
    },
    sendMessage() {
      if (this.input.trim()) {
        this.messages.push({ user: 'user', content: this.input });
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        });
        if (this.type == 'dify') {
          this.fetchDataDify();
        } else if (this.type == 'qwen-plus') {
          this.fetchDataQwen()
        } else if (this.type == 'ollama') {
          this.getpostList()
          // this.fetchDataOllama()
        }

        this.input = '';
      }
    },
    async fetchDataQwen() {

      this.messages.push({ user: 'bot', content: '' });

      const headers = {
        'Authorization': 'Bearer ' + this.curretnModel.token, // 替换为你自己的 API Key
        'Content-Type': 'application/json'
      };
      const requestBody = JSON.stringify({
        stream: true,
        model: this.curretnModel.modelCode,
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": this.input
          }
        ],
      });


      let _this = this

      await fetchEventSource(this.curretnModel.url, {
        method: 'POST',
        headers: headers,
        body: requestBody,
        async onmessage(ev) {
          _this.isNotLoading = false;
          try {
            let jsonObj = JSON.parse(ev.data);
            let content = jsonObj.choices[0].delta.content
            console.log(jsonObj.answer); // 输出解析后的对象
            _this.messages[_this.messages.length - 1].content += content || ''
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
    },
    async fetchDataDify() {

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
          _this.isNotLoading = false;
          try {
            let jsonObj = JSON.parse(ev.data);
            console.log(jsonObj.answer); // 输出解析后的对象
            let content = jsonObj.answer || ''
            _this.messages[_this.messages.length - 1].content += content || ''
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
    },
    async fetchDataOllama(postItem) {
      // 截取数组的后5项
      this.messages =  this.messages.slice(-9);
      this.messages.push({ user: 'user', content: 'title:'+ postItem.title });
      this.messages.push({ user: 'bot', content: '' });

      const headers = {
        'Content-Type': 'application/json'
      };
      if(postItem.content.length> 2000){
        postItem.content = postItem.content.substring(0, 2000);
      }
      const requestBody = JSON.stringify({
        // "model": "llama3.2:1b",
        // "model": "qwen3:4b",
        // "model": "deepseek-r1:1.5b",
        "model": "qwen3:1.7b",
        // "model": "gemma3:1b",
        // "model": "deepseek-r1:latest",
        // "prompt": `请基于以下文章内容直接提取基于该内容3个最主要的标签，不能少于三个标签，多个标签用逗号分割，去掉重复的标签；还提取适用于网页meta标签中的description内容，标签内容与description内容用#分割直接返回，标签跟description都不要添加任何说明: ${postItem.content}`,
        "prompt": `请基于以下文章内容(忽略内容中的图片)直接提取基于该内容3个最主要的关键词，不能少于三个关键词，多个关键词用逗号分割，去掉重复的关键词,不要添加任何说明直接返回,不要返回其他内容: ${postItem.content}`,
        // "prompt": `优化内容内容排版,将繁体字转成简体字,诗词的每一行添加<br>标签,第一行也添加<br>标签,并在最后添加诗词解析内容，添加解析内容之前新增换行,并通过【诗词鉴赏】标记,通过<p>标签换行,不要添加任何说明,直接返回处理后的内容: ${postItem.content}`,
        // "prompt": `将以下翻译成英文并润色: ${postItem.content}`,
        "stream": false
      });

      let _this = this;
      
      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: headers,
          body: requestBody
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        debugger
        const data = await response.json();
        const content = data.response || '';

        _this.messages[_this.messages.length - 1].content = content;
        
        _this.isNotLoading = false;
        debugger
        
        this.updateTagsById(postItem.uid,content,'',content,content)

        console.log('Ollama response:', data);
      } catch (e) {
        console.log("Ollama error", e);
        _this.messages[_this.messages.length - 1].content = '发生错误: ' + e.message;
      }
    },
    async getpostList() {
      const res = await getpostListApi();
      let postList = res.data
      
      for (let index = 0; index < postList.length; index++) {
        const element = postList[index];
        this.fetchDataOllama(element)
      }
    },
    async updateTagsById(uid,keywords,description,content,en_content) {
      const res = await updateTagsByIdApi({
        uid: uid,
        keywords: keywords,
        description: description,
        content: content,
        en_content:en_content
      });  
      setTimeout(() => {
        this.getpostList()
      }, 1000);
    },
    
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
  overflow-y: auto;
  background-color: white;
  margin: 0 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-message {
  text-align: right;
  margin-bottom: 16px;
  border-top: 1px dashed #b1b2b5;
  border-bottom: 1px dashed #b1b2b5;
  margin-top: 20px;
  margin: 10px;
  position: relative;
}

.bot-message {
  text-align: left;
  margin-bottom: 16px;
  position: relative;
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

.loading-text {
  padding-left: 40px;
  opacity: 0.8;
}

.model-list {
  padding: 20px;
}

.send-btn {
  width: 100%;
  height: 114px;
  line-height: 114px;
  background-color: #6e8efb;
  text-align: center;
  margin-left: 10px;
  border-radius: 5px;
  vertical-align: middle;
  cursor: pointer;
  color: #f8f9fa;
}

.model-name {
  position: absolute;
  top: 33px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background-color: #ddd;
  color: #fff;
}

.user-name {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  top: 33px;
  font-size: 16px;
  border-radius: 50%;
  background-color: #ddd;
  color: #fff;
}

.user-message,
.bot-message {
  padding: 16px 20px;
  margin: 12px 20px;
  border-radius: 12px;
  max-width: 80%;
}

.user-message {
  background: #e3f2fd;
  margin-left: auto;
  border-top-right-radius: 4px;
}

.bot-message {
  background: #f1f1f1;
  margin-right: auto;
  border-top-left-radius: 4px;
}

.user-message::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 16px;
  border-width: 8px 0 8px 8px;
  border-style: solid;
  border-color: transparent #e3f2fd;
}

.bot-message::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 16px;
  border-width: 8px 8px 8px 0;
  border-style: solid;
  border-color: transparent #f1f1f1;
}

.model-name,
.user-name {
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  position: absolute;
  top: 10px;
}

.model-name {
  left: -45px;
}

.user-name {
  right: -45px;
}

.input-box {
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.send-btn {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  transition: all 0.3s;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);
}

.loading-text {
  position: relative;
  padding-left: 24px;
  color: #888;
}

.loading-text::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top-color: #6e8fb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>