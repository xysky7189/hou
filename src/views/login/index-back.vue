<template>
<div class="login-wrap">
  <div class="form-wrap">
    <div class="form-head">
      <img src="./logo_index.png" alt="黑马头条号">
    </div>
    <el-form class="form-content" ref="form" :model="form" :rules="rules">
      <el-form-item prop="mobile">
        <el-input v-model="form.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-col :span="14">
          <el-input v-model="form.code" placeholder="验证码"></el-input>
        </el-col>
        <el-col :offset="1" :span="9">
          <el-button @click="handleSendCode" :disabled="!!codeTimer">{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
        <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
import { saveUser } from '@/utils/auth'
const initCodeTimeSeconds = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '',
        code: '',
        agree: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /\d{11}/, message: '请正确输入', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { pattern: /\d{6}/, message: '请正确输入', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null,
      codeTimeSeconds: initCodeTimeSeconds
    }
  },
  methods: {
    handleLogin () {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.submitLogin()
      })
    },
    submitLogin () {
      axios({
        method: 'POST',
        url: `http://toutiao.course.itcast.cn/mp/v1_0/authorizations`,
        data: this.form
      }).then(res => {
        const userInfo = res.data.data
        // window.localStorage.setItem('user_info', JSON.stringify(userInfo))
        saveUser(userInfo)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      }).catch((e) => {
        this.$message.error('登录失败，手机号或验证码错误')
      })
    },
    handleSendCode () {
      this.$refs['form'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        this.showGeetest()
      })
    },
    showGeetest () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://toutiao.course.itcast.cn/mp/v1_0/authorizations/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        }, captchaObj => {
          captchaObj.onReady(() => {
            captchaObj.verify()
          }).onSuccess(() => {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://toutiao.course.itcast.cn/mp/v1_0/authorizations/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              this.codeCountDown()
            })
          }).onError(function () {
            //  your code
          })
        })
      })
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          window.clearInterval(this.codeTimer)
          this.codeTimeSeconds = initCodeTimeSeconds
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  background-color: #e1f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {

  }
}
</style>
