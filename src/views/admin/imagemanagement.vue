<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏代码保持不变 -->
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
          <!-- 搜索栏 -->
          <div style="display: flex; align-items: center;">
            <el-input placeholder="请输入搜索内容" v-model="searchImageText" style="width: 200px; margin-right: 10px;">
            </el-input>
            <el-button type="primary" @click="searchImages">搜索</el-button>
          </div>
          <div style="display: flex; align-items: center; margin-right: 10px;">
            <el-icon style="margin-right: 10px;">
              <Picture />
            </el-icon>
            <span>图片数量：{{ imageCount }}</span>
          </div>
        </el-header>
        <el-main>
          <!-- 图片列表 -->
          <el-table :data="imageList" style="width: 100%" :default-sort="{ prop: 'uploadTime', order: 'ascending' }"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="序号" sortable width="180">
            </el-table-column>
            <el-table-column prop="info" label="图片信息" sortable width="180">
            </el-table-column>
            <el-table-column prop="uploadTime" label="上传时间" sortable width="240">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" type="danger" @click="deleteImage(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-upload action="/administrator/image-upload" :on-preview="handlePreview" :on-remove="handleRemove"
            :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="ImageUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {
    User,
    Picture,
    Document
  } from '@element-plus/icons-vue';

  export default {
    components: {
      User, // 注册用户图标组件
      Picture, // 注册图片图标组件
      Document // 注册文档图标组件
    },
    data() {
      return {
        // 示例用户数据
        userList: [{
            name: '张三',
            email: 'zhangsan@example.com',
          },
          {
            name: '李四',
            email: 'lisi@example.com',
          },
          // 更多用户数据...
        ],
        // 用户数量
        userCount: 100,
        // 数据库图片数量
        imageCount: 1000,
        // 数据库文本数量
        textCount: 2000
      };
    },
    methods: {
      // 菜单打开和关闭事件处理
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      goToTextManagement() {
        // 使用 this.$router.push() 方法导航到新的路由
        this.$router.push('/TextM');
      },
      goToUserManagement() {
        // 使用 this.$router.push() 方法导航到新的路由
        this.$router.push('/UserM');
      },
      goToImageManagement() {
        // 使用 this.$router.push() 方法导航到新的路由
        this.$router.push('/ImageM');
      },
      async deleteImage(row) {
        // 删除图片的逻辑
        console.log('删除图片:', row.id);
        try {
          // 调用后端API来删除图片
          const response = await this.$http.delete(`/api/images/${row.id}`);
          // 处理响应，例如更新图片列表
          if (response.status === 200) {
            // 假设后端返回了删除成功的状态
            this.$message({
              type: 'success',
              message: '图片删除成功!'
            });
            // 从前端列表中移除已删除的图片
            const index = this.imageList.findIndex(image => image.id === row.id);
            if (index !== -1) {
              this.imageList.splice(index, 1);
            }
          } else {
            // 处理其他状态码
            this.$message({
              type: 'error',
              message: '图片删除失败!'
            });
          }
        } catch (error) {
          // 处理网络错误或API错误
          console.error('删除图片失败:', error);
          this.$message({
            type: 'error',
            message: '图片删除失败!'
          });
        }
      },
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
    font-family: 'Arial', sans-serif;
    background-color: #f0f2f5;
    /* 设置页面背景颜色 */
  }

  /* 布局样式 */
  .common-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* 侧边栏样式 */
  .el-aside {
    width: 200px;
    /* 默认侧边栏宽度 */
    background-color: #064fa8;
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
    flex-grow: 1;
    /* 使主内容区域充满剩余空间 */
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
    color: #409EFF;
    /* 设置激活状态下的文字颜色 */
    background-color: #263445 !important;
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