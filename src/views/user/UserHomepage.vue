<template>
    <header class="header">
        <div class="header-title">
            个人主页
        </div>
        <div class="header-user">
            <router-link to="/Home" class="user-link">back</router-link>
        </div>
    </header>
</template>

<script>
// 如果需要，可以在这里添加任何相关的脚本逻辑
</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #1f1e33;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}

.header-title {
  padding-left: 20px;
}

.header-user {
  padding-right: 20px;
}

.user-link {
  color: white;
  text-decoration: none;
  cursor: pointer;
}
</style>