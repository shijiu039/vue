<template>
    <div class="login-container">
      <img src="/Logo.png" style="width:25%;height: auto;"  alt="Description"></img>
      <h1>管理员注册</h1>
      
      <div class="input-group">
        <label for="administrator_email">邮箱:</label>
        <el-input v-model="administrator_email" style="width: 340px" id="administrator_email" placeholder="请输入邮箱"></el-input>
      </div>
      <div class="input-group">
        <label for="administrator_name">用户名:</label>
        <el-input v-model="administrator_name" style="width: 340px" id="administrator_name" placeholder="请输入用户名"></el-input>
      </div>
      <div class="input-group">
        <label for="key">管理员令牌:</label>
        <el-input v-model="key" style="width: 340px" id="key" placeholder="请输入令牌"></el-input>
      </div>
      <div class="input-group">
  <label for="password">密码:</label>
  <el-input v-model="password" style="width: 340px" id="password" type="password" placeholder="请输入密码" show-password></el-input>
</div>
<div class="input-group">
  <label for="confirmPassword">确认密码:</label>
  <el-input v-model="confirmPassword" style="width: 340px" id="confirmPassword" type="confirmPassword" placeholder="请输入确认密码" show-password></el-input>
</div>
<div class="input-group">
  <label for="v_code">验证码:</label>
  <el-input v-model="v_code" style="width: 235px" id="v_code" type="text" placeholder="请输入验证码" show-password></el-input>
  <a @click.prevent="getVerificationCode" class="get-code-btn">获取验证码</a>
</div>
      <div class="button_group">
        <el-button type="primary" @click="register">注册</el-button>
        <el-button type="primary" @click="back">返回</el-button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  const administrator_email = ref('1669929153@qq.com');
  const administrator_name = ref('LouiSixx');
  const password = ref('louis1617');
  const confirmPassword = ref('louis1617');
  const v_code = ref('');
  const key = ref('aaaaaa');
  const router = useRouter();
  
  const register = async () => {
  // 注册逻辑
  console.log(administrator_email.value);
  console.log(administrator_name.value);
  console.log(password.value);

  if (administrator_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    // 构造请求体
    const body = new URLSearchParams({
      'administrator_email': administrator_email.value,
      'administrator_name': administrator_name.value,
      'v_code': v_code.value,
      'key': key.value,
      'password1': password.value,
      'password2': confirmPassword.value
    }).toString();

    // 发送 POST 请求
    const response = await fetch('http://192.168.188.92:5000/administrator/register', {
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
      console.log('Register successfully:', data.message);
      alert('注册成功');
      router.push('/ALogin'); // 注册成功后跳转到登录页
    } else {
      console.log('Register failed:', data.message);
      alert(data.message);
    }
  } catch (error) {
    alert('注册失败');
    console.error('Register failed:', error);
  }
};
const getVerificationCode = async () => {
  if (administrator_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    // 创建URLSearchParams对象来构建请求体
    const body = new URLSearchParams({ 'email': administrator_email.value }).toString();

    const response = await fetch('http://192.168.188.92:5000/administrator/verify', {
      method: 'POST', // 指定请求方法
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
      },
      
      body:body// 将FormData转换成字符串形式
    });

    if (!response.ok) { // 检查HTTP状态码是否为200-299之间的成功状态
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // 解析返回的JSON数据
    console.log('Verification code sent successfully:', data);
    // 处理发送验证码成功后的逻辑
  } catch (error) {
    alert('获取验证码失败');
    console.error('Verification code request failed:', error);
  }
};

  const back = async () => 
  {
    router.push('/ALogin');
  }

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
  justify-content: center;
  align-items: center;
  gap: 10px; /* 在元素之间添加一些间距 */
  width: 100%; /* 设置宽度，使文本框能够正确对齐 */
}

/* 对于标签，我们可以增加一点样式使其更加一致 */
.input-group label {
  flex-shrink: 0; /* 防止标签在缩小窗口时收缩 */
  width: 80px; /* 给标签一个固定宽度，这样它们会保持一致 */
  text-align: right; /* 文本右对齐，以便于阅读 */
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
/* 如果需要，可以添加其他样式来进一步美化登录表单 */
</style>


