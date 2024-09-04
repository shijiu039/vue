<template>
    <div class="fixed-layout">
      <div class="login-container">
        <img src="/public/Logo.png" style="width:25%;height: auto;" alt="Image"></img>
          <h1>管理员登录</h1>
          <div class="input-group">
          <label for="administrator_email">邮箱:</label>
          <el-input v-model="administrator_email" style="width: 240px" id="administrator_email" placeholder="请输入邮箱"></el-input>
        </div>
        <div class="input-group">
            <label for="password">密码:</label>
            <el-input v-model="password" style="width: 240px" id="password" type="password" placeholder="请输入密码" show-password></el-input>
        </div>
        <div class="button_group">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="primary" @click="user">我不是管理员，返回</el-button>
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
  // 登录逻辑
  console.log(administrator_email.value);
  console.log(password.value);

  if (administrator_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    // 构造请求体
    const body = new URLSearchParams({
      'administrator_email': administrator_email.value,
      'password': password.value
    }).toString();

    // 发送 POST 请求
    const response = await fetch('http://192.168.188.92:5000/administrator/login', {
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

    // 检查返回的 JSON 数据中的 code 参数
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

    // 下面的跳转代码开发管理员页面时测试用，全写完之后记得删
    // router.push('/UserM');
  }
};

    const register = () => 
    {
      router.push('/ARegister'); // 登录成功后跳转到主页
    };
    const user = () => 
    {
      router.push('/'); 
    };
  </script>
    
  <style>
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh; /* 使用视口高度单位 */
      gap: 10px; /* 在元素之间添加一些间距 */
    }
    
    .input-group {
      display: flex;
      align-items: center;
      gap: 10px; /* 在元素之间添加一些间距 */
    }
    .button-group {
      display: flex;
      align-items: center;
      gap: 10px; /* 在元素之间添加一些间距 */
    }
    /* 如果需要，可以添加其他样式来进一步美化登录表单 */
  </style>