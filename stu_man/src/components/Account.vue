<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
      <!-- 查询用户的搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请根据学号/工号搜索" v-model="queryInfo.query" clearable @clear="getAccountList">
            <el-button slot="append" icon="el-icon-search" @click="getAccountList"></el-button>
          </el-input>
        </el-col>
      <!-- 添加用户的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="accountList" border stripe style="width: 80%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="学号/工号" prop="id"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="身份(0-管理员，1-学生，2-辅导员)" prop="identity"></el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeAccountById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="学号/工号" prop="username">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio label="1" v-model="addForm.identity">学生</el-radio>
          <el-radio label="2" v-model="addForm.identity">辅导员</el-radio>
          <el-radio label="0" v-model="addForm.identity">管理员</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="学号/工号">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio label="1" v-model="editForm.identity">学生</el-radio>
          <el-radio label="2" v-model="editForm.identity">辅导员</el-radio>
          <el-radio label="0" v-model="editForm.identity">管理员</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象(查询的依据)
      queryInfo: {
        // 搜索框输入的内容
        query: '',
        // 每页的数据条数(默认每页显示3条)
        pagesize: 3,
        // 页号(默认是第一页)
        pagenum: 1
      },
      // 账号列表数据
      accountList: [],
      // 账号的总条数
      total: 0,
      // 添加用户的表单数据
      addForm: {
        id: '',
        password: '',
        identity: '1'
      },
      // 添加表单的验证规则对象
      addFormRules: {
        id: [
          { required: true, message: '请输入学号/工号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3~15个字符', trigger: 'blur' }
        ]
      },
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        id: '',
        password: '',
        identity: ''
      },
      // 修改表单的验证规则对象
      editFormRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '密码长度要求：3~15个字符', trigger: 'blur' }
        ]
      },
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false
    }
  },
  created () {
    this.getAccountList()
  },
  methods: {
    // 获取所有账号信息
    async getAccountList () {
      const { data: res } = await this.$http.get('/accounts', {
        params: this.queryInfo
      })
      if (res[res.length - 1].status !== '200') {
        return this.$message.error('获取账号列表失败！')
      }
      // 这里的total始终是所有能获取到的账号数量
      this.total = res[res.length - 1].length
      res.pop()
      this.accountList = res
    },
    // 监听pageSize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getAccountList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getAccountList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('/accounts', this.addForm)
        if (res[0].status === '403') {
          return this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        await this.getAccountList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('accounts/' + id)
      if (res[1].status !== '200') {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm.id = res[0].id
      this.editForm.password = res[0].password
      this.editForm.identity = res[0].identity
      this.editDialogVisible = true
    },
    // 监听编辑用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('accounts/' + this.editForm.id, {
          password: this.editForm.password,
          identity: this.editForm.identity
        })
        if (res[0].status !== '201') {
          return this.$message.error('更新账号失败！')
        }
        this.$message.success('更新账号成功！')
        this.editDialogVisible = false
        await this.getAccountList()
      })
    },
    // 根据Id删除对应账号信息
    async removeAccountById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串confirm
      // 如果用户取消删除，则返回值为字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('accounts/' + id)
      if (res[0].status !== '204') {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      await this.getAccountList()
    }
  }
}
</script>

<style scoped>
</style>
