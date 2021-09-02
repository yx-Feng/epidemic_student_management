<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>请假管理</el-breadcrumb-item>
      <el-breadcrumb-item>写假条</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 查询用户的搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请根据学号搜索" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">创建假条</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="leaveList" border stripe style="width: 80%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="请假开始时间" prop="start_time"></el-table-column>
        <el-table-column label="请假结束时间" prop="end_time"></el-table-column>
        <el-table-column label="请假原因" prop="reason"></el-table-column>
        <el-table-column label="去向" prop="place"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="审核人" prop="counselor"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      &lt;!&ndash; 分页区域 &ndash;&gt;-->
<!--      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"-->
<!--                     :page-sizes="[3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">-->
<!--      </el-pagination>-->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取假条列表的参数对象(查询的依据)
      queryInfo: {
        query: '',
        // 每页的数据条数(默认每页显示3条)
        pagesize: 3,
        // 页号(默认是第一页)
        pagenum: 1
      },
      // 用户的id
      id: '',
      // 假条列表数据
      leaveList: [],
      // 控制创建假条对话框的显示与隐藏
      addDialogVisible: false
    }
  },
  created () {
    this.id = this.window.sessionStorage.getItem('id')
  },
  methods: {
    // 根据个人id获取假条列表
    async getLeaveFormList (id) {
      const { data: res } = await this.$http.get('/leaveforms/' + id, {
        params: this.queryInfo
      })
    }
  }
}
</script>

<style scoped>
</style>
