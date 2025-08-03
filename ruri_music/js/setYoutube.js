////////////////////////////////////////////////////
// 変数宣言
////////////////////////////////////////////////////
let player;
let playerReady = false;
////////////////////////////////////////////////////
// Youtube Iframe APIを使うときのおまじない
////////////////////////////////////////////////////
// 参考：https://github.com/inoshiro/inuinouta/blob/master/inuinouta/static/js/youtube_playlist.js
let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
////////////////////////////////////////////////////
// ファンクション
////////////////////////////////////////////////////
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: '',
      events: { onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
       }
  });
}

////////////////////////////////////////////////////
  function onPlayerReady(){
    playerReady = true;
    crePlaylist();
    document.addEventListener('keydown', handleKeyPress);
  }
////////////////////////////////////////////////////
function onPlayerStateChange(event) {
    var ytcurrentTime = player.getCurrentTime();
    if(event.data == YT.PlayerState.ENDED && ytcurrentTime != 0) {
        //とりあえず順々に再生されるように
        playNextVideo();
    }
    
}
