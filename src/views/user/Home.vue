<template>
  <div class="app-container">
    <header class="header">
      <div class="header-title">
        图文检索系统 Traiining Apperrance
      </div>
      <div class="header-user">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/personal-center" class="dropdown-item" exact>个人主页</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <a href="#" class="dropdown-item" @click.prevent="confirmLogout">退出登录</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <nav class="sidebar">
      <ul>
        <li v-for="(session, index) in sessions" :key="index" class="session-item" @click="selectSession(index)">
          <span>{{ session.title }}</span>
          <button class="delete-button" @click.stop="confirmDeleteSession(index)">×</button>
        </li>
        <li class="add-session" @click="addNewSession">+ New Dialogue</li>
      </ul>
    </nav>
    <main class="main-container">
      <div class="chat-history" ref="chatHistory">
        <div
          v-for="(message, index) in currentSession.messages"
          :key="index"
          :class="['message-container', message.isUser ? 'user-message-container' : 'bot-message-container']"
        >
          <!-- 消息框 -->
          <div :class="['message', message.isUser ? 'user-message' : 'bot-message']">
            <!-- 展示图片 -->
            <img v-if="message.imageUrl" :src="message.imageUrl" alt="Uploaded Image" class="message-image"/>

            <!-- 展示文字信息 -->
            <p v-if="message.score">{{ message.score }}</p>
            <span v-else-if="message.text">{{ message.text }}</span>
          </div>

          <!-- 添加头像 -->
          <img 
            v-if="message.isUser" 
            :src="avatar.url" 
            alt="User Avatar" 
            class="avatar user-avatar"
          />
          <img v-if="!message.isUser" src="/Logo.png" alt="Bot Avatar" class="avatar bot-avatar"/>

          <!-- 只在用户消息时显示删除图标 -->
          <a v-if="message.isUser" href="#" class="remove-message" @click.prevent="confirmDeleteMessage(message.historyId)">
            ×
          </a>
        </div>
      </div>
      <div class="input-section">
        <textarea v-model="newMessage" placeholder="Type your message here..." @keyup.enter="sendMessage"></textarea>
        <button @click="sendMessage">发送</button>
        <label for="file-input" class="upload-button">上传图片</label>
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
    const avatar = ref({url:'/Logo.png'});
    console.log(storedUserInfo);
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      userInfo.value = JSON.parse(storedUserInfo);
      avatar.value = {url: userInfo.value.data.img_path};
    }
    console.log(userInfo.value.data.img_path);

    const username = userInfo.value.data.user_name; // Replace with actual username logic
    console.log(username);
    console.log(avatar);
    console.log(avatar.value.url);
    const newMessage = ref('');
    const sessions = ref([
      {
        title: 'Welcome Session',
        dialogue_id: '', // 临时值，将在 fetchAllDialogues 中替换
        messages: [
          { text: 'Hello! How can I assist you today?', isUser: false }
        ]
      }
    ]);
    
    const currentSessionIndex = ref(0);
    const currentSession = ref(sessions.value[currentSessionIndex.value]);
    const chatHistory = ref(null);

    const confirmDeleteSession = (index: number) => {
      if (confirm('确定要删除此会话吗？')) {
        deleteSession(index);
      }
    };

    const deleteSession = async (index: number) => {
      const dialogueId = sessions.value[index].dialogue_id;
console.log(dialogueId);
      try {
        const formData = new FormData();
        formData.append('dialogue_id', dialogueId);

        const response = await fetch(`http://127.0.0.1:5000/user/deletedialogue`, {
          method: 'POST',
          body: formData // 使用FormData对象作为请求体
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        if (data.code === 0) {
          // 成功删除后从前端状态中移除会话
          sessions.value.splice(index, 1);
          alert('会话已成功删除');
        } else {
          alert(data.message || '删除会话失败');
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
        alert('删除会话时发生错误，请稍后再试');
      }
    };

const selectSession = (index: number) => {
      currentSessionIndex.value = index;
      currentSession.value = sessions.value[index];
      getDialogueMessages(sessions.value[index].dialogue_id);
      console.log(sessions.value[index].dialogue_id);
      //scrollToBottom();
    };

const fetchAllDialogues = async () => {
      const userId = userInfo.value.data.user_id;

      try {
        const formData = new FormData();
        formData.append('user_id', userId);

        const response = await fetch('http://127.0.0.1:5000/user/dialoguelist', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.code === 0) {
          const dialogues = data.data.map(dialogue => ({
            title: dialogue.title,
            dialogue_id: dialogue.dialogue_id,
            messages: []
          }));

          sessions.value = dialogues;
          alert('会话列表加载成功');
        } else {
          alert(data.message || '获取会话列表失败');
        }
      } catch (error) {
        console.error('Failed to fetch all dialogues:', error);
        alert('获取会话列表时发生错误，请稍后再试');
      }
    };

const getDialogueMessages = async (dialogueId: string) => {
  const userId = userInfo.value.data.user_id;

  try {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('dialogue_id', dialogueId);

    const response = await fetch('http://127.0.0.1:5000/user/get_dialogue', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
    if (data.code === 0) {
      const messagesData = data.data;
      const updatedMessages = messagesData.flatMap(item => {
        const results = [];

        if (item.type === 1) {
          // 文字消息处理
          results.push({
            text: item.question,
            isUser: true,
            historyId: item.id
          });

          for (let i = 1; i <= 8; i++) {
            const resultKey = `result_${i}`;
            if (item[resultKey]) {
              results.push({
                //text: item[resultKey],
                isUser: false,
                imageUrl: item[resultKey].includes('.jpg') ? item[resultKey] : undefined,
                historyId: item.id
              });
            }
          }
        } else if (item.type === 0) {
          // 处理图片消息
          results.push({
            imageUrl: item.question, // 使用 imageUrl 替代 text
            isUser:true,
            isImage: true, // 标记为图片
            historyId: item.id
          });

          for (let i = 1; i <= 8; i++) {
            const resultKey = `result_${i}`;
            if (item[resultKey]) {
              results.push({
                text: item[resultKey],
                isUser: false,
                imageUrl: item[resultKey].includes('.jpg') ? item[resultKey] : undefined,
                historyId: item.id
              });
            }
          }
        }
        return results;
      });

      currentSession.value.messages = updatedMessages;
      scrollToBottom();
    } else {
      alert(data.message || '获取会话数据失败');
    }
  } catch (error) {
    console.error('Failed to get dialogue messages:', error);
    alert('获取会话数据时发生错误，请稍后再试');
  }
};

const loadInitialData = async () => {
      if (currentSessionIndex.value >= 0 && currentSessionIndex.value < sessions.value.length) {
        await getDialogueMessages(sessions.value[currentSessionIndex.value].dialogue_id);
        
      }
    };

onMounted(async () => {
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo);
  }
  await fetchAllDialogues();
  await loadInitialData();
  selectSession(0);
  scrollToBottom();
});
    
const addNewSession = async () => {
    const title = prompt('请输入会话标题：');
    const userId = userInfo.value.data.user_id;
    try {
    
    if (title) {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('title', title);
      const response = await fetch('http://127.0.0.1:5000/user/new_dialogue', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
      throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      console.log(data.data.dialogue_id);
      if (data.code === 0) {
        
       const newSessionTitle = title;
        sessions.value.push({
        title: newSessionTitle,
        dialogue_id:data.data.dialogue_id,
      //   messages: []
       });
       selectSession(sessions.value.length - 1);
      alert('会话创建成功');
      getDialogueMessages(data.data.dialogue_id);
      } else {
      alert(data.message || '创建会话失败');
      }
    }
      } catch (error) {
        console.error('Failed to create new dialogue:', error);
        alert('创建会话时发生错误，请稍后再试');
      }
    };

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    currentSession.value.messages.push({ text: newMessage.value, isUser: true });

    // 使用正确的会话 ID
    const body = {
      'text': newMessage.value,
      'user_id': userInfo.value.data.user_id,
      'dialogue_id': currentSession.value.dialogue_id // 使用正确的会话 ID
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/user/texttoimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(body as any).toString() // 使用 URLSearchParams 对象来构建请求体
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      newMessage.value = ''; // 清空输入字段
      const data = await response.json();
      if (data.code === 0) {
        if (Array.isArray(data.data)) {
          data.data.forEach((item: any[]) => {
            const imageUrl = item[0].toString();
            const score = item[1];
            const messageItem = {
              imageUrl: imageUrl,
              text: `相关度分数: ${score.toFixed(4)}`,
              isUser: false
            };
            currentSession.value.messages.push(messageItem);
          });
        }

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


  }
};


const uploadImage = async (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    // 读取文件作为 Data URL
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      // 添加用户消息（包含图片）
      currentSession.value.messages.push({ 
        imageUrl: imageUrl, 
        isImage: true, 
        isUser: true 
      });
      // 上传图片到服务器
      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_id', userInfo.value.data.user_id);
      formData.append('dialogue_id', currentSession.value.dialogue_id);
      try {
        const response = await fetch('http://127.0.0.1:5000/user/imagetotext', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Image upload successfully:', data);
        if (data.code === 0) {
          if (Array.isArray(data.data)) {
            data.data.forEach((item: any[]) => {
              const textinfo = item[0];
              const score = item[1];
              const messageItem = {
                text: `${textinfo} 相关度分数: ${score.toFixed(4)}`,
                isUser: false
              };
              currentSession.value.messages.push(messageItem);
            });
          }
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('上传图片时发生错误，请稍后再试');
      }
      // 添加系统消息，表示图片已上传并进行处理
      currentSession.value.messages.push({ 
        text: 'Thanks for the image. Let me take a look...', 
        isUser: false 
      });
      // 确保页面滚动到最新消息
      scrollToBottom();
    };
    // 读取文件
    reader.readAsDataURL(file);
  }
};

const scrollToBottom = () => {
      if (chatHistory.value) {
        chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
      }
    };
const confirmLogout=()=>{
  if (confirm('确定要退出登录吗？')) {
        logout();
      }
}
const logout = () => {
  // 清除用户的认证状态或其他相关数据
    localStorage.removeItem('token'); // 示例：删除本地存储的 token
    localStorage.removeItem('userInfo');
    // 跳转到登录页面
     router.push('/');
};
watchEffect(() => {
      scrollToBottom();
    });
const confirmDeleteMessage=(historyId: string)=>{
  if (confirm('确定要删除此记录吗？')) {
        deleteMessage(historyId);
  }
}
const deleteMessage = async (historyId: string) => {
  console.log('Deleting message with historyId:', historyId); // 输出 historyId

  if (!historyId) {
    console.error('No history ID provided for deletion.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('history', historyId);

    const response = await fetch('http://127.0.0.1:5000/user/deletehistory', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.code === 0) {
      alert('删除成功');
      await loadInitialData();
    } else {
      alert(data.message || '删除失败');
    }
  } catch (error) {
    console.error('Delete failed:', error);
    alert('删除失败，请稍后再试');
  }
};

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
      logout,
      confirmLogout,
      confirmDeleteSession,
      deleteSession,
      deleteMessage,
      confirmDeleteMessage,
      avatar,
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
.session-item {
  display: flex; /* 使用Flexbox布局 */
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 内容两端对齐 */
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.delete-button {
  background: transparent; /* 透明背景 */
  border: none; /* 无边框 */
  color: rgb(107, 82, 82); /* 文字颜色 */
  font-size: 2.4rem; /* 字体大小 */
  cursor: pointer; /* 鼠标指针 */
  padding: 0; /* 移除默认padding */
}

.delete-button:hover {
  color: darkred; /* 鼠标悬停时的颜色 */
}

.session-item span {
  flex-grow: 1; /* 允许文本扩展以占据剩余空间 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 隐藏超出的部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.message-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  max-width: 80%;
  margin: 0 auto;
  position: relative; /* 使头像和删除按钮能够相对定位 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-avatar {
  margin-left: 10px; /* 用户头像与消息框之间的间距 */
  order: 2; /* 使头像出现在消息框的右边 */
}

.bot-avatar {
  margin-right: 10px; /* AI头像与消息框之间的间距 */
  order: -2; /* 使头像出现在消息框的左边 */
}

.user-message-container {
  justify-content: flex-end; /* 用户消息右对齐 */
}

.bot-message-container {
  justify-content: flex-start; /* AI消息左对齐 */
}

.message {
  max-width: 300px;
  min-width: 150px;
  padding: 10px;
  border-radius: 10px;
  background-color: #0084ff;
  color: white;
  position: relative; /* 使删除按钮能够相对于消息块定位 */
  word-wrap: break-word;
}

.user-message {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 右对齐消息文本 */
  background-color: #0084ff;
  color: white;
}

.bot-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐消息文本 */
  background-color: #e0e0e0;
  color: black;
}

.message-image {
  max-width: 100%;
  border-radius: 5px;
}

.remove-message {
  display: inline-block;
  padding: 5px;
  background-color: #ff0000;
  color: white;
  border-radius: 10%;
  cursor: pointer;
  text-decoration: none;
  position: absolute;
  right: 30px; /* 使删除按钮显示在消息框外面 */
  bottom: -15px; /* 使删除按钮显示在消息框外面 */
  font-size: 1px;
  line-height: 1;
  opacity: 0.25;
}

.remove-message:hover {
  background-color: #e60000;
}
.upload-button{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
