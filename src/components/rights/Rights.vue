<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightData" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column prop="level" label="权限等级" >
          <!-- 权限等级作用域插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1">二级权限</el-tag>
            <el-tag type="warning" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightData: [], //权限数据列表
    };
  },
  created() {
    this.getRightData();
  },
  methods: {
    async getRightData() {
      //   获取权限列表数据
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightData = res.data;
      this.$message.success("获取权限列表成功");
    },
  },
};
</script>

<style lang="less" scoped>
</style>