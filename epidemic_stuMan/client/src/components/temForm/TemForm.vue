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
      <el-row :gutter="20">
        <!-- 查询体温表的搜索框 -->
        <el-col :span="8">
          <el-input placeholder="按照体温表的提交时间搜索" v-model="queryInfo.query" clearable @clear="getTemFormList">
            <template #append>
              <el-button :icon="icon.Search" @click="getTemFormList"/>
            </template>
          </el-input>
        </el-col>
        <!-- 新建体温表的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">新建体温表</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="temList" border stripe style="width: 100%">
        <el-table-column type="index" :index="setIndex"></el-table-column>
        <!-- 不显示体温表在数据库中的序号 -->
        <el-table-column label="序号" prop="sn" v-if="false"></el-table-column>
        <el-table-column label="体温" prop="temperature"></el-table-column>
        <el-table-column label="是否发热" prop="fever"></el-table-column>
        <el-table-column label="辅导员" prop="counselor_name"></el-table-column>
        <el-table-column label="提交时间" prop="createdTime"></el-table-column>
        <el-table-column label="操作" width="160px">
          <template #default="scope">
            <el-button type="primary" :icon="icon.Edit" @click="showEditDialog(scope.row.sn)" />
            <el-button type="danger" :icon="icon.Delete" @click="removeTemForm(scope.row.sn)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-model:current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]" v-model:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 新建体温表的对话框 -->
    <el-dialog title="新建体温表" v-model="addDialogVisible" width="35%" @close="addDialogClosed">
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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTemForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改体温表的对话框 -->
    <el-dialog title="修改体温表" v-model="editDialogVisible" width="35%" @close="editDialogClosed">
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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editTemForm">确 定</el-button>
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
      // 获取体温表列表的参数对象(查询的依据)
      queryInfo: {
        query: '',
        pagesize: 3, // 每页的数据条数(默认每页显示3条)
        pagenum: 1 // 页号(默认是第一页)
      },
      id: '', // 用户的id
      temList: [], // 体温表列表
      total: 0, // 能获得的体温表总数
      addDialogVisible: false, // 控制新建体温表对话框的显示与隐藏
      // 新建体温表的表单数据
      addForm: { temperature: '', fever: '', counselor_name: '' },
      // 添加体温表的验证规则对象
      addFormRules: {
        temperature: [{ required: true, message: '不能为空', trigger: 'blur' }],
        fever: [{ required: true, message: '不能为空', trigger: 'blur' }],
        counselor_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 查询到的体温表信息对象
      editForm: { temperature: '', fever: '', counselor_name: '', counselor_id: '', createdTime: '', sn: '' },
      // 修改体温表的验证规则对象
      editFormRules: {
        temperature: [{ required: true, message: '不能为空', trigger: 'blur' }],
        fever: [{ required: true, message: '不能为空', trigger: 'blur' }],
        counselor_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editDialogVisible: false, // 控制编辑体温表对话框的显示与隐藏
      icon: {
        Search: Search,
        Edit: Edit,
        Delete: Delete
      }
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
        const { data: res } = await this.$http.get('/tf/stu/' + this.id, {
          params: this.queryInfo
        })
        this.total = res.total
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
          await this.$http.post('/tf/stu/' + this.id, this.addForm)
          this.$message.success('新建体温表成功！')
          this.addDialogVisible = false // 隐藏对话框
          await this.getTemFormList() // 重新获取用户列表数据
        } catch (err) {
          return this.$message.error('新建体温表失败！')
        }
      })
    },
    // 展示编辑体温表的对话框
    async showEditDialog (sn) {
      try {
        const { data: res } = await this.$http.get('tf/' + sn)
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
          await this.$http.put('tf/' + this.editForm.sn, {
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
    // 根据体温表的序号sn删除体温表
    async removeTemForm (sn) {
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
        await this.$http.delete('tf/' + sn)
        this.$message.success('删除假条成功！')
        await this.getTemFormList()
      } catch (err) {
        return this.$message.error('删除假条失败！')
      }
    },
    // 设置体温表在表格中的序号
    setIndex (index) {
      return index + 1 + this.queryInfo.pagesize * (this.queryInfo.pagenum - 1)
    }
  }
}
</script>

<style scoped>
</style>
