<template>
  <v-app>
    <v-app-bar :max-height="50" dark dense fixed>
      <v-app-bar-nav-icon><v-icon>mdi-music-clef-treble</v-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Navigation</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-avatar
        size="35"
        color="#5c5c5c"
      >
        <img :src="profile.avatarUrl" alt="alt">
      </v-avatar>
      </div>
    </v-app-bar>
    <v-main class="dark" >
      <v-container fluid  class="mt-8 container">
        <v-row dark no-gutters class="d-flex" justify="start">
          <v-col class="mt-5 text-center" cols="2" v-for="(item,index) in playList" :key="item.id" >
            <!-- <v-card> -->
              <img :src="item.coverImgUrl" alt="" width="200" height="200" class="cover" @click="getPlayListDetail(item.id,index)">
            <!-- </v-card> -->
          </v-col>
        </v-row>
      </v-container>
      <v-navigation-drawer
        v-model="showList"
        fixed
        temporary
        dark
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="currrentAlbum.coverImgUrl"></v-img>
          </v-list-item-avatar>
  
          <v-list-item-content>
            <v-list-item-title>{{ currrentAlbum.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <v-list dense nav>
          <template 
            v-for="(item,index) in playlistDetail">
             <v-list-item :key="index" class="musicItem" color="#000" @dblclick="selectMusic(item)">
                <v-img :src="item.al.picUrl" max-width="40" height="40" alt="123" class="mr-2"></v-img>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
                <template v-if="item.active">
                  <v-icon>mdi-play</v-icon>
                </template>
              </v-list-item>
              <v-divider :key="index + item.id"></v-divider>
          </template>
         
        </v-list>
      </v-navigation-drawer>
    </v-main>
    <v-footer
      fixed
      color="dark"
      dark
      height="60">
      <!-- <v-card flat tile width="100%" class="text-center" color="#000"> -->
        <v-row>
          <v-col cols="2" class="text-right" align-self="center" justify="start" align="center">
              <v-btn fab small color="dark"><v-icon>mdi-skip-previous</v-icon></v-btn>
              <v-btn fab small color="dark" @click="playPause">
                <v-icon>{{ playIcon }}</v-icon>
              </v-btn>
              <v-btn fab small color="dark"><v-icon>mdi-skip-next</v-icon></v-btn>
          </v-col>

          <v-col cols="8" class="d-flex align-center">
             <v-avatar
                tile
                size="40"
                color="#5c5c5c"
                class="mr-2"
              >
                <img :src="musicPic" alt="alt" class="musicPic">
              </v-avatar>
            <v-progress-linear :value="playProgress" background-color="grey darken-3" color="red darken-2" class=""></v-progress-linear>
          </v-col>
          <v-col cols="2" align-self="center" justify="space-around">
            <v-row>
              <v-col cols="7" class="d-flex align-center">
                <v-btn @click="showVol = !showVol" small  text color="dark" class="ma-0"><v-icon>{{ volIcon }}</v-icon></v-btn>
                <v-progress-linear @change="setVol" :active="showVol" :value="vol" background-color="grey darken-3" color="primary" class="playProgerss"></v-progress-linear>   
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2">
                <v-btn small fab text color="red"><v-icon>mdi-cards-heart</v-icon></v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn small fab text color="dark" @click="showList = !showList"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      <!-- </v-card> -->
    </v-footer>
    <audio :src="musicUrl" ref='player' autoplay></audio>
  </v-app>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import { login } from './api/login'
import { getPlaylist, getPlaylistDetail, getMusicUrl } from './api/request'

export default {
  data: () => ({
    isPause: true,
    showVol: false,
    showList: false,
    curentMusic: null,
    musicUrl: null,
    AlbumIndex: 0,
    playProgress: 12,
    duration:0,
    vol: 15,
    musicLen: 0,
    volIcons: [
      'mdi-volume-mute',
      'mdi-volume-low',
      'mdi-volume-medium',
      'mdi-volume-high'
    ],
    $player: null,
    //歌单
    playList: [],
    //歌单歌曲
    playlistDetail: []
  }),
  computed:{
    ...mapState(['profile']),
    volIcon() {
      switch (true) {
        case this.vol == 0:
          return this.volIcons[0]

        case this.vol >0 && this.vol < 30:
          return this.volIcons[1]

        case this.vol >=30 && this.vol <=60:
          return this.volIcons[2]

        default:
          return this.volIcons[3]
      }
    },
    playIcon() {
      return this.isPause? "mdi-play" : 'mdi-pause'
    },
    currrentAlbum() { 
      return this.playList[this.AlbumIndex]? this.playList[this.AlbumIndex] : { }
    },
    musicPic() {
      return this.curentMusic? this.curentMusic.al.picUrl : this.profile.avatarUrl
    }
    // musicTitle() {
    //   return this.curentMusic? this.curentMusic.name : ""
    // }
  },
  mounted() {
    this.$player = this.$refs.player
    const volume = localStorage.getItem('volume')
    if(volume) {
      this.$player.volume = volume
    }
    window.addEventListener('mousewheel',this.setVol)
    this.login()
  },
  methods: {
    ...mapMutations(['setProfile']),
    async login() {
      let { data: { profile, token }} = await login({
        email: '87zhaoxiaobo@163.com',
        password: '630312zxb'
      })
      this.setProfile({
        profile,
        token
      })
      let { data: { playlist } } = await getPlaylist(this.profile.userId)
      console.log(playlist)
      this.playList = playlist
    },
    async getPlayListDetail(id,index) {
      let { data: { playlist: { tracks } } } = await getPlaylistDetail(id)
      this.playlistDetail = tracks
      this.showList = true
      this.AlbumIndex = index
    },
    setVol(e) {
      if(this.showVol) {
        e.deltaY < 0 ? this.vol += 5 : this.vol -= 5;
        if(this.vol > 100) {
          this.vol = 100
        }
        if(this.vol < 0) {
          this.vol = 0
        }
        this.$player.volume = this.vol/100
        localStorage.setItem('volume',this.$player.volume)
      }
    },
    playPause() {
      this.isPause = !this.isPause
      const player = this.$player
      if(player.paused) {
        player.play()
      }else{
        player.pause()
      }
      console.log(this.$player)
    },
    async selectMusic(music) {
      this.playlistDetail.forEach(item => {
        this.$set(item,"active",false)
      })
      this.$set(music,"active",true)
      this.curentMusic = music
      //根据ID发送请求,获取当前播放歌曲
      let { data } = await getMusicUrl(music.id)

      this.musicUrl = data.data[0].url
      this.isPause = false
    } 
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  overflow-y: scroll;
}
.cover {
  border: 3px solid rgb(5, 5, 5);
  border-radius: 5px;
  cursor: pointer;
}
.musicItem {
  cursor: pointer;
}
.musicPic {
  border: 2px solid #5c5c5c;
  border-radius: 5px;
}
.playProgerss {
  cursor: pointer;
}
</style>
