<template>
  <div class="app-container">
    <header class="header">
      <div class="header-title">
        Chat Application
      </div>
      <div class="header-user">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{username}}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item><router-link to="/personal-center" class="dropdown-item" exact>个人主页</router-link></el-dropdown-item>
             
              <el-dropdown-item><a href="#" class="dropdown-item" @click.prevent="logout">退出登录</a></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <nav class="sidebar">
      <ul>
        <li v-for="(session, index) in sessions" :key="index" @click="selectSession(index)">
          {{ session.title }}
        </li>
        <li class="add-session" @click="addNewSession">+ New Session</li>
      </ul>
    </nav>
    <main class="main-container">
      <div class="chat-history" ref="chatHistory">
        
        <div v-for="(message, index) in currentSession.messages" :key="index" :class="['message', message.isUser ? 'user-message' : 'bot-message']">
          <div class="vfor" ref="achatHistory"></div>
            <img v-if="message.imageUrl" :src="message.imageUrl" alt="Uploaded Image" />
            <p v-if="message.score">{{ message.score }}</p>
            <span v-else>{{ message.text }}</span>
          </div>
        </div>
      <div class="input-section">
        <textarea v-model="newMessage" placeholder="Type your message here..." @keyup.enter="sendMessage"></textarea>
        <button @click="sendMessage">Send</button>
        <label for="file-input" class="upload-button">Upload Image</label>
        <input type="file" id="file-input" accept="image/*" @change="uploadImage" style="display: none;" />
      </div>
    </main>

  </div>

</template>

<script lang="ts">
import router from '@/router';
import { defineComponent, ref, onMounted, nextTick, watchEffect } from 'vue';

export default defineComponent({
  setup() {
    const userInfo = ref<any>(null);
    const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo);
      }
    const username = userInfo.value.data.user_name; // Replace with actual username logic
    const newMessage = ref('');
    const sessions = ref([
      {
        title: 'Welcome Session',
        messages: [
          { text: 'Hello! How can I assist you today?', isUser: false }
        ]
      }
    ]);
    const currentSessionIndex = ref(0);
    const currentSession = ref(sessions.value[currentSessionIndex.value]);
    const chatHistory = ref(null);

    const selectSession = (index: number) => {
      currentSessionIndex.value = index;
      currentSession.value = sessions.value[index];
      scrollToBottom();
    };

    const addNewSession = () => {
      const newSessionTitle = `Session ${sessions.value.length + 1}`;
      sessions.value.push({
        title: newSessionTitle,
        messages: []
      });
      selectSession(sessions.value.length - 1);
    };


  const sendMessage = async () => {
  if (newMessage.value.trim()) {
    currentSession.value.messages.push({ text: newMessage.value, isUser: true });

    // 构造请求体
    const body = new URLSearchParams({
      'text': newMessage.value
    }).toString();

    try {
      // 发送 POST 请求
      const response = await fetch('http://192.168.188.92:5000/user/texttoimage', {
        method: 'POST', // 指定请求方法
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
        },
        body: body // 将表单数据作为请求体
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // 解析返回的JSON数据
      console.log('Message sent successfully:', data);

      // 如果需要根据后端响应做进一步处理
      if (data.code === 0) {
        // 确保 data.data 是一个数组
        if (Array.isArray(data.data)) {
          data.data.forEach((item: any[]) => {
            const  imageUrl = item[0].toString();
            const score = item[1];
            const messageItem = {
              imageUrl: imageUrl,
              text: `相关度分数: ${score.toFixed(4)}`, // 显示相关度分数
              isUser: false
            };
            currentSession.value.messages.push(messageItem);
          });
        }

        // 模拟机器人响应
        setTimeout(() => {
          currentSession.value.messages.push({ text: 'I am here to help. What do you need?', isUser: false });
        }, 1000);
      } else {
        console.log('Response error:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('发送消息失败，请稍后重试');
    }

    newMessage.value = ''; // 清空输入字段
  }
};

const uploadImage = async (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          currentSession.value.messages.push({ text: imageUrl, isImage: true, isUser: true });
            currentSession.value.messages.push({ text: 'Thanks for the image. Let me take a look...', isUser: false });
          scrollToBottom();
        };
        const formData = new FormData();
      formData.append('image', file); // 将文件添加到 FormData 对象中
      try {
    const response = await fetch('http://192.168.188.92:5000/user/imagetotext', {
      method: 'POST',
      body: formData // 直接使用 FormData 对象作为请求体
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // 解析返回的JSON数据
      console.log('Image upload successfully:', data);
      // 如果需要根据后端响应做进一步处理
      if (data.code === 0) {
        // 确保 data.data 是一个数组
        if (Array.isArray(data.data)) {
          data.data.forEach((item: any[]) => {
            const textinfo = item[0].toString();
            const score = item[1];
            const messageItem = {
            text: `${textinfo} 相关度分数:${score.toFixed(4)}`,
            isUser: false
            };
            currentSession.value.messages.push(messageItem);
          });
        }
    }}catch(error){}
        reader.readAsDataURL(file);
      }
    };

    const scrollToBottom = () => {
      if (chatHistory.value) {
        chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
      }
    };
    const logout = () => {
      // 清除用户的认证状态或其他相关数据
      localStorage.removeItem('token'); // 示例：删除本地存储的 token
      localStorage.removeItem('user');  // 示例：删除本地存储的用户信息
      
      // 跳转到登录页面
      router.push('/');
    };
    
    onMounted(() => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo);
      }
      console.log(userInfo.value.data.user_name);
      scrollToBottom();
    });

    watchEffect(() => {
      scrollToBottom();
    });

    return {
      username,
      newMessage,
      sessions,
      currentSession,
      sendMessage,
      selectSession,
      addNewSession,
      chatHistory,
      uploadImage,
      logout
    };
  }
});
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #1f1e33;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}
.vfor{
  flex-direction: column;
}
.header-title {
  padding-left: 20px;
  
}

.header-user {
  padding-right: 20px;
  
}

.user-link {
  color: rgb(255, 255, 255);
  text-decoration: none;
  cursor: pointer;
}

.sidebar {
  position: fixed;
  top: 60px; /* Below the header */
  left: 0;
  bottom: 0;
  width: 200px;
  background-color: hsla(194, 100%, 93%, 0.765);
  overflow-y: auto;
  z-index: 999;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.sidebar li:hover {
  background-color: #ddd;
}

.add-session {
  background-color: #0084ff;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.main-container {
  margin-left: 200px; /* To match the sidebar width */
  padding-top: 60px; /* To match the header height */
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* Adjust for header height */
}

.chat-history {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.message {
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 5px;
}

.user-message {
  align-self: flex-end;
  background-color: #0084ff;
  color: white;
}

.bot-message {
  align-self: flex-start;
  background-color: #e0e0e0;
}

.input-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ccc;
}

textarea {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #0084ff;
  color: white;
  cursor: pointer;
}
.el-dropdown-link{
  color: rgb(255, 255, 255);
  text-decoration: none;
  cursor: pointer;
  size:150px;
}
.upload-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #0084ff;
  color: white;
  cursor: pointer;
  margin-left: 10px;
}
</style>
