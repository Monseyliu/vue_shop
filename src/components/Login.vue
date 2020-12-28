<template>
  <div class="wrap">
    <!-- 改进版登录页面 -->
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 登录logo -->
      <div class="login_log"></div>
      <!-- 登录表单区域 -->
      <div class="logo_form">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          label-width="0px"
          :rules="loginFormRules"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              prefix-icon="el-icon-user-solid"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <!-- 提交按钮 -->
          <el-form-item class="login_btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetloginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        //登录表单数据
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        //登录表单验证规则
        username: [
          //用户名
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          //密码
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
      resetloginForm(){ //点击重置表单
        this.$refs.loginFormRef.resetFields();
      },
      login(){ //登录请求
        this.$refs.loginFormRef.validate((async valid => {
            if(!valid) return;
            const {data: res} = await this.$http.post('login', this.loginForm);
            if(res.meta.status !== 200) return this.$message.error("登录失败");
            this.$message.success("登录成功");
            // 保存token
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push('/home');
        }))
      }
  },
};
</script>

<style lang="less" scoped>
.wrap {
  height: 100%;
  width: 100%;
  background: url(../assets/login_bg.jpg) no-repeat;
  background-size: cover;
}
.login_box {
  position: absolute;
  width: 500px;
  height: 300px;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
  .login_log {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: url(../assets/login_logo.png) no-repeat center;
    background-size: cover;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  // 表单区域
  .logo_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    .login_btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>