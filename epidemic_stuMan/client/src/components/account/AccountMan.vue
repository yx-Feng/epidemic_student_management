<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
      <!-- 查询账号的搜索框 -->
        <el-col :span="8">
          <el-input placeholder="根据学号/工号搜索" v-model="queryInfo.query" clearable @clear="getAccountList">
            <template #append>
              <el-button :icon="icon.Search" @click="getAccountList"/>
            </template>
          </el-input>
        </el-col>
      <!-- 添加账号的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加账号</el-button>
        </el-col>
      </el-row>
      <!-- 账号列表区域 -->
      <el-table :data="accountList" border stripe style="width: 80%">
        <el-table-column type="index" :index="setIndex"></el-table-column>
        <el-table-column label="学号/工号" prop="id"></el-table-column>
        <el-table-column label="密码" prop="pwd"></el-table-column>
        <el-table-column label="身份(0-管理员，1-学生，2-辅导员)" prop="identity"></el-table-column>
        <el-table-column label="操作" width="160px">
          <template #default="scope">
            <el-button type="primary" :icon="icon.Edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" :icon="icon.Delete" @click="removeAccountById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-model:current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]" v-model:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加账号的对话框 -->
    <el-dialog title="添加账号" v-model="addDialogVisible" width="35%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="学号/工号" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="addForm.pwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio label="1" v-model="addForm.identity">学生</el-radio>
          <el-radio label="2" v-model="addForm.identity">辅导员</el-radio>
          <el-radio label="0" v-model="addForm.identity">管理员</el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改账号的对话框 -->
    <el-dialog title="修改账号"  v-model="editDialogVisible" width="35%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="学号/工号">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="editForm.pwd"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Edit, Delete } from '@element-plus/icons-vue'
export default {
  data () {
    return {
      // 获取账号列表的参数对象
      queryInfo: {
        query: '', // 搜索框输入的内容
        pagesize: 5, // 每页的数据条数(默认每页显示5条)
        pagenum: 1 // 页号(默认是第一页)
      },
      accountList: [], // 账号列表数据
      total: 0, // 账号的总数
      addForm: { id: '', pwd: '', identity: '1' }, // 添加账号的表单对象
      // 添加账号表单的验证规则对象
      addFormRules: {
        id: [{ required: true, message: '请输入学号/工号', trigger: 'blur' }],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3~15个字符', trigger: 'blur' }
        ]
      },
      addDialogVisible: false, // 控制添加账号对话框的显示与隐藏
      editForm: { id: '', pwd: '' }, // 查询到的账号信息对象
      // 修改账号表单的验证规则对象
      editFormRules: {
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '密码长度要求：3~15个字符', trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 控制编辑账号对话框的显示与隐藏
      icon: {
        Search: Search,
        Edit: Edit,
        Delete: Delete
      }
    }
  },
  created () {
    this.getAccountList()
  },
  methods: {
    // 根据queryInfo获取所有账号
    async getAccountList () {
      try {
        const { data: res } = await this.$http.get('/accounts', {
          params: this.queryInfo
        })
        this.total = res.total // total表示数据库中的账号总数
        this.accountList = res.data
      } catch (err) {
        return this.$message.error('获取账号列表失败！')
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getAccountList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getAccountList()
    },
    // 监听添加账号对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新账号
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          await this.$http.post('/account', this.addForm)
          this.$message.success('添加用户成功！')
          this.addDialogVisible = false // 隐藏对话框
          await this.getAccountList() // 重新获取用户列表
        } catch (err) {
          return this.$message.error('添加用户失败！')
        }
      })
    },
    // 展示编辑账号的对话框
    async showEditDialog (id) {
      try {
        const { data: res } = await this.$http.get('account/' + id)
        this.editForm.id = res.data.id
        this.editForm.pwd = res.data.pwd
        this.editDialogVisible = true
      } catch (err) {
        return this.$message.error('查询账号信息失败！')
      }
    },
    // 监听编辑账号对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改账号信息并提交
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        try {
          await this.$http.put('account/' + this.editForm.id, {
            pwd: this.editForm.pwd
          })
          this.$message.success('更新账号成功！')
          this.editDialogVisible = false
          await this.getAccountList()
        } catch (err) {
          return this.$message.error('更新账号失败！')
        }
      })
    },
    // 根据Id删除对应账号信息
    async removeAccountById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 确认删除，返回字符串confirm，取消删除，返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      try {
        await this.$http.delete('account/' + id)
        this.$message.success('删除账号成功！')
        await this.getAccountList()
      } catch (err) {
        return this.$message.error('删除账号失败！')
      }
    },
    // 设置每一条账号数据在表格中的序号
    setIndex (index) {
      return index + 1 + this.queryInfo.pagesize * (this.queryInfo.pagenum - 1)
    }
  }
}
</script>

<style scoped>
</style>
