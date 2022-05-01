<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>假条管理</el-breadcrumb-item>
      <el-breadcrumb-item>写假条</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 查询用户的搜索框 -->
        <el-col :span="8">
          <el-input placeholder="根据假条创建时间搜索" v-model="queryInfo.query" clearable @clear="getLeaveFormList">
            <template #append>
              <el-button :icon="icon.Search" @click="getLeaveFormList" />
            </template>
          </el-input>
        </el-col>
        <!-- 添加用户的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">新建假条</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="leaveList" border stripe style="width: 100%">
        <el-table-column type="index" :index="setIndex"></el-table-column>
        <!-- 不显示请假表在数据库中的序号 -->
        <el-table-column label="序号" prop="sn" v-if="false"></el-table-column>
        <el-table-column label="请假开始时间" prop="start_time"></el-table-column>
        <el-table-column label="请假结束时间" prop="end_time"></el-table-column>
        <el-table-column label="请假原因" prop="reason"></el-table-column>
        <el-table-column label="去向" prop="place"></el-table-column>
        <el-table-column label="状态" prop="state" width="100"></el-table-column>
        <el-table-column label="审核人" prop="counselor_name" width="80"></el-table-column>
        <el-table-column label="创建时间" prop="createdTime"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template  #default="scope">
            <el-button type="primary" :icon="icon.Edit" @click="showEditDialog(scope.row.sn)"></el-button>
            <el-button type="danger" :icon="icon.Delete" @click="removeLeaveForm(scope.row.sn)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-model:current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]" v-model:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 新建假条的对话框 -->
    <el-dialog title="新建假条" v-model="addDialogVisible" width="35%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="开始时间" prop="start_time">
          <el-input placeholder="格式：YYYY-MM-DD" v-model="addForm.start_time"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-input placeholder="格式：YYYY-MM-DD" v-model="addForm.end_time"></el-input>
        </el-form-item>
        <el-form-item label="去向" prop="place">
          <el-input v-model="addForm.place"></el-input>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="addForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="审核人" prop="counselor_name">
          <el-input v-model="addForm.counselor_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addLeaveForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改假条的对话框 -->
    <el-dialog title="修改假条" v-model="editDialogVisible" width="35%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="开始时间" prop="start_time">
          <el-input placeholder="格式：YYYY-MM-DD" v-model="editForm.start_time"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-input placeholder="格式：YYYY-MM-DD" v-model="editForm.end_time"></el-input>
        </el-form-item>
        <el-form-item label="去向" prop="place">
          <el-input v-model="editForm.place"></el-input>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="editForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="审核人" prop="counselor_name">
          <el-input v-model="editForm.counselor_name"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-input v-model="editForm.createdTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editLeaveForm">确 定</el-button>
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
      // 获取假条列表的参数对象(查询的依据)
      queryInfo: {
        query: '',
        pagesize: 3, // 每页的数据条数(默认每页显示3条)
        pagenum: 1 // 页号(默认是第一页)
      },
      id: '', // 用户的id
      leaveList: [], // 假条列表数据
      total: 0, // 能获得的假条总数
      addDialogVisible: false, // 控制新建假条对话框的显示与隐藏
      // 新建假条的表单数据
      addForm: {
        start_time: '',
        end_time: '',
        reason: '',
        place: '',
        state: '0', // 默认未审批
        counselor_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        start_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
        end_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
        reason: [{ required: true, message: '不能为空', trigger: 'blur' }],
        place: [{ required: true, message: '不能为空', trigger: 'blur' }],
        counselor_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 查询到的用户信息对象
      editForm: { start_time: '', end_time: '', reason: '', place: '', state: '', counselor_id: '', counselor_name: '', createdTime: '' },
      // 修改表单的验证规则对象
      editFormRules: {
        start_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
        end_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
        reason: [{ required: true, message: '不能为空', trigger: 'blur' }],
        place: [{ required: true, message: '不能为空', trigger: 'blur' }],
        state: [{ required: true, message: '不能为空', trigger: 'blur' }],
        counselor_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editDialogVisible: false, // 控制编辑假条对话框的显示与隐藏
      icon: {
        Search: Search,
        Edit: Edit,
        Delete: Delete
      }
    }
  },
  created () {
    this.id = window.sessionStorage.getItem('id')
    this.getLeaveFormList()
  },
  methods: {
    // 根据个人id获取假条列表
    async getLeaveFormList () {
      try {
        const { data: res } = await this.$http.get('/lf/' + this.id, {
          params: this.queryInfo
        })
        this.total = res.total // total始终是数据库中的假条总量
        this.leaveList = res.data
      } catch (err) {
        return this.$message.error('获取假条失败！')
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getLeaveFormList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getLeaveFormList()
    },
    // 监听添加假条对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新假条
    addLeaveForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          await this.$http.post('/lf/' + this.id, this.addForm)
          this.$message.success('新建假条成功！')
          this.addDialogVisible = false // 隐藏对话框
          await this.getLeaveFormList() // 重新获取假条列表
        } catch (err) {
          return this.$message.error('新建假条失败！')
        }
      })
    },
    // 展示编辑假条的对话框
    async showEditDialog (sn) {
      try {
        const { data: res } = await this.$http.get('lf/' + sn)
        this.editForm = res.data
        this.editDialogVisible = true
      } catch (err) {
        return this.$message.error('查询假条信息失败！')
      }
    },
    // 监听编辑假条对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改假条信息并提交
    editLeaveForm () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        try {
          await this.$http.put('lf/' + this.editForm.sn, {
            start_time: this.editForm.start_time,
            end_time: this.editForm.end_time,
            reason: this.editForm.reason,
            place: this.editForm.place,
            counselor_name: this.editForm.counselor_name,
            counselor_id: this.editForm.counselor_id
          })
          this.$message.success('更新体假条成功！')
          this.editDialogVisible = false
          await this.getLeaveFormList()
        } catch (err) {
          return this.$message.error('更新假条失败！')
        }
      })
    },
    // 根据假条的序号sn删除假条
    async removeLeaveForm (sn) {
      const confirmResult = await this.$confirm('此操作将永久删除该假条, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除，则返回字符串confirm, 如果取消删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      try {
        await this.$http.delete('lf/' + sn)
        this.$message.success('删除假条成功！')
        await this.getLeaveFormList()
      } catch (err) {
        return this.$message.error('删除假条失败！')
      }
    },
    // 设置假条在表格中的序号
    setIndex (index) {
      return index + 1 + this.queryInfo.pagesize * (this.queryInfo.pagenum - 1)
    }
  }
}
</script>

<style scoped>
</style>
