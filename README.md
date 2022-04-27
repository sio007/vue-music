# 仿网易云PC客户端播放器

### 技术栈

- **vue** 全家桶
- **_ElementUI_** 组件库

- **_better-scroll_** 歌词滚动
- **_CSS Variables_** 主题换肤。
- **_workbox-webpack-plugin_** 谷歌开发的利用 Service Worker 实现页面预缓存的插件
- **_Sass_**（CSS 预处理器）
- **potplayer** 播放mv视频

### 功能

- 推荐歌单
- 歌单详情
- 最新mv
- mv详情
- 播放器
- 歌词滚动
- 搜索（搜索建议，搜索详情）
- 用户扫码登录
- 播放历史
- 查看评论
- 同步网易云歌单
- 排行榜
- 背景主题换肤

### 后端API接口

https://binaryify.github.io/NeteaseCloudMusicApi

### 安装使用

#### 检查 node版本

```sh
# 查看 node 版本，确保 node 版本高于 12 版本
node -v
```

#### 后端 api 接口（本地开发）

```sh
# 下载 NeteaseCloudMusicApi
git clone --depth=1 https://github.com/Binaryify/NeteaseCloudMusicApi

# 安装依赖
npm install

# 运行后台 api 服务 访问 http://localhost:3000
node app.js
```

#### 本项目

```sh
# clone该项目
git clone https://github.com/sio007/vue-music

# 安装依赖 
npm install

# 本地运行
npm run serve

# 编译打包
npm run build
```

### Screenshots

![首页](https://github.com/sio007/vue-music/blob/master/screenshots/1.png)

![推荐歌单](https://github.com/sio007/vue-music/blob/master/screenshots/2.png)

![最新音乐](https://github.com/sio007/vue-music/blob/master/screenshots/3.png)

![最新mv](https://github.com/sio007/vue-music/blob/master/screenshots/4.png)

![歌单详情](https://github.com/sio007/vue-music/blob/master/screenshots/5.png)

![mv详情](https://github.com/sio007/vue-music/blob/master/screenshots/6.png)

![搜索页](https://github.com/sio007/vue-music/blob/master/screenshots/7.png)

![播放器](https://github.com/sio007/vue-music/blob/master/screenshots/8.png)