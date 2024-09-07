<template>
  <div class="login-container">
    <img src="/Logo.png" alt="Description" style="width:25%;height: auto;"></img>
    <h1>新用户注册</h1>
    
    <div class="input-group">
      <label for="user_email">邮箱:</label>
      <el-input v-model="user_email" style="width: 340px" id="user_email" placeholder="请输入邮箱"></el-input>
    </div>
    <div class="input-group">
      <label for="user_name">用户名:</label>
      <el-input v-model="user_name" style="width: 340px" id="user_name" placeholder="请输入用户名"></el-input>
    </div>
    <div class="input-group">
      <label for="v_code">验证码:</label>
      <div class="verification-group">
        <el-input v-model="v_code" style="flex: 1" id="v_code" placeholder="请输入验证码" show-password></el-input>
        <a @click.prevent="getVerificationCode" class="get-code-btn">获取验证码</a>
      </div>
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
  import axios from "axios"

  const user_email = ref('1669929153@qq.com');
  const user_name = ref('LouiSixx');
  const v_code = ref('');
  const router = useRouter();

  
  const register = async () => {
  // 输出输入的值以供调试
  console.log(user_email.value);
  console.log(user_name.value);
  console.log(v_code.value); 
  // 检查邮箱是否为空
  if (user_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    // 构造请求体
    const body = new URLSearchParams({
      'user_email': user_email.value,
      'v_code': v_code.value, 
      'user_name': user_name.value
    }).toString();

    // 发送 POST 请求
    const response = await fetch('http://10.203.183.143:5000/user/register', {
      method: 'POST', // 指定请求方法
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
      },
      body: body // 将表单数据作为请求体
    });

    if (!response.ok) { // 检查HTTP状态码是否为200-299之间的成功状态
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // 解析返回的JSON数据
    console.log('000111',data);
    // 显示消息
    alert(data.message);

    // 判断 code 是否为 0
    if (data.code === 0) 
    {
      // 跳转到首页
      router.push('/');
    }
  } catch (error) {
    alert('登录失败，请检查您的凭证');
    console.error('Registration failed:', error);
  }
};


// 获取验证码的逻辑
const getVerificationCode = async () => {
  if (user_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    // 创建URLSearchParams对象来构建请求体
    // const formData = new FormData();
    // formData.append('email', email.value);
    const body = new URLSearchParams({ 'user_email': user_email.value }).toString();

    const response = await fetch('http://10.203.183.143:5000/user/verify', {
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
  // let seconds = 60;
  //     this.getCodeText = `${seconds}秒后重试`;
  //     const timer = setInterval(() => {
  //       seconds--;
  //       this.getCodeText = `${seconds}秒后重试`;
  //       if (seconds === 0) {
  //         clearInterval(timer);
  //         this.getCodeText = '获取验证码';
  //         this.isGettingCode = false;
  //       }
  //     }, 1000);

  const back = async () => 
  {
    router.push('/');
  }
  </script>
  
  <style scoped>
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
  
  /* 使验证码输入框和按钮作为一个整体 */
  .verification-group {
    display: flex;
    align-items: center;
    width: 340px; /* 与输入框宽度一致 */
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
  
  .el-input {
    width: calc(340px - 100px - 10px); /* 减去标签宽度和左右边距 */
  }
  
  /* 如果需要，可以添加其他样式来进一步美化登录表单 */
  </style>