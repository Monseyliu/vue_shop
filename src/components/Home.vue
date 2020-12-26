<template>
  <div class="mian">
    <el-container class="mian">
      <!-- 头部 -->
      <el-header class="home_header">
        <div class="home_log">
          <p>商城后台管理系统</p>
        </div>
        <el-button type="info" @click="logout" class="logout_btn"
          >退出</el-button
        >
      </el-header>
      <!-- 内容区 -->
      <el-container class="mian">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'" class="home_aside" >
            <!-- 侧边折叠按钮 -->
           
          <el-menu 
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
          >
           <div class="toggle_button" @click="toggleCollapse">| | |</div>
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!--二级菜单 -->
              <el-menu-item :index="'/'+ subItem.path" v-for="subItem in item.children"  :key="subItem.id">
                <!-- 二级菜单模板区域 -->
                <template slot="title">
                  <i class="el-icon-s-operation"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主显示区 -->
        <el-main class="home_main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [], //菜单栏对象
      iconsObj: { //左侧菜单栏字体图标列表
          '125':'el-icon-user-solid',
          '103':'el-icon-setting',
          '101':'el-icon-s-goods',
          '102':'el-icon-s-order',
          '145':'el-icon-s-data'
      },
      isCollapse: false, //是否折叠
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      //退出登录
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      //获取所有的菜单
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      console.log(this.menuList);
    },
    toggleCollapse(){
        //点击按钮切换菜单折叠与展开
        this.isCollapse = !this.isCollapse;
    }
  },
};
</script>

<style lang="less" scoped>
.home_header {
  //主页面头部
  width: 100%;
  height: 100%;
  background-color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .home_log {
    width: 50px;
    height: 50px;
    background: url(../assets/login_logo.png) no-repeat center;
    background-size: cover;
    line-height: 15px;
    p {
      display: inline-block;
      position: absolute;
      left: 80px;
      color: #fff;
      font-size: 18px;
    }
  }
  .logout_btn {
    height: 40px;
  }
}
// 主区域
.mian {
  background-color: #eaedf1;
  height: 100%;
}
// 侧边栏
.el-menu {
  border-right: none;
  height: 100%;
}
.toggle_button {
    background-color: #979fa5;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    user-select:none;
}
</style>