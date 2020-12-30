<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 角色添加按钮 -->
      <el-row
        ><el-button type="primary" @click="showAddRoleDialog"
          >添加角色</el-button
        ></el-row
      >
      <!-- 角色table表格区域 -->
      <el-table :data="rolesData" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循序嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <!-- 操作作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 权限树形结构 -->
      <el-tree
        :data="rightsData"
        :props="treeProps"
        show-checkbox
        ref="treeRef"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <!-- 底部操作 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 提交表单区域 -->
      <el-form
        ref="addRoleInfoRef"
        :model="addRoleInfo"
        label-width="80px"
        :rules="addRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleInfo.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleInfo.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subjoinRole" >确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <!-- 提交表单区域 -->
      <el-form
        ref="editRoleInfoRef"
        :model="addRoleInfo"
        label-width="80px"
        :rules="addRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleInfo.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleInfo.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogById" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesData: [], //角色数据列表
      SetRightDialogVisible: false, //分配权限对话框显示
      rightsData: [], //权限数据列表
      treeProps: {
        //树形控件的属性绑定对象
        children: "children",
        label: "authName",
      },
      defKeys: [], //默认选中的ID值数组
      roleId: "", //当前即将分配权限的ID
      addRoleDialogVisible: false, //控制添加橘色对话框
      addRoleInfo: {
        //添加角色表单
        roleName: "",
        roleDesc: "",
      },
      addRolesRules: {
        //添加角色验证对象
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: false, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      editRoleDialogVisible: false, //编辑和分配角色对话框公用title
      editID: '', //需要编辑的ID
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    async getRolesData() {
      //   获取角色数据
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesData = res.data;
      console.log(this.rolesData);
      this.$message.success("获取角色数据成功！");
    },
    async removeRightById(roleList, rightID) {
      // 根据ID删除对应的权限，弹框提示用户是否确定删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消了删除");
      // 确认删除发起 delete 请求删除权限
      const { data: res } = await this.$http.delete(
        `roles/${roleList.id}/rights/${rightID}`
      );
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("权限删除成功！");
      // 直接赋值避免重新刷新页面
      roleList.children = res.data;
    },
    async showSetRightDialog(role) {
      // 将id保存到数据中
      this.roleId = role.id;
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightsData = res.data;
      // 递归获取当前节点ID
      this.getLeafKeys(role, this.defKeys);
      // 控制分配权限对话框展示
      this.SetRightDialogVisible = true;
    },
    getLeafKeys(node, arr) {
      // 如果不包含children则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    setRightDialogClosed() {
      // 监听对话框关闭事件,清空defKeys 数组
      this.defKeys = [];
    },
    async allotRights() {
      // 点击分配权限
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配失败");
      }
      this.$message.success("权限分配成功");
      this.getRolesData();
      this.SetRightDialogVisible = false;
    },
    showAddRoleDialog() {
      // 控制添加角色对话框显示
      this.DialogTitle = "添加角色";
      this.addRoleDialogVisible = true;
    },
    subjoinRole() {
      // 验证添加表格是否符合要求，符合则发起http请求添加
      this.$refs.addRoleInfoRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `roles`,
            this.addRoleInfo
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加角色失败！");
          }
          this.$message.success("添加角色成功");
          this.addRoleDialogVisible = false;
          this.getRolesData();
        }
      });
    },
    addRoleDialogClosed() {
      // 监听添加角色对话框关闭事件
      this.$refs.addRoleInfoRef.resetFields();
      this.editID = ''
    },
    editRoleDialogClosed(){
      this.$refs.editRoleInfoRef.resetFields();
    },
    async editDialogById(){
      // 编辑成功触发
      const {data: res} = await this.$http.put(`roles/`+ this.editID, this.addRoleInfo)
      if(res.meta.status !==200) {
        return this.$message.error("编辑失败")
      }
      this.$message.success("编辑成功")
      this.getRolesData()
      this.editRoleDialogVisible = false
    },
    async showEditDialog(id) {
      // 控制编辑对话框显示
      // 获取数据赋值
      const { data: res } = await this.$http.get(`roles/` + id, {params: this.addRoleInfo});
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editID = id
      this.addRoleInfo = res.data;
      this.editRoleDialogVisible = true;
    },
    async deleteRoleById(id) {
      const deleteResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (deleteResult !== "confirm") {
        return this.$message.info("取消了操作");
      }
      const { data: res } = await this.$http.delete(`roles/` + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesData();
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>