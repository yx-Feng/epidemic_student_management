<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>健康上报</el-breadcrumb-item>
      <el-breadcrumb-item>体温表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 查询体温表的搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请按照体温表的提交时间搜索" v-model="queryInfo.query" clearable @clear="getTemFormList">
            <el-button slot="append" icon="el-icon-search" @click="getTemFormList"></el-button>
          </el-input>
        </el-col>
        <!-- 新建体温表的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">新建体温表</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="temList" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="体温" prop="temperature"></el-table-column>
        <el-table-column label="是否发热" prop="fever"></el-table-column>
        <el-table-column label="辅导员" prop="counselor_name"></el-table-column>
        <el-table-column label="提交时间" prop="createdTime"></el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.createdTime)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeTemForm(scope.row.createdTime)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 新建体温表的对话框 -->
    <el-dialog title="新建体温表" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="体温" prop="temperature">
          <el-input placeholder="格式：保留一位小数" v-model="addForm.temperature"></el-input>
        </el-form-item>
        <el-form-item label="是否发热" prop="fever">
          <el-input placeholder="格式：填是/否" v-model="addForm.fever"></el-input>
        </el-form-item>
        <el-form-item label="辅导员" prop="counselor_name">
          <el-input v-model="addForm.counselor_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTemForm">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改体温表的对话框 -->
    <el-dialog title="修改体温表" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="体温" prop="temperature">
          <el-input placeholder="格式：保留一位小数" v-model="editForm.temperature"></el-input>
        </el-form-item>
        <el-form-item label="是否发热" prop="fever">
          <el-input placeholder="格式：填是/否" v-model="editForm.fever"></el-input>
        </el-form-item>
        <el-form-item label="辅导员" prop="counselor_name">
          <el-input v-model="editForm.counselor_name"></el-input>
        </el-form-item>
        <el-form-item label="提交时间" prop="createdTime">
          <el-input v-model="editForm.createdTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTemForm">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取体温表列表的参数对象(查询的依据)
      queryInfo: {
        query: '',
        // 每页的数据条数(默认每页显示3条)
        pagesize: 3,
        // 页号(默认是第一页)
        pagenum: 1
      },
      // 用户的id
      id: '',
      // 体温表列表
      temList: [],
      // 能获得的体温表总数
      total: 0,
      // 控制新建体温表对话框的显示与隐藏
      addDialogVisible: false,
      // 新建体温表的表单数据
      addForm: {
        temperature: '',
        fever: '',
        counselor_name: ''
      },
      // 添加体温表的验证规则对象
      addFormRules: {
        temperature: [{ required: true, message: '不能为空', trigger: 'blur' }],
        fever: [{ required: true, message: '不能为空', trigger: 'blur' }],
        counselor_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 查询到的体温表信息对象
      editForm: {
        temperature: '',
        fever: '',
        counselor_name: '',
        counselor_id: '',
        createdTime: ''
      },
      // 修改体温表的验证规则对象
      editFormRules: {
        temperature: [{ required: true, message: '不能为空', trigger: 'blur' }],
        fever: [{ required: true, message: '不能为空', trigger: 'blur' }],
        counselor_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 控制编辑体温表对话框的显示与隐藏
      editDialogVisible: false
    }
  },
  created () {
    this.id = window.sessionStorage.getItem('id')
    this.getTemFormList()
  },
  methods: {
    // 根据个人id和查询参数获取体温表列表
    async getTemFormList () {
      try {
        const { data: res } = await this.$http.get('/temforms/stu/' + this.id, {
          params: this.queryInfo
        })
        this.total = res.data[res.data.length - 1].length
        res.data.pop()
        this.temList = res.data
      } catch (err) {
        return this.$message.error('获取体温表失败！')
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getTemFormList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getTemFormList()
    },
    // 监听新建体温表对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新体温表
    addTemForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          await this.$http.post('/temforms/stu/' + this.id, this.addForm)
          this.$message.success('新建体温表成功！')
          this.addDialogVisible = false // 隐藏对话框
          await this.getTemFormList() // 重新获取用户列表数据
        } catch (err) {
          return this.$message.error('新建体温表失败！')
        }
      })
    },
    // 展示编辑体温表的对话框
    async showEditDialog (createdTime) {
      try {
        const { data: res } = await this.$http.get('temforms/stu/' + this.id + '/' + createdTime)
        this.editForm = res.data
        this.editDialogVisible = true
      } catch (err) {
        return this.$message.error('查询体温表信息失败！')
      }
    },
    // 监听编辑体温表对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改体温表信息并提交
    editTemForm () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        try {
          await this.$http.put('temforms/stu/' + this.id + '/' + this.editForm.createdTime, {
            counselor_name: this.editForm.counselor_name,
            counselor_id: this.editForm.counselor_id,
            temperature: this.editForm.temperature,
            fever: this.editForm.fever
          })
          this.$message.success('更新体温表成功！')
          this.editDialogVisible = false
          await this.getTemFormList()
        } catch (err) {
          return this.$message.error('更新体温表失败！')
        }
      })
    },
    // 根据用户Id和体温表的createdTime删除体温表
    async removeTemForm (createdTime) {
      const confirmResult = await this.$confirm('此操作将永久删除该体温表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回字符串confirm, 如果取消删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      try {
        await this.$http.delete('temforms/stu/' + this.id + '/' + createdTime)
        this.$message.success('删除假条成功！')
        await this.getTemFormList()
      } catch (err) {
        return this.$message.error('删除假条失败！')
      }
    }
  }
}
</script>

<style scoped>
</style>
