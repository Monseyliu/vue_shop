<template >
  <div class="container">
    <div class="login_box">
      <!-- 登录页面logo -->
      <div class="login_logo"></div>
      <!-- 登录框 -->
      <div class="login_form">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="form.username"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              prefix-icon="el-icon-lock"
              v-model="form.password"
              placeholder="密码"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 登录按钮 -->
      <div class="login_btn">
        <el-button type="primary">登录</el-button>
        <el-button type="info">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        //登录数据表单
        username: "",
        password: "",
      },
    };
  },
};
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: hidden;
  background: url(../assets/login_bg.jpg) no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
// 登录框
.login_box {
  position: relative;
  width: 500px;
  height: 300px;
  border-radius: 10px;
  background-color: #fff;
  opacity: 0.9;
}
// 登录logo
.login_logo {
  position: absolute;
  top: -50px;
left: 50%;
transform: translate(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: url(../assets/login_logo.png) no-repeat center center;
  background-size: cover;
  padding: 10px;
  box-shadow: 0 0 20ppx red;
  z-index: 10;
}
// 登录表格
.login_form {
  position: absolute;
  top: 100px;
  right: 0;
  width: 100%;
  margin-right: 20px;
  el-form {
    width: 100%;
  }
}
// 登录按钮
.login_btn {
  position: absolute;
  bottom: 35px;
  right: 0;
  margin-right: 20px;
}
</style>