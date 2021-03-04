<template>
  <v-app>
    <v-app-bar :max-height="50" dark dense>
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
    <v-main class="dark">
      <v-container>
        <v-row dark>
          <v-col cols="3" v-for="item in playList" :key="item.id" @click='getPlayListDetail(item.id)'>
            <!-- <v-card> -->
              <img :src="item.coverImgUrl" alt="" width="100%">
            <!-- </v-card> -->
          </v-col>
        </v-row>
      </v-container>
      <v-navigation-drawer
        v-model="showList"
        absolute
        temporary
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar>
  
          <v-list-item-content>
            <v-list-item-title>John Leider</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
          >
            <v-list-item-icon>
              <img :src="item.url" alt="">
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-main>
    <v-footer
      elevation="elevation-10"
      color="#000"
      dark
      height="80">
      <v-card flat tile width="100%" class="text-center" color="#000">
        <v-row>
          <v-col cols="2" class="text-right" aligin="center" justify="space-around">
            <!-- <v-btn-toggle mandatory  v-model="value" dark> -->
              <v-btn fab small color="#000"><v-icon>mdi-skip-previous</v-icon></v-btn>
              <v-btn fab small color="#000" @click="playPause">
                <v-icon>{{ playIcon }}</v-icon>
              </v-btn>
              <v-btn fab small color="#000"><v-icon>mdi-skip-next</v-icon></v-btn>
            <!-- </v-btn-toggle> -->
          </v-col>
          <v-col cols="1" class="mr-0 text-right pr-0">
             <v-avatar
                tile
                size="40"
                color="#5c5c5c"
              >
                <img :src="profile.avatarUrl" alt="alt">
              </v-avatar>
          </v-col>
          <v-col cols="7" class="d-flex align-center pl-1">
            <v-progress-linear :value="playProgress" background-color="grey darken-3" color="primary"></v-progress-linear>
          </v-col>
          <v-col cols="2" aligin="center" justify="space-around">
            <v-row>
              <v-col cols="7" class="d-flex align-center">
                <v-btn @click="showVol = !showVol" small fab text color="dark" class="ma-0"><v-icon>{{ volIcon }}</v-icon></v-btn>
                <v-progress-linear @change="setVol" :active="showVol" :value="vol" background-color="grey darken-3" color="primary"></v-progress-linear>   
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2">
                <v-btn small fab text color="red"><v-icon>mdi-cards-heart</v-icon></v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn small fab text color="dark"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import { login } from './api/login'
import { getPlaylist, getPlaylistDetail } from './api/request'

export default {
  data: () => ({
    isPause: true,
    showVol: false,
    showList: false,
    musicIndex: 0,
    playProgress: 12,
    vol: 15,
    musicLen: 0,
    volIcons: [
      'mdi-volume-mute',
      'mdi-volume-low',
      'mdi-volume-medium',
      'mdi-volume-high'
    ],
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
    }
  },
  mounted() {
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
      this.playList = playlist
    },
    async getPlayListDetail(id) {
      let { data } = await getPlaylistDetail(id)
      console.log(data)
      this.showList = true
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
      }
    },
    playPause() {
      this.isPause = !this.isPause
    }
     
  }
}
</script>
