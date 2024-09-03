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
                </el-icon>用户管理
              </template>
              <el-menu-item index="1-1" @click="goToUserManagement">用户管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <icon-menu />
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
          <!-- 图标和用户数量显示 -->
          <div style="display: flex; align-items: center;">
            <el-icon style="margin-right: 10px;">
              <User />
            </el-icon>
            <span>图片数量：{{ userCount }}</span>
          </div>
        </el-header>
        <el-main>
          <!-- 用户列表 -->
          <el-table :data="userList" style="width: 100%" :default-sort="{ prop: 'date', order: 'ascending' }"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" label="姓名" sortable width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" sortable width="240">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-popconfirm title="Are you sure to delete this?"@confirm="deleteUser(scope.row)">
                  <template #reference>
                    <el-button size="small" type="danger" >Delete</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <div >
              <el-icon>
                <Picture />
              </el-icon>
              <span>图片数量：{{ imageCount }}</span>
            </div>
            <div style="margin-left: 20px;">
              <el-icon>
                <Document />
              </el-icon>
              <span>文本数量：{{ textCount }}</span>
            </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { User, Picture, Document } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userList = ref([
  {
    name: '张三',
    email: 'zhangsan@example.com',
  },
  {
    name: '李四',
    email: 'lisi@example.com',
  },
  // 更多用户数据...
]);

const userCount = ref(100);
const imageCount = ref(1000);
const textCount = ref(2000);

const router = useRouter();

// const handleOpen = (key, keyPath) => {
//   console.log(key, keyPath);
// };

// const handleClose = (key, keyPath) => {
//   console.log(key, keyPath);
// };

const goToTextManagement = () => {
  router.push('/TextM');
};

const goToUserManagement = () => {
  router.push('/UserM');
};

const goToImageManagement = () => {
  router.push('/ImageM');
};

const deleteUser = async (row) => {
  try {
    // 发送DELETE请求到后端API来删除用户
    const response = await this.$http.post(`/administrator/user_dele/${row.id}`);
    // 处理响应
    if (response.status === 200) {
      // 假设后端返回了删除成功的状态
      this.$message({
        type: 'success',
        message: '用户删除成功!'
      });
      // 更新用户列表，移除已删除的用户
      const index = userList.value.findIndex(user => user.id === row.id);
      if (index !== -1) {
        userList.value.splice(index, 1);
      }
    } else {
      // 处理其他状态码
      this.$message({
        type: 'error',
        message: '用户删除失败!'
      });
    }
  } catch (error) {
    // 处理网络错误或API错误
    console.error('用户删除失败:', error);
    this.$message({
      type: 'error',
      message: '用户删除失败!'
    });
  }
};
</script>

<style>
/* 全局样式 */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Arial', sans-serif;
}

/* 布局样式 */
.common-layout {
  background-color: #f0f2f5; /* 设置页面背景颜色 */
  height: 100%;
}

.el-container {
  flex-direction: column;
  height: 100%; /* 确保容器充满页面 */
}

/* 侧边栏样式 */
.el-aside {
  width: 100%; /* 设置侧边栏宽度为100%，充满页面 */
  background-color: #e7eaed; /* 设置侧边栏背景颜色 */
  color: white; /* 设置文字颜色 */
  transition: width 0.3s; /* 平滑过渡效果 */
  border-right: none; /* 移除菜单右侧边框 */
  padding: 20px; /* 增加内边距 */
}

/* 头部样式 */
.el-header {
  background-color: #f8f8f8;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px; /* 设置头部固定高度 */
  border-bottom: 1px solid #eaeaea; /* 添加底部边框 */
}

/* 主内容样式 */
.el-main {
  background-color: #fff; /* 设置主内容背景颜色 */
  color: #333;
  padding: 20px;
  overflow-y: auto; /* 当内容超出时显示滚动条 */
  height: 100%; /* 确保主内容充满页面 */
}

/* 底部样式 */
.el-footer {
  background-color: #f8f8f8;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; /* 设置底部固定高度 */
  border-top: 1px solid #eaeaea; /* 添加顶部边框 */
}

/* 用户数量显示样式 */
.user-count {
  margin-left: 10px;
}

/* 悬浮效果 */
.el-menu-vertical-demo .el-menu-item:hover,
.el-menu-vertical-demo .el-sub-menu__title:hover {
  outline: 0; /* 移除焦点时的轮廓线 */
  color: #409EFF; /* 设置悬停时的文字颜色 */
}

/* 激活状态样式 */
.el-menu-vertical-demo .el-menu-item.is-active {
  color: #409EFF; /* 设置激活状态下的文字颜色 */
  background-color: #263445 !important; /* 设置激活状态下的背景颜色 */
}

/* 响应式设计 */
@media (max-width: 1000px) {
  .el-aside {
    width: 60px; /* 小屏幕上侧边栏宽度 */
  }

  .el-header, .el-footer {
    height: 50px; /* 小屏幕上头部和底部的高度 */
  }

  .el-footer {
    height: 50px; /* 小屏幕上底部的高度 */
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
