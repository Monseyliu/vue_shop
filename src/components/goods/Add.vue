<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Form 表单区域和Tab 栏目区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择商品区域 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的动态参数item项目 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- checkBox 复选框组区域 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单的静态属性item项目 -->
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- upload 区域 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编译器组件 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入 loadsh 官方推荐 _ 接收
import _ from 'lodash'

export default {
  data() {
    return {
      // 步骤图默认激活项
      activeIndex: "0",
      //   添加商品的表单对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 上传图片临时路径数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        // 属性数组
        attrs: [],
      },
      //   添加商品表单验证对象
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //   所有商品分类数据
      catelist: [],
      //   级联选择器配置
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 动态参数列表数组
      manyTableData: [],
      //   静态属性数据列表
      onlyTableData: [],
      //   图片上传的URL
      uploadURL: "http://timemeetyou.com:8889/api/private/v1/upload",
      // 图片上传组件的 headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片预览路径
      previewPath: "",
      //   控制图片预览对话框显示
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //   获取所有商品分类参数
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.catelist = res.data;
      this.$message.success("获取商品分类成功！");
    },
    handleChange() {
      // 级联选择器选择项变化会触发的函数
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabClicked() {
      // Tab 标签页切换监听
      if (this.activeIndex === "1") {
        // 证明访问的是动态参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数失败");
        }
        // 赋值前将val值转换为数组，由字符串
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      } else if (this.activeIndex === "2") {
        //   访问的是商品静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败");
        }
        this.onlyTableData = res.data;
      }
    },
    handlePreview(file) {
      // 处理图片预览效果
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    handleRemove(file) {
      // 处理移除图片的操作
      // 1.获取将要删除的图片临时路径，2.从pics中找到这个图片对应的索引值
      // 3.调用 splice 方法，把图片信息从 pisc 中移除
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      this.addForm.pics.splice(i, 1);
    },
    handleSuccess(response) {
      // 监听图片上传成功的事件
      //1.拼接得到一个图片信息对象，2.将图片信息对象，push到pisc数组中
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    addGoods(){
        // 点击按钮添加商品, 获取表单验证结果，并发起添加请求
        this.$refs.addFormRef.validate(async valid => {
            if(!valid) {
                return this.$message.error("请填写必要的表单项目")
            }
            // 执行添加前进行数据处理，数组-字符串转换，字符串-数组转换
            // 深拷贝 addForm 到 cloneForm 解决和级联选择框数据类型冲突问题
            const cloneForm =  _.cloneDeep(this.addForm)
            cloneForm.goods_cat = cloneForm.goods_cat.join(',')
            // 处理静态属性和动态参数
            this.manyTableData.forEach(item => {
                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals.join(',')
                }
                this.addForm.attrs.push(newInfo)
            })
            this.onlyTableData.forEach(item => {
                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
            })
            cloneForm.attrs = this.addForm.attrs
            // 添加商品。商品名称必须是唯一的
            const {data: res} = await this.$http.post(`goods`, cloneForm)
            if(res.meta.status !== 201) {
                return this.$message.error("添加商品失败")
            }
            this.$message.success("添加商品成功")
            // 通过编程时导航跳转到商品列表页面
            this.$router.push('/goods')
        })

    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        // 判断是否是三级分类并返回供 tabClicked 使用
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scope>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
button.el-button.addBtn.el-button--primary {
    margin-top: 15px;
} 
</style>