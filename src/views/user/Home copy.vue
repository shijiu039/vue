<template>
  <el-container>
    <el-header style="color:azure;font-size: 40px;">跨模态图文检索系统</el-header>
    <el-container>
      <el-aside style="color:azure;font-size: 40px;align-items: center;" width="200px">会话</el-aside>
      <el-main class="scrollable-main">
        <div style="background-color: orange;">
         <div style="border: red solid 2px ;width: 100%;overflow-y: scroll;">
          <div v-for="index in 100">{{index}}</div>
         </div>
        </div>
        <div class="input-and-button">
          <el-input v-model="input" style="width: 720px" id="input" placeholder="Please input"></el-input>
          <el-button type="primary" style="width: 300px" @click="login">search</el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';

const input = ref('');

const login = () => {
  console.log(input.value);
};
</script>

<style scoped>

.scrollable-main {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: calc(100% - 240px); /* 占满容器高度减去头部和侧边栏的高度 */
 /* padding-bottom: 50px; /* 在底部添加50px的内边距 */
  overflow-y: auto; 
}
.el-main {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: calc(100vh); /* 占满视口高度减去头部和侧边栏的高度 */
  padding-bottom: 50px; /* 在底部添加50px的内边距 */
}
.el-header {
  background-color: #0e00cfe8; /* 蓝色 */
}

.el-aside {
  background-color: #87CEEB; /* 浅蓝色 */
}
.input-and-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100% - 300px);
  gap: 25px;
}

/*.other-content {

}*/
</style>