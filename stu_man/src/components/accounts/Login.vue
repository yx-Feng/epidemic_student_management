<template>
  <div class="login_container">
    <h1 style="color: #dddddd;margin: 0;padding: 15px 15px">疫情下的学生管理系统</h1>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="id">
          <el-input v-model="loginForm.id" prefix-icon="el-icon-user-solid" placeholder="请输入学号或工号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" placeholder="请输入密码(3~15个字符)"></el-input>
        </el-form-item>
        <!-- 单选框：选择学生或辅导员 -->
        <el-form-item>
          <el-radio label="1" v-model="loginForm.identity">学生</el-radio>
          <el-radio label="2" v-model="loginForm.identity">辅导员</el-radio>
          <el-radio label="0" v-model="loginForm.identity">管理员</el-radio>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        id: '',
        password: '',
        identity: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        id: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录操作
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // 发起一次登录请求
        try {
          const { data: res } = await this.$http.post('/login', this.loginForm)
          this.$message.success('登录成功！')
          window.sessionStorage.setItem('token', res.data.token)
          // 将用户的identity和id存到localStorage，后面有用
          window.sessionStorage.setItem('identity', res.data.identity)
          window.sessionStorage.setItem('id', res.data.id)
          // 跳转到home主页
          await this.$router.push('/home')
        } catch (err) {
          return this.$message.error('登录失败！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 340px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
