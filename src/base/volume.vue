// 音量组件
<template>
  <div class="volume">
    <!-- 音量图标 -->
    <Icon :size="20" :type="getIconType()" @click="toggleSilence" class="icon" />
    <!-- 音量进度条 -->
    <div class="progress-wrap">
      <ProgressBar :percent="volumePercent" @percentChange="onProgressChange" alwaysShowBtn />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Volume',
  // 组件属性
  props: {
    volume: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      // 获取当前音量
      volumePercent: this.volume
    }
  },
  methods: {
    // 进度条的变化
    onProgressChange (percent) {
      // 如果进度条小于0.05，直接归0
      if (percent < 0.05) {
        percent = 0
      }
      // 将进度条的变量赋值给音量
      this.volumePercent = percent
      // 并调用父组件中对应volumeChange绑定的事件，并传参数
      this.$emit('volumeChange', percent)
    },
    // 音量按钮的样式的切换
    getIconType () {
      return this.isSilence ? 'silence' : 'horn'
    },
    // 切换为禁音
    toggleSilence () {
      this.isSilence = !this.isSilence
    }
  },
  computed: {
    // 禁音对象
    isSilence: {
      // computed有 get方法和set方法
      // get函数中的值,被调用或被修改就会调用
      get () {
        // 将音量变量设置为0
        return this.volumePercent === 0
      },
      // set函数中绑定的数据被修改后会返回最新的数据
      set (newSilence) {
        // 将 target 设置为 0 或 上一次音量的变量
        const target = newSilence ? 0 : this.lastVolume
        if (newSilence) {
          // 将 音量的变量 赋值给 上一次音量的变量
          this.lastVolume = this.volumePercent
        }
        // 将 target 赋值给 音量变量
        this.volumePercent = target
        // 将 target 传递到 进度条的变化
        this.onProgressChange(target)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.volume {
  display: flex;
  align-items: center;
  width: 150px;

  .icon {
    color: var(--font-color);
    cursor: pointer;
    margin-right: 8px;
  }

  .progress-wrap {
    flex: 1;
  }
}
</style>
