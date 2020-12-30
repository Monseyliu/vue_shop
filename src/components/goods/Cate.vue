<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类table表格区域 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 是否有效模板 -->
        <template slot="isOk" slot-scope="scope">
          <i
            style="color: lightgreen"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color: red" class="el-icon-error" v-else></i>
        </template>
        <!-- 等级排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="deleteCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 父级分类级联选择框 -->
          <el-cascader
            class="cascaderSelecet"
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="编辑分类" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        //查询参数
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catelist: [
        //商品分类
      ],
      total: 0, //数据总条数
      columns: [
        //为自定义table指定列的定义
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template", //库存是否有效的模板
          template: "isOk",
        },
        {
          label: "排序",
          type: "template", //等级排序的模板
          template: "order",
        },
        {
          label: "操作",
          type: "template", //操作的模板
          template: "opt",
        },
      ],
      addCateDialogVisible: false, //控制添加分类对话框显示
      addCateForm: {
        //添加分类的表单对象
        cat_name: "",
        cat_pid: 0, //父级分类ID
        cat_level: 0, //分类等级一级分类
      },
      editCateForm: {
        //   编辑分类表单对象
        cat_name: "",
        cat_id: 0,
      },
      addCateFormRules: {
        //添加分类表单验证
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [], //父级分类的数据列表
      cascaderProps: {
        //指定级联选择器的配置对象
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [], //选中的父级分类的ID数组
      editCateDialogVisible: false, //控制编辑分类对话框显示
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //   获取商品分类数据
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      // 赋值
      this.catelist = res.data.result;
      this.total = res.data.total;
      console.log(res.data.result);
    },
    handleSizeChange(newSize) {
      // 监听pagesize改变的
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      // 监听pagenum 的改变
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      // 控制对话框显示
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      // 获取父级分类的列表
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级数据失败");
      }
      console.log(res.data);
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      // 级联选择框发生变化触发
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      // 点击按钮，添加新的分类，先进行预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      // 监听对话框的关闭事件，重置表单
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    showEditCateDialog(cateInfo) {
      // 控制编辑分类对话框显示, 获取分类名称并显示
      this.editCateForm.cat_name = cateInfo.cat_name;
      this.editCateForm.cat_id = cateInfo.cat_id;
      this.editCateDialogVisible = true;
    },
    editCate() {
      // 通过验证后提交编辑分类请求，
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id, this.editCateForm
        )
        if(res.meta.status !==200) return this.$message.error("编辑分类失败")
        this.$message.success("编辑分类成功")
        this.getCateList()
        this.editCateDialogVisible = false
      });
    },
    async deleteCateById(id){
        // 通过ID删除当前分类
       const delResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err => err)
        if(delResult !== 'confirm') return this.$message.info("取消了删除")
        const {data: res} = await this.$http.delete('categories/'+ id)
        if(res.meta.status !== 200) return this.$message.error("删除失败")
        this.$message.success("删除成功")
        this.getCateList()
    }
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin: 15px 0;
}
.cascaderSelecet {
  width: 100%;
}
</style>