<template>
    <div>
        <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 搜索添加商品区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input></el-input>
            </el-col>
            <el-col :span="8">
                <el-button type="primary">添加商品</el-button>
            </el-col>
        </el-row>
    </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
}
</script>

<style lang="less" scoped>
    
</style>