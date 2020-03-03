<template>
  <div class="login-page" :style="pageStyles">
    <div class="login-box">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
               label-position="left">
        
        <div class="title-container">
          <h1 class="title">{{ config.title || '用户登录' }}</h1>
        </div>
        
        <el-form-item prop="username">
          <span class="svg-container"><i class="el-icon-user-solid"></i></span>
          <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <span class="svg-container"><i class="el-icon-s-goods"></i></span>
          <el-input
              key="password"
              ref="password"
              v-model="loginForm.password"
              type="password"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"></el-input>
        </el-form-item>
        
        <el-button class="login-btn" :loading="loading" type="primary" @click.native.prevent="handleLogin">Login
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {login} from "../api";
  import {setToken} from "../utils/auth-helper";

  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {},
        passwordType: 'password',
        loading: false,

        config: {}
      }
    },
    computed: {
      pageStyles() {
        let styles = {};
        if (this.config.bg) {
          styles['backgroundImage'] = `url(${this.config.bg})`
        }

        return styles;
      }
    },
    created() {
      this.config = this.$config.login;
    },
    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            login(this.loginForm).then(res => {
              setToken(res.token);
              this.$router.push('/')
            }).finally(() => {
              this.loading = false;
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .login-page {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    
    .login-box {
      border-radius: 5px;
      width: 400px;
      background-color: white;
      padding: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -200px;
      margin-top: -200px;
      
      .title-container {
        text-align: center;
      }
      
      .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        
        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          border-radius: 0px;
          padding: 12px 5px 12px 15px;
          color: #666666;
          height: 47px;
          caret-color: #666666;
          
          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px #666666 inset !important;
            -webkit-text-fill-color: #666666 !important;
          }
        }
      }
      
      .svg-container {
        padding: 6px 5px 6px 15px;
        color: #666666;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }
      
      .login-btn {
        width: 100%;
      }
    }
  }
</style>