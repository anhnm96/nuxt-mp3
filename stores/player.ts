import { PlayerState } from '@/types'
import type { Playlist, Song } from '@/types'

interface SetStatePayload {
  prop: string
  value: any
}

export enum PlayerMode {
  DEFAULT = 'DEFAULT',
  REPEAT_LIST = 'REPEAT_LIST',
  REPEAT_SONG = 'REPEAT_SONG',
}

let timeout: NodeJS.Timeout
export const usePlayer = defineStore('player', {
  state: () => {
    return {
      showVideo: false,
      howler: null,
      currentSong: null as unknown as Song,
      playlist: null as unknown as Playlist,
      seek: '0:00',
      currentTime: 0,
      isMuted: false,
      volume: 0.5,
      playerState: PlayerState.IDLE,
      showLyric: false,
      showPlaylist: true,
      isShuffled: false,
      shuffledList: [] as Song[],
      playerMode: PlayerMode.DEFAULT,
    }
  },
  actions: {
    setState(payload: SetStatePayload) {
      this[payload.prop] = payload.value
    },
    setCurrentSong(payload: Song) {
      this.howler?.pause()
      this.currentSong = payload
    },
    toggleShowPlaylist() {
      this.showPlaylist = !this.showPlaylist
    },
    updateMediaSessionMetaData() {
      // https://developers.google.com/web/updates/2017/02/media-session
      const navigator: any = window.navigator
      const MediaMetadata: any = (<any>window).MediaMetadata
      if ('mediaSession' in navigator === false) {
        return
      }
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentSong.title,
        artist: this.currentSong.artistsNames,
        album: 'Zing MP3',
        artwork: [
          {
            src: this.currentSong.thumbnailM,
            type: 'image/jpg',
            sizes: '512x512',
          },
        ],
      })
    },
    setVolume(payload: number) {
      if (this.isMuted) {
        this.howler.mute(false)
        this.isMuted = false
      }
      this.volume = payload
      this.howler.volume(payload)
    },
    toggleShowLyric() {
      this.showLyric = !this.showLyric
    },
    toggleMute() {
      this.isMuted = !this.isMuted
      this.howler.mute(this.isMuted)
    },
    toggleShuffleSongList() {
      this.isShuffled = !this.isShuffled
      if (this.isShuffled) {
        const currentIndex = this.playlist.song.items.findIndex(
          (song: Song) => song.encodeId === this.currentSong.encodeId,
        )
        this.shuffledList = [
          this.currentSong,
          ...shuffle([
            ...this.playlist.song.items.slice(0, currentIndex),
            ...this.playlist.song.items.slice(currentIndex + 1),
          ]),
        ]
      }
    },
    setNextPlayerMode() {
      if (this.playerMode === PlayerMode.DEFAULT)
        this.playerMode = PlayerMode.REPEAT_LIST
      else if (this.playerMode === PlayerMode.REPEAT_LIST)
        this.playerMode = PlayerMode.REPEAT_SONG
      else this.playerMode = PlayerMode.DEFAULT
    },
    togglePlay() {
      if (!this.howler || this.howler.state() === 'unloaded') {
        this.fetchStreamingAction()
        return
      }
      if (this.howler.playing()) {
        this.howler.pause()
      } else {
        this.howler.play()
      }
    },
    fetchStreamingAction() {
      // fetch streaming for current song
      this.setState('playerState', PlayerState.LOADING)
      // const {
      //   exec: fetchStreamingData,
      //   onSuccess: onFetchStreamingSuccess,
      //   onError: onFetchStreamingFailed,
      // } = useApi(fetchStreaming)
      // fetchStreamingData(
      //   state.currentSong.encodeId,
      //   state.currentSong.isWorldWide
      // )

      // onFetchStreamingSuccess((result) => {
      //   console.log('fetchStream', result)
      //   dispatch('loadSong', result['128'])
      // })

      // onFetchStreamingFailed(() => {
      //   show({
      //     position: 'top-right',
      //     type: 'danger',
      //     title: 'Sorry, this content may not be available',
      //     showProgressbar: false,
      //   })
      //   commit('setState', {
      //     prop: 'playerState',
      //     value: PlayerState.PAUSE,
      //   })
      // })
    },
  },
  getters: {
    songList(state): Song[] {
      if (state.playlist === null) {
        if (state.currentSong) return [state.currentSong]
        return []
      }
      if (state.isShuffled) {
        return state.shuffledList
      } else {
        return state.playlist.song.items
      }
    },
    currentIndex(state) {
      return this.songList.findIndex(
        (song: Song) => song.encodeId === state.currentSong.encodeId,
      )
    },
    previousSongs() {
      if (this.currentIndex < 1) return []
      return this.songList.slice(0, this.currentIndex)
    },
    nextSongs() {
      if (this.currentIndex < 0) return []
      return this.songList.slice(this.currentIndex + 1)
    },
    duration(state) {
      return formatTime(state.currentSong.duration)
    },
    isPlaying(state) {
      return state.playerState === PlayerState.PLAYING
    },
  },
})
