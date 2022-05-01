<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>健康上报</el-breadcrumb-item>
      <el-breadcrumb-item>查看</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 查询体温表的搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="按照学号进行搜索" v-model="queryInfo.query" clearable @clear="getTemFormList">
            <template #append>
              <el-button :icon="icon.Search" @click="getTemFormList" />
            </template>
          </el-input>
        </el-col>
        <!-- 筛选框 -->
        <el-select v-model="value" placeholder="选择"  @change="valueChange()">
          <el-option value="发热"></el-option>
          <el-option value="全部"></el-option>
        </el-select>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="temList" border stripe style="width: 100%">
        <el-table-column type="index" :index="setIndex"></el-table-column>
        <el-table-column label="学号" prop="s_id"></el-table-column>
        <el-table-column label="姓名" prop="s_name"></el-table-column>
        <el-table-column label="体温" prop="temperature"></el-table-column>
        <el-table-column label="是否发热" prop="fever"></el-table-column>
        <el-table-column label="提交时间" prop="createdTime"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-model:current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]" v-model:page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
export default {
  data () {
    return {
      // 获取体温表列表的参数对象(查询的依据)
      queryInfo: {
        query: '',
        select: '', // 用于筛选体温异常和发热的体温表
        pagesize: 3, // 每页的数据条数(默认每页显示3条)
        pagenum: 1 // 页号(默认是第一页)
      },
      id: '', // 用户的id
      temList: [], // 体温表列表
      total: 0, // 能获得的体温表总数
      value: '', // 动态绑定select框中的value
      icon: {
        Search: Search
      }
    }
  },
  created () {
    this.id = window.sessionStorage.getItem('id')
    this.getTemFormList()
  },
  methods: {
    // 根据辅导员id和查询参数获取体温表列表
    async getTemFormList () {
      try {
        const { data: res } = await this.$http.get('/tf/coun/' + this.id, {
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
    // 检测select的选择
    valueChange () {
      if (this.value === '发热') {
        this.queryInfo.select = '发热'
        this.getTemFormList()
      }
      if (this.value === '全部') {
        this.queryInfo.select = ''
        this.getTemFormList()
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
