<template>
  <div class="fixed-layout">
    <div class="login-container">
      <div class="clear-container">
        <img src="/public/Logo.png" alt="Description" />
        <h1>用户登录</h1>
        <div class="input-group">
          <label for="user_email">邮箱:</label>
          <el-input v-model="user_email" style="width: 340px" id="user_email" placeholder="请输入邮箱"></el-input>
        </div>
        <div class="input-group">
          <label for="v_code">验证码:</label>
          <div class="input-with-button">
            <el-input v-model="v_code" style="width: 235px" id="v_code" type="v_code" placeholder="请输入验证码" show-password></el-input>
            <a @click.prevent="getVerificationCode" class="get-code-btn">获取验证码</a>
          </div>
        </div>
        <div class="button_group">
          <el-button type="primary" @click="login" style="width: 15%;">登录</el-button>
          <el-button type="primary" @click="register" style="width: 15%;">注册</el-button>
          <el-button type="primary" @click="admin" style="width: 15%;">我是管理员</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 引入 Pinia store

const authStore = useAuthStore();

const user_email = ref('');
const v_code = ref('');
const router = useRouter();

const login = async () => {
  if (user_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    const body = new URLSearchParams({
      'user_email': user_email.value,
      'v_code': v_code.value
    }).toString();

    const response = await fetch('http://192.168.188.92:5000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    localStorage.setItem('userInfo', JSON.stringify(data));

    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      data.value = JSON.parse(storedUserInfo);
      localStorage.setItem('token', JSON.stringify(data.value.data.user_name));
    }

    if (data.code === 0) {
      console.log('Login successful:', data.message);
      alert(data.message);
      authStore.login(data.user);
      console.log(data);
      router.push('/home');
    } else {
      console.log('Login failed:', data.message);
      alert(data.message);
    }
  } catch (error) {
    alert('登录失败，请检查您的凭证');
    console.error('Login failed:', error);
  }
};

const register = () => {
  router.push('/register');
};

const admin = () => {
  router.push('/ALogin');
};

const getVerificationCode = async () => {
  if (user_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    const body = new URLSearchParams({ 'user_email': user_email.value }).toString();

    const response = await fetch('http://192.168.188.92:5000/user/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Verification code sent successfully:', data);
  } catch (error) {
    alert('获取验证码失败');
    console.error('Verification code request failed:', error);
  }
};
</script>

<style scoped>
.fixed-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 确保容器至少与视口一样高 */
  background-image: url('/user_background.jpeg'); /* 替换为你的图片URL */
  background-size: cover; /* 使图片覆盖整个容器 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 确保图片不会重复 */
}

.login-container {
  position: relative; /* 确保伪元素能够相对于它定位 */
  background-color: rgba(255, 255, 255, 0.2); /* 半透明背景 */
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 800px;
  height: 800px;
  opacity: 0.8; /* 设置透明度 */
}

.clear-container {
  position: relative; /* 确保内部元素相对于它定位 */
  background-color: white; /* 白色背景 */
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  height: 100%;
  z-index: 1; /* 确保在背景之上 */
}

.clear-container img {
  width: 40%; /* 减小 Logo 的大小 */
  height: auto;
  margin-bottom: 20px; /* 增加 Logo 与标题之间的间距 */
}

.clear-container h1 {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* 在元素之间添加一些间距 */
  width: 100%; /* 设置宽度，使文本框能够正确对齐 */
  margin-bottom: 15px;
}

.input-group label {
  flex-shrink: 0; /* 防止标签在缩小窗口时收缩 */
  width: 80px; /* 给标签一个固定宽度，这样它们会保持一致 */
  text-align: right; /* 文本右对齐，以便于阅读 */
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 10px; /* 在元素之间添加一些间距 */
}

.get-code-btn {
  margin-left: 10px;
  padding: 5px; /* 调整为合适的大小 */
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #409EFF; /* Element UI 主题色 */
  text-decoration: underline;
}

.get-code-btn:hover {
  color: #66b1ff; /* 鼠标悬停时的颜色 */
}

.button_group {
  display: flex;
  justify-content: center; /* 调整按钮间距 */
  margin-top: 20px;
  width: 100%;
}

.button_group .el-button {
  width: 15%; /* 减小按钮宽度 */
}
</style>