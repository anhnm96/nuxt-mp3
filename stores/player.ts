import { Howl } from 'howler'
import { PlayerMode, PlayerState } from '@/types'
import type { Playlist, Song } from '@/types'
import { show } from '@/components/custom/Notification'

interface SetStatePayload {
  prop: string
  value: any
}

let timeout: NodeJS.Timeout
export const usePlayer = defineStore('player', {
  state: () => ({
    showVideo: false,
    howler: null as unknown as Howl,
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
  }),
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
    currentIndex(state): number {
      return this.songList.findIndex(
        (song: Song) => song.encodeId === state.currentSong.encodeId,
      )
    },
    previousSongs(): Song[] {
      if (this.currentIndex < 1) return []
      return this.songList.slice(0, this.currentIndex)
    },
    nextSongs(): Song[] {
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
  actions: {
    setState(payload: SetStatePayload) {
      // @ts-expect-error
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
    async fetchStreamingAction() {
      // fetch streaming for current song
      this.setState({ prop: 'playerState', value: PlayerState.LOADING })
      try {
        const { data } = await useAsyncData('streaming', () =>
          getStreaming(this.currentSong.encodeId, this.currentSong.isWorldWide),
        )

        if (data.value.err === -1110 || data.value.err === -1150) {
          show({
            position: 'top-right',
            type: 'danger',
            title: 'Sorry, this content may not be available',
            showProgressbar: false,
          })
          this.setState({
            prop: 'playerState',
            value: PlayerState.PAUSE,
          })
          return
        }
        this.loadSong(data.value.data['128'])
      } catch (error) {
        console.log('error', error)
      }
    },
    loadSong(payload: string) {
      // destroy Howl object
      if (this.howler instanceof Howl) {
        this.howler.unload()
        clearTimeout(timeout)
      }

      this.setState({
        prop: 'howler',
        value: new Howl({
          src: [payload],
          html5: true,
          volume: this.volume,
          mute: this.isMuted,
        }),
      })

      this.howler.on('play', () => {
        console.log('play', this.currentSong.title)
        // clear old timeout
        clearTimeout(timeout)
        document.title = `${this.currentSong.title} - ${this.currentSong.artistsNames} | Zing MP3`
        this.setState({ prop: 'playerState', value: PlayerState.PLAYING })
        this.progress()
      })
      this.howler.on('pause', () => {
        clearTimeout(timeout)
        document.title = 'Zing MP3'
        // if we want howler load other song howler will pause -> unload
        if (this.playerState !== PlayerState.LOADING)
          this.setState({ prop: 'playerState', value: PlayerState.PAUSE })
        console.log('pause', this.currentSong.title)
      })
      this.howler.on('unlock', () => {
        console.log('unlock', this.currentSong.title)
      })
      this.howler.on('stop', () => {
        console.log('stop', this.currentSong.title)
        clearTimeout(timeout)
        if (this.playerState !== PlayerState.LOADING)
          this.setState({ prop: 'playerState', value: PlayerState.PAUSE })
      })

      this.howler.on('end', () => {
        console.log('end', this.currentSong.title)
        clearTimeout(timeout)
        if (this.playerMode === PlayerMode.REPEAT_SONG) {
          this.howler.play()
          return
        }
        if (this.nextSongs.length === 0) {
          if (this.playerMode === PlayerMode.REPEAT_LIST) {
            this.setState({
              prop: 'currentSong',
              value: this.songList[0],
            })
          } else {
            this.setState({
              prop: 'playerState',
              value: PlayerState.PAUSE,
            })
          }
          return
        }
        this.setState({ prop: 'currentSong', value: this.nextSongs[0] })
      })

      this.updateMediaSessionMetaData()
      this.howler.play()
    },
    progress() {
      timeout = setTimeout(() => {
        // console.log('timemout')
        const currentTime = this.howler.seek()
        this.setState({ prop: 'seek', value: formatTime(currentTime) })
        this.setState({
          prop: 'currentTime',
          value: currentTime,
        })
        this.progress()
      }, 500)
    },
    updateSeek(time: number) {
      // update playerProgress state
      this.setState({ prop: 'currentTime', value: time })
      // make howler seek to selected progress
      this.howler?.seek(time)
    },
    playNext() {
      if (!this.nextSongs.length) return
      this.setState({ prop: 'currentSong', value: this.nextSongs[0] })
    },
    playPrevious() {
      console.log('playPrevious', this.previousSongs)
      if (!this.previousSongs.length) return
      this.setState({
        prop: 'currentSong',
        value: this.previousSongs[this.previousSongs.length - 1],
      })
    },
  },
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayer, import.meta.hot))
}
