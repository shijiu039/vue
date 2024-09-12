<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏代码保持不变 -->
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu default-active="2-1" class="el-menu-vertical-demo">
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
          <!-- 搜索栏 -->
          <div style="display: flex; align-items: center;">
            <el-input placeholder="请输入图片id" v-model="keyword_image" style="width: 200px; margin-right: 10px;">
            </el-input>
            <el-button @click="searchImages">搜索</el-button>          </div>
          <div style="display: flex; align-items: center; margin-right: 10px;">
            <el-icon style="margin-right: 10px;">
              <Picture />
            </el-icon>
            <span>图片数量：{{ imageList.length }}</span>
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
          <!-- 图片列表 -->
          <el-table :data="imageList" style="width: 100%" :default-sort="{ prop: 'uploadTime', order: 'ascending' }"
            @selection-change="handleSelectionChange" ref="tableRef">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="image_id" label="序号" sortable width="180">
            </el-table-column>
            <el-table-column label="图片">
              <template #default="{ row }">
                <el-image :src="row.image_info" style="width: 400px; height: auto;"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="image_info" label="图片信息" sortable width="600" v-if="false">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
            
                <el-popconfirm title="你确定删除这张图片吗?" @confirm="deleteImage(scope.row)">
                  <template #reference>
                    <el-button size="small" type="danger" style="height: 50%;">删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <label for="file-input" class="upload-button">Upload Image</label>
          <input type="file" id="file-input" accept="image/*" @change="uploadImage" style="display: none;" />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import {
    ref
  } from 'vue';
  import {
    useRouter
  } from 'vue-router';
  import {
    User,
    Picture,
    Edit,
    Upload
  } from '@element-plus/icons-vue';
  import {
    onMounted
  } from 'vue';


  // 使用onMounted钩子，在组件挂载后调用
  onMounted(() => {
    getImage();
  });
 
  // 路由器实例
  const router = useRouter();
  const keyword_image = ref('')
  const fileList = ref([])
  var imageList = ref([

]);
  import { ElMessage } from 'element-plus';

  // 定义方法
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

  const goToImageManagement = () => {
    router.push('/ImageM');
  };
  const OutLog=()=>{
    router.push('/ALogin')
  };
  const deleteImage = async (row) => {
    console.log('删除图片:', row.id);
    const body = new URLSearchParams({
        'image_id': row.image_id,
      }).toString();
    try {
      // 发送请求到后端API
      const response = await fetch(`http://127.0.0.1:5000/administrator/deleteImage`, {
        method: 'POST', // 指定请求方法
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
        },
        body: body
      });
      if (response.status === 200) {
        // 假设后端返回了删除成功的状态
        ElMessage({
          type: 'success',
          message: '图片删除成功!'
          });
        // 从前端列表中移除已删除的图片
        const index = imageList.value.findIndex(imag => imag.image_id === parseInt(row.image_id));
        console.log(index)
        if (index !== -1) {
          imageList.value.splice(index, 1);
        }
      } else {
        // 处理其他状态码
      ElMessage({
          type: 'error',
          message: '图片删除失败!'
        });
      }
    } catch (error) {
      // 处理网络错误或API错误
      console.error('删除图片失败:', error);
      ElMessage({
        type: 'error',
        message: '网络发生错误 图片删除失败!'
      });
    }
  };
  const getImage = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/administrator/imagelist', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // 解析返回的JSON数据
      console.log('list get successfully:', data);
      // 如果需要根据后端响应做进一步处理
      if (data.code === 0) {
        imageList.value = data.data; // 更新imageList
      } else {
        console.error('Failed to retrieve image list:', data);
      }
    } catch (error) {
      console.error('Error fetching image list:', error);
    }
  };
 
const uploadImage = async(event) => {
  // 获取选中的文件列表
  const files = event.target.files;

  // 将所有选中的文件添加到 fileList 中
  for (let i = 0; i < files.length; i++) {
    fileList.value.push(files[i]);
  }
    // 创建 FormData 对象
    const formData = new FormData();

    // 遍历文件列表，将文件添加到 FormData 中
    for (const file of fileList.value) {
      formData.append('image', file);
      console.log(file)
    }
    // 发送 POST 请求
    const response = await fetch('http://127.0.0.1:5000/administrator/addimage', {
      method: 'POST',
      body: formData
    });
    // 处理响应
    if (response.status === 200) {
      ElMessage({
        type: 'success',
        message: '图像上传成功!'
      });
    } else {
      ElMessage({
        type: 'error',
        message: '图像上传失败!'
      });
    }
  
};
const searchImages=async()=> {
      try {
        // 构造请求体
        const body = new URLSearchParams({
          'input_image': keyword_image.value
        }).toString();
        // 发送请求到后端API
        const response = await fetch(`http://127.0.0.1:5000/administrator/ImageSearch`, {
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
          console.log('get list successfully',data)
          imageList.value = data.data; // 将解析后的JSON数据存储在userList中
          console.log('upgrade successfully',imageList.value)

        }
      } catch (error) {
        console.error('搜索失败:', error);
        ElMessage({
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
    background-color: #6ca5eb !important;
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