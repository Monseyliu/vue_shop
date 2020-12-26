<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="usersData" style="width: 100%" border stripe>
        <!-- 索引 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                icon="el-icon-setting"
                type="warning"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 12, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框表单验证区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%"
    @close="editDialogClosed">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 删除用户对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱自定义校验规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      if (regEmail.test(value)) return callback();
      callback(new Error("请输入合法的邮箱"));
    };
    // 手机自定义校验规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
      if (regMobile.test(value)) return callback();
      callback(new Error("请输入合法的手机"));
    };
    return {
      usersData: [], //用户数据
      total: 0,
      queryInfo: {
        //查询参数
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      flag: true, //控制状态
      addDialogVisible: false, //控制添加用户对话框显示
      addForm: {
        //添加用户的表单数据
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        //添加用户表单的验证规则对象
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6到 15 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editDialogVisible: false, //控制修改对话框的显示
      editForm: {}, //查询用户的信息
      editFormRules: {
        //修改用户信息验证对象
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUsersData();
  },
  methods: {
    async getUsersData() {
      //获取用户数据
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户数据失败");
      this.$message.success("获取用户数据成功！");
      this.usersData = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      //监听 pagesize 变化的事件
      this.queryInfo.pagesize = newSize;
      // 数据更新重新调用数据
      this.getUsersData();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      // 数据更新重新获取数据
      this.getUsersData();
    },
    async userStateChanged(userinfor) {
      //状态修改保存
      const { data: res } = await this.$http.put(
        `users/${userinfor.id}/state/${userinfor.mg_state}`
      );
      if (res.meta.status !== 200) {
        // 更改失败取反，变回
        userinfor.mg_state = !userinfor.mg_state;
        return this.$message.error("更改状态失败");
      }
      this.$message.success("更新状态成功");
    },
    addDialogClosed() {
      //监听添加用户对话框的关闭事件
      // 重置表单
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      //提交添加用户
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getUsersData();
      });
    },
    async showEditDialog(id) {
      //展示编辑用户的对话框
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("查询用户信息失败！");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed(){ //监听修改对话框的关闭事件
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo(){ //修改用户提交的信息
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const {data: res}  = await this.$http.put('users/' +this.editForm.id, {email: this.editForm.email, mobile: this.editForm.mobile})
        if(res.meta.status !== 200 ) return this.$message.error(res.meta.msg)
        this.editDialogVisible = false
        this.getUsersData()
        this.$message.success("更新用户成功")
      })
    },
    async removeUserById(id){
      // 根据ID删除对应的用户信息, 先弹框询问是否删除
      const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmResult !== 'confirm') return this.$message.error("已取消删除")
      // 调用接口删除用户数据，并刷新
      const {data: res} = await this.$http.delete('users/' + id)
      if(res.meta.status !== 200 ) this.$message.error(res.meta.msg)
      this.getUsersData();
      this.$message.success("删除用户成功！")
    }
  },
};
</script>

<style lang="less" scoped>
</style>

