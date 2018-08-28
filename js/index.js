let soundpack_index = [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,8,8.5,9,9.5,10,11,11.5,12,12.5,13,13.5,14,15];

let display_key = [
      {num: 1,key: 90  ,type:'white'},
      {num: 1.5,key: 83  ,type:'black'},
      {num: 2,key: 88  ,type:'white'},
      {num: 2.5,key: 68  ,type:'black'},
      {num: 3,key: 67  ,type:'white'},
      {num: 4,key: 86  ,type:'white'},
      {num: 4.5,key: 71  ,type:'black'},
      {num: 5,key: 66  ,type:'white'},
      {num: 5.5,key: 72  ,type:'black'},
      {num: 6,key: 78  ,type:'white'},
      {num: 6.5,key: 74  ,type:'black'},
      {num: 7,key: 77  ,type:'white'},
      {num: 8,key: 81  ,type:'white'},
      {num: 8.5,key: 50  ,type:'black'},
      {num: 9,key: 87  ,type:'white'},
      {num: 9.5,key: 51,type:'black'},
      {num: 10,key: 69  ,type:'white'},
      {num: 11,key: 82  ,type:'white'},
      {num: 11.5,key: 53  ,type:'black'},
      {num: 12,key: 84  ,type:'white'},
      {num: 12.5,key: 54  ,type:'black'},
      {num: 13,key: 89  ,type:'white'},
      {num: 13.5,key: 55  ,type:'black'},
      {num: 14,key: 85  ,type:'white'},
      {num: 15,key: 73  ,type:'white'}
    ]

let song = 
[{"num":1,"time":150},{"num":1,"time":265},{"num":5,"time":380},{"num":5,"time":501},{"num":6,"time":625},{"num":6,"time":748},{"num":5,"time":871},{"num":4,"time":1126},{"num":4,"time":1247},{"num":3,"time":1365},{"num":3,"time":1477},{"num":2,"time":1597},{"num":2,"time":1714},{"num":1,"time":1837}]

const vm = new Vue({
  el: '#app',
  data: {
    soundpack_index,
    song,
    display_key,
    nowplaying: 0,
    nowplayingkey: 0,
    playing: false,
    recording: false,
    playtime: 0,
    playinter: null,
    recordinter: null,
    nowkeyin: false,
  },
  methods: {
    playnote(id){
      const audio = document.querySelectorAll('audio')
      for(let i = 0;i<audio.length;i++){
        if(id == audio[i].dataset.num){
          audio[i].currentTime = 0;
          audio[i].play();
        }
      }
    },
    playnext(){
      this.addnote(this.song[this.nowplaying].num);
      this.nowplayingkey = this.song[this.nowplaying].num;
      this.nowplaying++;
      if(this.nowplaying >= this.song.length){
        this.stopplay();
      }
    },
    startplay(){
      if(this.recording){
        alert('錄音中無法播放');
        return;
      }
      let vobj = this;
      this.nowplaying = 0;
      this.playtime = 0;
      this.playing = true;
      if(vobj.song.length <= 0){
        alert('無樂譜不可播放');
        return;
      }
      this.playinter = setInterval(function(){
        vobj.playtime++;
        for(let i = 0;i < vobj.song.length;i++){
          if(vobj.playtime == vobj.song[i].time){
            this.playing = true;
            vobj.playnext();
          }
        }
      },1);
    },
    stopplay(){
      clearInterval(this.playinter);
      this.playtime = 0;
      this.nowplaying = 0;
      this.playing = false;
      this.nowplayingkey = 0;
      this.nowplaying = 0;
    },
    getsmaple(){
      let vobj = this;
      axios.get('https://awiclass.monoame.com/api/command.php?type=get&name=music_dodoro').then(function(res){
        vobj.song = res.data;
      })
    },
    startrecord(){
      if(this.playing){
        alert('播放中無法錄音');
        return;
      }
      let vobj = this;
      this.nowplaying = 0;
      this.playtime = 0;
      this.recording = true;
      this.song = [];
      this.recordinter = setInterval(function(){
        vobj.playtime++;
      },1);
    },
    stoprecord(){
      clearInterval(this.recordinter);
      this.playtime = 0;
      this.nowplaying = 0;
      this.recording = false;
    },
    addnote(id){
      if(this.recording){
        this.song.push({
          "num": id,
          "time": this.playtime
        })
      }
      this.playnote(id);
    }
  },
  mounted(){
    let vobj = this;
    window.onkeydown = function(e){
      for(let i = 0; i < vobj.display_key.length; i++){
        if(vobj.display_key[i].key == e.keyCode){
          vobj.addnote(vobj.display_key[i].num);
          vobj.nowplayingkey = vobj.display_key[i].num;
          vobj.nowplaying = i;
        }
      }
    }
    
    window.onkeyup = function(e){
      vobj.nowplayingkey = 0;
      vobj.nowplaying = 0;
    }
  }
})