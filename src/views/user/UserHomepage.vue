<template>
  <div class="page-container" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <header class="header">
      <div class="header-title">个人主页</div>
      <div class="header-user">
        <router-link to="/Home" class="user-link">返回</router-link>
      </div>
    </header>

    <div class="profile-container">
      <div class="profile-content">
        <input
          type="file"
          ref="fileInput"
          style="display: none;"
          @change="handleFileChange"
        />
        <img
          :src="userInfo.avatar"
          alt="User Avatar"
          class="user-avatar"
          @dblclick="openFileDialog"
        />
        <div class="user-details">
          <p class="user-name">
            用户名：
            <span>{{ userInfo.user_name }}</span>
            <a @click.prevent="openDialog" class="change_name_btn">修改</a>
          </p>
          <p class="user-email">邮箱：{{ userInfo.email }}</p>
        </div>
      </div>
    </div>

    <div class="satisfaction-container">
      <h3>个人满意度</h3>
      <el-rate
        v-model="satisfaction"
        allow-half="false" 
        @change="updateSatisfaction"
        class="satisfaction-rate"
        :max="5" 
      ></el-rate>
      <p class="satisfaction-text">当前评分：{{ satisfaction }}</p>
    </div>

    <!-- 自定义对话框 -->
    <div v-if="dialogVisible" class="custom-dialog">
      
      <div class="dialog-content">
        <h3>修改用户名</h3>
        <input
          v-model="newUserName"
          placeholder="请输入新的用户名"
          class="dialog-input"
        />
        <div class="dialog-footer">
          <button @click="resetNewUserName" class="dialog-button">取消</button>
          <button @click="confirmChangeName" class="dialog-button dialog-button-primary">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const userInfo = ref({
  user_name: '',
  email: '',
  avatar: '/public/latest.png',
  user_id: '',
});
const backgroundImage = ref('/public/latest.png');
const fileInput = ref<HTMLInputElement | null>(null);

const dialogVisible = ref(false);
const newUserName = ref('');
const satisfaction = ref(0);

// 初始化用户信息
const storedUserInfo = localStorage.getItem('userInfo');
if (storedUserInfo) {
  const parsedUserInfo = JSON.parse(storedUserInfo);
  userInfo.value = {
    user_id: parsedUserInfo.data.user_id,
    user_name: parsedUserInfo.data.user_name,
    email: parsedUserInfo.data.email,
    avatar: parsedUserInfo.data.img_path
  };
  backgroundImage.value = userInfo.value.avatar;
  
  // 从 localStorage 读取满意度
  const storedSatisfaction = localStorage.getItem('satisfaction');
  if (storedSatisfaction) {
    satisfaction.value = parseInt(storedSatisfaction, 10);
  }
}

// 打开文件选择对话框
const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件选择并上传
const handleFileChange = async (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const formData = new FormData();
    console.log(userInfo.value.user_id);
    formData.append('user_id', userInfo.value.user_id);
    formData.append('img_path', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/user/update_img', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log(result);
      if (result.code === 0) {
        userInfo.value.avatar = result.data.img_path;
        backgroundImage.value = result.data.img_path;
        localStorage.setItem('userInfo', JSON.stringify(result));
      } else {
        console.error('Upload failed:', result.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

// 打开对话框
const openDialog = () => {
  newUserName.value = userInfo.value.user_name;
  dialogVisible.value = true;
};

// 关闭对话框并重置输入框
const resetNewUserName = () => {
  dialogVisible.value = false;
  newUserName.value = '';
};

// 确认修改用户名
const confirmChangeName = async () => {
  if (newUserName.value.trim() === '') {
    alert('用户名不能为空');
    return;
  }

  try {
    const body = new URLSearchParams({
      'user_id': userInfo.value.user_id,
      'new_username': newUserName.value
    }).toString();

    const response = await fetch('http://127.0.0.1:5000/user/update_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    if (result.code === 0) {
      userInfo.value.user_name = result.data.user_name;
      localStorage.setItem('userInfo', JSON.stringify(result));
      resetNewUserName();
    } else {
      console.error('Update name failed:', result.message);
    }
  } catch (error) {
    console.error('Error updating username:', error);
  }
};

// 更新满意度评分
const updateSatisfaction = async (rating: number) => {
  const integerRating = Math.floor(rating); // 确保评分是整数
  satisfaction.value = integerRating;

  // 保存满意度到 localStorage
  localStorage.setItem('satisfaction', integerRating.toString());

  try {
    const response = await fetch('http://127.0.0.1:5000/user/satisfaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'user_id': userInfo.value.user_id,
        'satisfaction': integerRating.toString()
      }).toString()
    });

    const result = await response.json();
    console.log(result);
    if (result.code == 0) {
      alert('满意度评价成功，感谢您的支持');
    }
    if (result.code !== 0) {
      console.error('更新满意度失败:', result.message);
    }
  } catch (error) {
    console.error('更新满意度时出错:', error);
  }
};
</script>

<style scoped>
.page-container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: rgba(31, 30, 51, 0.8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  padding: 0 20px;
}

.header-title {
  font-size: 18px;
}

.header-user {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.user-link {
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin-right: 30px;
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
}

.profile-content {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 20px;
  border: 2px solid #370ea8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
  object-fit: cover;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
}

.user-avatar:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.user-name, .user-email {
  margin: 10px 0;
  font-size: 18px;
  color: #1f1e33;
}

.change_name_btn {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s, text-decoration 0.3s;
  margin-left: 20px;
}

.change_name_btn:hover {
  color: #0056b3;
}

.custom-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1999;
}

.dialog-content {
  padding: 20px;
  text-align: center;
}

.dialog-input {
  width: 80%;
  padding: 8px;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}

.dialog-button {
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.dialog-button-primary {
  background-color: #007bff;
  color: white;
}

.dialog-button-primary:hover {
  background-color: #0056b3;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.star {
  font-size: 24px;
  cursor: pointer;
  color: #f39c12;
}

.star:hover,
.star:hover ~ .star {
  color: #f39c12;
}.satisfaction-container {
  margin-top: 30px;
  text-align: center;
}

.satisfaction-rate {
  font-size: 24px;
  color: #f39c12;
}

.satisfaction-text {
  margin-top: 10px;
  font-size: 18px;
}
</style>
