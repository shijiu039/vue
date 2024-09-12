<template>
  <view class="container">
    <view class="title">
      <text>关于我们</text>
    </view>
    <view class="content">
      <view class="section team-intro">
        <view class="section-title">
			<image src="../../static/logo.png"></image>
          <text>团队介绍</text>
        </view>
        <view class="section-content">
          <text>
            我们是一支充满激情和创新的团队，致力于开发前沿的跨模态检索技术。我们的团队成员拥有丰富的科研和工程经验，在图像处理、自然语言处理和数据挖掘等领域有着深入的研究。
          </text>
        </view>
      </view>
      <view class="section product-intro">
        <view class="section-title">
          <text>产品介绍</text>
        </view>
        <view class="section-content">
          <text>
            “跨模态图像文本检索系统”是一个先进的检索平台，它能够理解图像和文本数据，实现两种模态之间的有效匹配。该系统利用深度学习技术，通过复杂的算法模型，允许用户通过文本查询图像，或者通过图像查询相关文本，大大提高了信息检索的效率和准确性。
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 如果在此页面中有逻辑处理需要JavaScript支持，可以在这里编写
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.section-content {
  font-size: 16px;
  line-height: 1.5;
}
</style>
