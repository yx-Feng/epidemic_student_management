<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>疫情下的学生管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                 :collapse="isCollapse" :collapse-transition="false" :default-active="activePath" router>
          <el-submenu :index="item.id + ''" v-for="item in menulist[Number(identity)]" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
              <i :class="iconsObj[subItem.id]"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单渲染数据列表
      menulist: [
        [
          { id: 1, authName: '用户管理', children: [{ id: 11, authName: '账号管理', path: '/accounts' }] }
        ],
        [
          { id: 2, authName: '公告管理', children: [{ id: 21, authName: '查看', path: '/notice' }] },
          { id: 3, authName: '个人信息', children: [{ id: 21, authName: '查看', path: '/stuProfile' }] },
          { id: 4, authName: '假条管理', children: [{ id: 42, authName: '写假条', path: '/leaveForm' }] },
          { id: 5, authName: '健康上报', children: [{ id: 51, authName: '体温表', path: '/temForm' }] }
        ],
        [
          { id: 2, authName: '公告管理', children: [{ id: 21, authName: '查看', path: '/notice' }, { id: 22, authName: '发布', path: '/release' }] },
          { id: 3, authName: '个人信息', children: [{ id: 21, authName: '查看', path: '/counProfile' }] },
          { id: 4, authName: '假条管理', children: [{ id: 41, authName: '待审批', path: '/pendingLeaveForm' }, { id: 42, authName: '审批通过', path: '/passedLeaveForm' }, { id: 43, authName: '审批未通过', path: '/failedLeaveForm' }] },
          { id: 5, authName: '体温表管理', children: [{ id: 21, authName: '查看', path: '/temFormCheck' }] }
        ]
      ],
      iconsObj: {
        1: 'el-icon-user-solid',
        11: 'el-icon-menu',
        2: 'el-icon-s-claim',
        21: 'el-icon-view',
        22: 'el-icon-position',
        3: 'el-icon-user-solid',
        31: 'el-icon-edit',
        4: 'el-icon-tickets',
        41: 'el-icon-s-check',
        42: 'el-icon-document-checked',
        43: 'el-icon-document-delete',
        5: 'el-icon-first-aid-kit',
        51: 'el-icon-document-add'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      // 用户的身份
      identity: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.identity = window.sessionStorage.getItem('identity')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
