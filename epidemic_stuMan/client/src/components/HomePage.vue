<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>疫情下的学生管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" :collapse="isCollapse" :collapse-transition="false" :default-active="activePath" router>
          <el-sub-menu :index="item.id" v-for="item in menulist[Number(identity)]" :key="item.id">
            <template #title>
              <el-icon :size="size" :color="color">
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" >
              <el-icon :size="size" :color="color">
                <component :is="subItem.icon"></component>
              </el-icon>
              <span>{{subItem.name}}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体，router-view用来根据url在该位置插入对应组件 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { UserFilled, Document, DocumentChecked, DocumentDelete, DocumentCopy, Edit, Pointer } from '@element-plus/icons-vue' // 导入图标组件
export default {
  data () {
    return {
      // 左侧菜单渲染数据列表
      menulist: [
        [{ id: '1', name: '用户管理', icon: UserFilled, children: [{ id: '1-1', name: '账号管理', icon: Pointer, path: '/accounts' }] }],
        [
          { id: '1', name: '个人信息', icon: UserFilled, children: [{ id: '1-1', name: '查看', icon: Pointer, path: '/stu_pi' }] },
          { id: '2', name: '假条管理', icon: Document, children: [{ id: '2-1', name: '写假条', icon: Edit, path: '/lf' }] },
          { id: '3', name: '健康上报', icon: Document, children: [{ id: '3-1', name: '体温表', icon: Edit, path: '/tf' }] }
        ],
        [
          { id: '2', name: '个人信息', icon: UserFilled, children: [{ id: '2-1', name: '查看', icon: Pointer, path: '/coun_pi' }] },
          { id: '3', name: '假条管理', icon: Document, children: [{ id: '3-1', name: '待审批', icon: DocumentCopy, path: '/pending_lf' }, { id: '3-2', name: '审批通过', icon: DocumentChecked, path: '/passed_lf' }, { id: '3-3', name: '审批未通过', icon: DocumentDelete, path: '/failed_lf' }] },
          { id: '4', name: '体温表管理', icon: Document, children: [{ id: '2-1', name: '查看', icon: Pointer, path: '/tf_Check' }] }
        ]
      ],
      isCollapse: false, // 是否折叠
      activePath: '', // 被激活的链接地址
      identity: '' // 用户的身份
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.identity = window.sessionStorage.getItem('identity')
  },
  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态,这样你刷新页面的时候会保持原来的点击状态
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
  background-color: #545C64;
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
  background-color: #545C64;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #545C64;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
