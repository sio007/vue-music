<template>
  <div class="user">
    <!-- 登录前 -->
    <div class="login-trigger" @click="onOpenModal" v-if="!isLogin">
      <i class="user-icon iconfont icon-yonghu"></i>
      <p class="user-name">未登录</p>
    </div>
    <!-- 登录后 -->
    <div class="logined-user" v-else @click="onLogout">
      <img v-lazy="$utils.genImgUrl(user.avatarUrl, 80)" class="avatar" />
      <p class="user-name">{{user.nickname}}</p>
    </div>
    <!-- 登录框 -->
    <el-dialog :model="false" :visible.sync="visible" :width="$utils.toRem(320)">
      <p class="title">请使用 <b>网易云音乐APP</b> 扫码登录</p>
      <img class="eq" :src="imgsrc" ref="imgCode">

    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
// 用户扫码登录功能的基本逻辑:
// 1.发送请求获取二维码key
// 2.由二维码key发送请求生成二维码图
// 3.使用循环定时器发送请求获取二维码key的状态
// 4.如果二维码key状态是已经授权了,就将发送请求获取用户登录状态
// 5.将获取用户登录状态返回的数据中的uid赋值到store中的变量
// 6.再由store中的获取用户信息和获取用户歌单的方法,获取相关数据
// 7.再将所有数据渲染到页面中


import Storage from 'good-storage'
import { UID_KEY, isDef, addCookie } from '@/utils'
import { confirm } from '@/base/confirm'
import { checkStatus, loginStatus, getQRKey, getQR } from '@/api'
import {
  mapActions as mapUserActions,
  mapState as mapUserState,
  mapGetters as mapUserGetters
} from '@/store/helper/user'

// 定义一个循环定时器的变量名
let timer

export default {
  // 自动登录
  created () {
    // 获取stroage中的uid
    const uid = Storage.get(UID_KEY)
    // 如果存在uid,加载用户数据
    if (isDef(uid)) {
      this.UserInformation(uid)
    }
  },
  data () {
    return {
      // 控制扫码框的显示的变量
      visible: false,
      // 控制加载用户数据的变量
      loading: false,
      // 绑定二维码图片的src
      imgsrc: '',
      // 用户的uid,用来获取用户信息和用户歌单信息
      uid: ''
    }
  },
  methods: {
    // 显示扫码二维码框
    onOpenModal () {
      this.visible = true
      // 加载二维码登录
      this.eqLogin()
    },
    // 隐藏扫码二维码框
    onCloseModal () {
      this.visible = false
    },
    // 发送请求获取二维码key的状态
    async getCheckStatus (key) {
      const res = await checkStatus(key)
      return res
    },
    // 发送请求获取用户登录状态
    async getLoginStatus () {
      const res = await loginStatus()
      return res
    },
    // 二维码登录
    async eqLogin () {
      // 发送请求获取用户登录状态
      await this.getLoginStatus()
      // 发送请求获取二维码key
      const res = await getQRKey()
      const key = res.data.unikey
      // 由二维码key发送请求生成二维码图
      const res2 = await getQR(key)
      this.imgsrc = res2.data.qrimg

      // 使用循环定时器发送请求获取二维码key的状态
      timer = setInterval(async () => {
        const statusRes = await this.getCheckStatus(key)
        console.log(statusRes)
        if (statusRes.code === 800) {
          confirm('二维码已过期,请重新获取')
          clearInterval(timer)
        }
        // 如果二维码key状态是已经授权了
        if (statusRes.code === 803) {
          // 发送请求获取用户登录状态
          const LoginStatus = await this.getLoginStatus()
          // 获取用户登录状态中返回的uid作为参数调用加载用户详细数据和用户歌单数据
          await this.UserInformation(LoginStatus.data.profile.userId)
          // 关闭二维码框
          // this.onCloseModal()
          // 弹出成功消息窗
          confirm('登录成功')
          // 将二维码key状态返回的MUSIC_U键存储到cookie
          addCookie('MUSIC_U', statusRes.cookie)
        }
      }, 5000)
    },
    // 加载用户数据
    async UserInformation (uid) {
      // 开启加载用户数据
      this.loading = true
      // 调用store中加载数据的方法
      const success = await this.userData(uid).finally(() => {
        // 最后关闭加载用户数据
        this.loading = false
      })
      // 如果获取用户信息成功
      if (success) {
        // 关闭扫码二维码框
        this.onCloseModal()
      }
    },
    // 注销功能
    onLogout () {
      // 弹出消息窗
      confirm('确定要注销吗？', () => {
        // 调用store中注销功能
        this.logout()
        confirm('注销成功')
        this.$router.push('/discovery')
      })
    },
    ...mapUserActions(['userData', 'logout'])
  },
  computed: {
    ...mapUserState(['user']),
    ...mapUserGetters(['isLogin'])
  },
  watch: {
    // 监听控制二维码框显示状态的变量
    visible () {
      // 如果二维码框不显示,必须清除里面的定时器
      if (!this.visible) {
        clearInterval(timer)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding: 16px;
  padding-bottom: 0;
  margin-bottom: 12px;

  .login-trigger {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .user-icon {
    font-size: 24px;
  }
  .user-name {
    margin-left: 8px;
  }

  .title {
    text-align: center;
    font-size: $font-size-lg;
    margin-bottom: 10px;
    b {
      color: red;
    }
  }
  .eq {
    display: block;
    margin: 0 auto;
  }

  .logined-user {
    display: flex;
    align-items: center;
    cursor: pointer;

    .avatar {
      @include round(40px);
    }
  }
}
</style>
