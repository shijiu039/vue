<template>
  <div class="common-layout">
    <el-container style="height: 100%;">
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu default-active="2-2" class="el-menu-vertical-demo">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <message />
                  <el-icon><User /></el-icon>
                </el-icon>用户管理
              </template>
              <el-menu-item index="1-1" @click="goToUserManagement">用户管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <icon-menu />
                  <el-icon><Edit /></el-icon>
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
            <el-input placeholder="请输入搜索内容" v-model="keyword_text" style="width: 200px; margin-right: 10px;">
            </el-input>
            <el-button type="primary" @click="searchTexts">搜索</el-button>
          </div>
          <div style="margin-left: 20px;">
            <el-icon>
              <Document />
            </el-icon>
            <span>当前文本数量：{{ textList.length }}</span>
            
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
          <el-table :data="textList" style="width: 100%" :default-sort="{ prop: 'uploadTime', order: 'ascending' }"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="text_id" label="ID" sortable width="180">            
            </el-table-column>
            <el-table-column prop="text_info" label="文本信息" sortable width="600">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-popconfirm title="你确定删除这条文本吗?" @confirm="Textdelete(scope.row)">
                  <template #reference>
                    <el-button size="small" type="danger">Delete</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
            <el-input v-model="textinput" style="width: 500px;" placeholder="上传文本">
              <template #prefix>
                <el-icon class="el-input__icon">
                  <search />
                </el-icon>
              </template>
            </el-input>
            <el-button size="small" type="primary" style="width :200;margin-right: 63%;margin-left: 30px;height: 50%;" @click="uploadTexts ">上传到服务器</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import {
    User,
    Document,
    Search,
    Edit,
    Upload
  } from '@element-plus/icons-vue';
  import {
    ref
  } from 'vue';
  import {
    useRouter
  } from 'vue-router';
  import { onMounted } from 'vue';
  import { ElMessage } from 'element-plus';


// 使用onMounted钩子，在组件挂载后调用
onMounted(() => {
  getTexts();
});
  var textList = ref([{
  
    },


    // 更多文本数据...
  ]);
  const keyword_text=ref('')
  const getTexts = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/administrator/textlist', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // 解析返回的JSON数据
    console.log('list get successfully:', data);
    // 如果需要根据后端响应做进一步处理
    if (data.code === 0) {
      textList.value = data.data; // 更新List
    } else {
      console.error('Failed to retrieve text list:', data);
    }
  } catch (error) {
    console.error('Error fetching text list:', error);
  }
};
  const textinput = ref('');

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

  const goToImageManagement = () => {
    router.push('/ImageM');
  };
  const OutLog=()=>{
    router.push('/ALogin')
  };
  const searchTexts=async()=> {
    console.log(keyword_text.value)
      try {
        // 构造请求体
        const body = new URLSearchParams({
          'input_text': keyword_text.value
        }).toString();
        // 发送请求到后端API
        const response = await fetch(`http://127.0.0.1:5000/administrator/TextSearch`, {
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
          textList.value = data; // 将解析后的JSON数据存储在userList中
        }
      } catch (error) {
        console.error('搜索失败:', error);
        ElMessage({
          type: 'error',
          message: '搜索失败!'
        });
      }
    }; 
  const Textdelete = async (row) => {
    try {
     // 构造请求体
     const body = new URLSearchParams({
        'text_id': row.text_id,
      }).toString();
      // 发送请求到后端API来删除用户
      const response = await fetch(`http://127.0.0.1:5000/administrator/deleteText`, {
        method: 'POST', // 指定请求方法
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
        },
        body:body
      });
      // 处理响应，例如更新文本列表
      if (response.status === 200) {
        const data = await response.json(); // 解析返回的JSON数据
        // 假设后端返回了删除成功的状态
       if(data.code===0){
        ElMessage({
          type: 'success',
          message: '文本删除成功!'
        });
       }
       else{
        ElMessage({
          type: 'error',
          message: '文本删除失败!'
        });
       }
        // 从前端列表中移除已删除的文本
        const index = textList.value.findIndex(text => text.text_id === parseInt(row.text_id));
        console.log('删除文本:', index);
        if (index !== -1) {
          textList.value.splice(index, 1);
        }
      } else {
        // 处理其他状态码
        ELMessage({
          type: 'error',
          message: '文本删除失败!'
        });
      }
    } catch (error) {
      // 处理网络错误或API错误
      console.error('删除文本失败:', error);
      ELMmessage({
        type: 'error',
        message: data.$message
      });
    }
  };

  const uploadTexts = async () => {
    try {
       // 构造请求体
    const body = new URLSearchParams({
      'text': textinput.value,
    }).toString();
      const response = await fetch(`http://127.0.0.1:5000/administrator/addtext`, {
      method: 'POST', // 指定请求方法
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
      },
      body: body
      });
      // 处理响应
      if (response.status === 200) {
        // 假设后端返回了上传成功的状态
        const data = await response.json(); // 解析返回的JSON数据
        // 假设后端返回了删除成功的状态
       if(data.code===0){
        ElMessage({
          type: 'success',
          message: '文本上传成功!'
        });
        const newText={
      text_id:'未更新',
      text_info:textinput.value
    }
    textList.value.push(newText)
       }
       if(data.code===-1){
        ElMessage({
          type: 'error',
          message: '请输入文本!'
        });
       }
  
    textinput.value=''
      } else {
        // 处理其他状态码
        ElMessage({
      type: 'error',
      message: '文本上传失败!'
    });
      }
    } catch (error) {
      // 处理网络错误或API错误
      console.error('上传文本失败:', error);
      ElMessage({
      type: 'error',
      message: '网络发生错误 文本上传失败!'
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
  }

  /* 布局样式 */
  .common-layout {
    background-color: #f0f2f5;
    /* 设置页面背景颜色 */
    height: 100%;
  }

  .el-container {
    flex-direction: column;
    height: 100%;
    /* 确保容器充满页面 */
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
    color: #409EFF;
    /* 设置激活状态下的文字颜色 */
    background-color: #6a9bd8 !important;
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