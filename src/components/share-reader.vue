<script type="text/ecmascript-6">
// 用于读取url中的分享信息
import { isDef, createSong } from '@/utils'
import { getSearch } from '@/api'
import { mapActions, mapMutations } from '@/store/helper/music'

export default {
  created () {
    console.log(484894)
    this.$watch('$route.query.shareMusicId', async shareMusicId => {
      console.log(shareMusicId)
      if (isDef(shareMusicId)) {
        const {
          result: { songs }
        } = await getSearch({
          keywords: shareMusicId,
          limit: 1
        })

        if (Array.isArray(songs) && songs.length) {
          const [song] = songs
          const { id, mvid, name, alias, artists, duration, album, fee } = song
          const createdSong = createSong({
            id,
            name,
            alias,
            artists,
            duration,
            mvId: mvid,
            albumName: album.name,
            albumId: album.id,
            fee
          })

          await this.startSong(createdSong)
          this.setPlaylist([createdSong])
          this.setPlayerShow(true)
        }
      }
    })
  },
  methods: {
    ...mapMutations(['setPlayerShow', 'setPlaylist']),
    ...mapActions(['startSong'])
  },
  render () {
    return null
  }
}
</script>
