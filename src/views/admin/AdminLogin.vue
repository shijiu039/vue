<template>
  <div class="fixed-layout">
    <div class="login-container">
      <div class="clear-container">
        <img src="/public/Logo.png" alt="Description" />
        <h1>管理员登录</h1>
        <div class="input-group">
          <label for="administrator_email">邮箱:</label>
          <el-input v-model="administrator_email" style="width: 340px" id="administrator_email" placeholder="请输入邮箱"></el-input>
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <el-input v-model="password" style="width: 340px" id="password" type="password" placeholder="请输入密码" show-password></el-input>
        </div>
        <div class="button_group">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="primary" @click="user">我不是管理员，返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; // 引入 Pinia store

const authStore = useAuthStore();

const administrator_email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  console.log(administrator_email.value);
  console.log(password.value);

  if (administrator_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    const body = new URLSearchParams({
      'administrator_email': administrator_email.value,
      'password': password.value
    }).toString();

    const response = await fetch('http://127.0.0.1:5000/administrator/login', {
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
    localStorage.setItem('AdminInfo', JSON.stringify(data));

    const storedAdminInfo = localStorage.getItem('AdminInfo');
    if (storedAdminInfo) {
      data.value = JSON.parse(storedAdminInfo);
      console.log(data.value.data);
      localStorage.setItem('token', JSON.stringify(data.value.data.administrator_name));
    }

    if (data.code === 0) {
      console.log('Login successful:', data.message);
      alert('登录成功');
      authStore.login(data.user); // 更新登录状态
      router.push('/UserM'); // 登录成功后跳转到管理员主页
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
  router.push('/ARegister'); // 登录成功后跳转到主页
};

const user = () => {
  router.push('/'); 
};
</script>

<style scoped>
.fixed-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 确保容器至少与视口一样高 */
  background-image: url('/admin_background.jpg'); /* 替换为你的图片URL */
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

.el-input {
  width: calc(340px - 100px - 10px); /* 减去标签宽度和左右边距 */
}

.button_group {
  display: flex;
  justify-content: center; /* 调整按钮间距 */
  margin-top: 20px;
  width: 100%;
}

.button_group .el-button {
  width: 20%; /* 减小按钮宽度 */
}
</style>