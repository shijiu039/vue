<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu default-active="1-1" class="el-menu-vertical-demo">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <message />
                  <el-icon>
                    <User />
                  </el-icon>
                </el-icon>用户管理
              </template>
              <el-menu-item index="1-1" @click="goToUserManagement">用户管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <icon-menu />
                  <el-icon>
                    <Edit />
                  </el-icon>
                </el-icon>数据库管理
              </template>
              <el-menu-item index="2-1" @click="goToImageManagement">图像管理</el-menu-item>
              <el-menu-item index="2-2" @click="goToTextManagement">文本管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header>
          <div style="display: flex; align-items: center;">
            <el-input placeholder="请输入搜索内容" v-model="keyword_user" style="width: 200px; margin-right: 10px;">
            </el-input>
            <el-button type="primary" @click="searchUser">搜索</el-button>
          </div>
          <div>
            <el-icon>
              <User />
            </el-icon>
            <span>用户数量：{{ userList.length }}</span>
          </div>
          <el-popconfirm title="你确定退出登录吗" @confirm="OutLog">
            <template #reference>
              <el-button type="warning">
                退出登录<el-icon class="el-icon--right">
                  <Upload />
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </el-header>
        <el-main>
          <!-- 用户列表 -->
          <el-table :data="userList" style="width: 100%" :default-sort="{ prop: 'date', order: 'ascending' }"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="user_name" label="姓名" sortable width="180">
            </el-table-column>
            <el-table-column prop="user_id" label="id" sortable width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" sortable width="400">
            </el-table-column>
            <el-table-column prop="satisfaction" label="用户满意度" sortable width="180">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-popconfirm title="你确定删除这名用户吗?" @confirm="deleteUser(scope.row)">
                  <template #reference>
                    <el-button size="small" type="danger">Delete</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import {
    User,
    Edit,
    Upload
  } from '@element-plus/icons-vue';
  import {
    ref
  } from 'vue';
  import {
    useRouter
  } from 'vue-router';
  import {
    onMounted,
  } from 'vue';
  import { ElMessage } from 'element-plus';


  // 使用onMounted钩子，在组件挂载后调用
  onMounted(() => {
    getUser();
  });
  var userList = ref([]);


  const keyword_user = ref('');
  const router = useRouter();

  const handleOpen = (key, keyPath) => {
    console.log(key, keyPath);
  };

  const handleClose = (key, keyPath) => {
    console.log(key, keyPath);
  };

  const goToTextManagement = () => {
    router.push('/TextM');
  };

  const goToUserManagement = () => {
    router.push('/UserM');
  };

  const OutLog = () => {
    router.push('/ALogin')
  };
  const goToImageManagement = () => {
    router.push('/ImageM');
  };
  // 定义你想要调用的函数
  const getUser = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/administrator/userlist', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      var data_1 = await response.json(); // 解析返回的JSON数据
      console.log('list get successfully:', data_1);
      // 如果需要根据后端响应做进一步处理
      if (data_1.code === 0) {
        userList.value = data_1.data; // 更新userList
      } else {
        console.error('Failed to retrieve user list:', data_1);
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const deleteUser = async (row) => {
    try {
      // 构造请求体
      const body = new URLSearchParams({
        'user_id': row.user_id,
      }).toString();
      // 发送请求到后端API来删除用户
      console.log("delete_id", row.user_id);
      const response = await fetch(`http://127.0.0.1:5000/administrator/deleteUser`, {
        method: 'POST', // 指定请求方法
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
        },
        body: body
      });

      // 检查响应状态
      if (!response.ok) { // response.ok 检查状态码是否在200-299之间
        throw new Error(`用户删除失败，状态码: ${response.status}`);
      }
      const data = await response.json(); // 解析返回的JSON数据
      // 假设后端返回了删除成功的状态
      if (data.code === 0) {
        ElMessage({
          type: 'success',
          message: '用户删除成功!'
        });
        // 更新用户列表，移除已删除的用户
        const index = userList.value.findIndex(user => user.user_id === row.user_id);
        if (index !== -1) {
          userList.value.splice(index, 1);
        }
      } else {
        ElMessage({
          type: 'error',
          message: '用户删除失败!'
        });
      }

    } catch (error) {
      // 处理网络错误或API错误
      console.error('用户删除失败:', error);
      ElMessage({
        type: 'error',
        message: error.message || '用户删除失败!'
      });
    }
  };

  const searchUser = async () => {
    console.log(keyword_user.value)
    try {
      // 构造请求体
      const body = new URLSearchParams({
        'input_user': keyword_user.value
      }).toString();
      // 发送请求到后端API
      const response = await fetch(`http://127.0.0.1:5000/administrator/UserSearch`, {
        method: 'POST', // 指定请求方法
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
        },
        body: body
      });
      // 处理响应
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        const data = await response.json(); // 解析返回的JSON数据
        console.log('get list successfully', data)
        userList.value = data; // 将解析后的JSON数据存储在userList中
      }
    } catch (error) {
      console.error('搜索失败:', error);
      this.$message({
        type: 'error',
        message: '搜索失败!'
      });
    }
  };
</script>

<style>
  /* 全局样式 */
  body,
  html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: 'Arial', sans-serif;
  }

  /* 布局样式 */
  .common-layout {
    background-color: #f0f2f5;
    /* 设置页面背景颜色 */
    height: 100%;
  }

  .el-container {
    flex-direction: column;
    height: 1000px;
    /* 确保容器充满页面 */
  }

  /* 可以根据需要添加其他样式 */

  .low-button {
    position: absolute;
    bottom: 5%;

  }

  /* 侧边栏样式 */
  .el-aside {
    width: 100%;
    /* 设置侧边栏宽度为100%，充满页面 */
    background-color: #e7eaed;
    /* 设置侧边栏背景颜色 */
    color: white;
    /* 设置文字颜色 */
    transition: width 0.3s;
    /* 平滑过渡效果 */
    border-right: none;
    /* 移除菜单右侧边框 */
    padding: 20px;
    /* 增加内边距 */
  }

  /* 头部样式 */
  .el-header {
    background-color: #f8f8f8;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
    /* 设置头部固定高度 */
    border-bottom: 1px solid #eaeaea;
    /* 添加底部边框 */
  }

  /* 主内容样式 */
  .el-main {
    background-color: #fff;
    /* 设置主内容背景颜色 */
    color: #333;
    padding: 20px;
    overflow-y: auto;
    /* 当内容超出时显示滚动条 */
    height: 100%;
    /* 确保主内容充满页面 */
  }

  /* 底部样式 */
  .el-footer {
    background-color: #f8f8f8;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    /* 设置底部固定高度 */
    border-top: 1px solid #eaeaea;
    /* 添加顶部边框 */
  }

  /* 用户数量显示样式 */
  .user-count {
    margin-left: 10px;
  }

  /* 悬浮效果 */
  .el-menu-vertical-demo .el-menu-item:hover,
  .el-menu-vertical-demo .el-sub-menu__title:hover {
    outline: 0;
    /* 移除焦点时的轮廓线 */
    color: #409EFF;
    /* 设置悬停时的文字颜色 */
  }

  /* 激活状态样式 */
  .el-menu-vertical-demo .el-menu-item.is-active {
    color: #50565c;
    /* 设置激活状态下的文字颜色 */
    background-color: #6fa3e2 !important;
    /* 设置激活状态下的背景颜色 */
  }

  /* 响应式设计 */
  @media (max-width: 1000px) {
    .el-aside {
      width: 60px;
      /* 小屏幕上侧边栏宽度 */
    }

    .el-header,
    .el-footer {
      height: 50px;
      /* 小屏幕上头部和底部的高度 */
    }

    .el-footer {
      height: 50px;
      /* 小屏幕上底部的高度 */
    }

    .el-menu--collapse {
      width: 100%;
    }

    .el-submenu__title {
      text-align: center;
    }

    .el-menu-item-group__title {
      display: none;
    }
  }
</style>