let player;
let videoList;
let currentIndex = 0;
let pattern = 0;
let playerReady = false;
let inputForcus = false;
//        let videoIdList = [];
let randomIndex = [];
let indexcount = 0;
//
let timer;
let startTime;
let interval;

////////////////////////////////////////////////////
// なんかみんなそうしてる！　クッキーの関係らしい。おいしそう。
// 参考：https://github.com/inoshiro/inuinouta/blob/master/inuinouta/static/js/youtube_playlist.js
let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
////////////////////////////////////////////////////
function onYouTubeIframeAPIReady() {
    try{
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: '',
        events: { onReady: onPlayerReady,
                  onStateChange: onPlayerStateChange,
                  onError:onPlayerError
         }
    });
    }catch(e){
        alert(e);
    }
}
////////////////////////////////////////////////////
function onPlayerReady(event) {
    videoList = $('#playlist-table').DataTable();
    // クリックして再生
    $('#playlist-table tbody').on('click', 'tr', function () {
        currentIndex = videoList.row(this).index();
        console.log(videoList.row(this).selector.rows.id)
        playVideoAtTime(videoIdList,currentIndex);
    });
    playerReady = true;
    document.addEventListener('keydown', handleKeyPress);
}
////////////////////////////////////////////////////
function onPlayerStateChange(event) {
    var ytcurrentTime = player.getCurrentTime();
    if(event.data == YT.PlayerState.ENDED && ytcurrentTime != 0) {
        //とりあえず順々に再生されるように
//        pattern = 0;
        playNextVideo(pattern);
    }
}
////////////////////////////////////////////////////
function onPlayerError(event) {
    let errorMessage = '';
    switch (event.data) {
        case 2:
            errorMessage = '無効なパラメータです';
            break;
        case 5:
            errorMessage = 'HTML5プレーヤーのエラーです';
            break;
        case 100:
            errorMessage = '動画が見つかりません';
            break;
        // 埋め込み不能などで再生できないものは飛ばす
        case 101:
        case 150:
            playNextVideo(pattern);
            return;
        default:
            errorMessage = '不明なエラーが発生しました';
    }
    alert(errorMessage);
}
////////////////////////////////////////////////////
    function loadVideo() {
        if (!playerReady) {
            alert('プレイヤーの準備が完了するまでお待ちください');
            return;
        }
        const url = document.getElementById('video-url').value;
        const videoId = extractVideoId(url);
        if (videoId) player.loadVideoById(videoId);
    }
////////////////////////////////////////////////////
    function extractVideoId(url) {
        if (url.indexOf('youtu.be') !== -1) {
            let editval = url.replace('https://youtu.be/', '');
            return editval.split("?")[0] || '';
        }else if (url.indexOf('live') !== -1) {
            let editval = url.replace('https://www.youtube.com/live/', '');
            editval = editval.replace('https://youtube.com/live/', '');
            return editval.split("?")[0] || '';
        }else if (url.indexOf('shorts') !== -1) {
            let editval = url.replace('https://www.youtube.com/shorts/', '');
            editval = editval.replace('https://youtube.com/shorts/', '');
            return editval.split("?")[0] || '';
        } else {
            const match = url.match(/[?&]v=([^&]+)/);
            return match ? match[1] : null;
        }
    }
////////////////////////////////////////////////////
    function formatTime(seconds) {
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
////////////////////////////////////////////////////
    function setCurrenttime(){
        document.getElementById('timehidden').value = player.getCurrentTime();
        document.getElementById('timedisplay').value = formatTime(player.getCurrentTime());
    }
////////////////////////////////////////////////////
function playNextVideo(i_type) {
    if (i_type == 0) {
        currentIndex++;
        if (currentIndex >= videoIdList.length) {
            currentIndex = 0;
        }
    } else if (i_type == 1){
        currentIndex = randomIndex[indexcount];
        indexcount++;
    } else if (i_type == 2) {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = videoIdList.length - 1;
        }
    }
    playVideoAtTime(videoIdList,currentIndex);
}
////////////////////////////////////////////////////
function handleKeyPress(event) {
    if (!playerReady) return;
    if(inputForcus) return;
    switch(event.key) {
        case 'k': player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo(); break;
        case 'j': player.seekTo(player.getCurrentTime() - 10, true); break;
        case 'l': player.seekTo(player.getCurrentTime() + 10, true); break;
        case 'ArrowLeft': player.seekTo(player.getCurrentTime() - 5, true); break;
        case 'ArrowRight': player.seekTo(player.getCurrentTime() + 5, true); break;
        case 'u': playNextVideo(2); break;
        case 'i': playNextVideo(0); break;
    }
}
////////////////////////////////////////////////////
// 再生
function playVideoAtTime(arr_videolist, int_index){
    let singerlist = [];
    let alllist = [];
    const nextRowId = arr_videolist[int_index];
    const nextRow = $(`#${nextRowId}`);
    const nextVideoId = nextRow.attr('data-video-id');
    const startTime = parseInt(nextRow.attr('data-start')) || 0;
    const endTime = parseInt(nextRow.attr('data-end')) || 999999;
    if(nextVideoId){
        player.loadVideoById({
            videoId: nextVideoId,
            startSeconds: startTime,
            endSeconds: endTime
        });
    }
}
// 再生リストの並び順変更
function listsort(ilist,pattern){
    if(Number(pattern) == 0){
        ilist.sort((a,b) => (a < b ? -1 : 1));
    }else if(Number(pattern) == 1){
        ilist.sort(() => Math.random() - 0.5);
    }
}
// タイマー開始関数
function startTimer(i_time) {
    if (timer) clearTimeout(timer);
    if (interval) clearInterval(interval);

    startTime = Date.now();

    // 30分後アラート
    timer = setTimeout(function() {
        player.pauseVideo();
        showMessage(`${i_time}分が経ちました！`,0);
    }, i_time * 60 * 1000);

    // 経過時間を1秒ごとに更新
    interval = setInterval(function() {
        let now = Date.now();
        console.log(now);
        let elapsedMs = now - startTime;
        let totalSeconds = Math.floor(elapsedMs / 1000);
        /*
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        */
        document.getElementById("elapsed").textContent = formatTime(totalSeconds);
    }, 1000);
}

// タイマーリセット関数
function resetTimer() {
    clearTimeout(timer);
    clearInterval(interval);
//    startTimer();
}


pat = document.getElementById('pattern')
sle = document.getElementById('sleep_timer')
sle.addEventListener('change',function(){
    if(this.value == 0){
        document.getElementById("elapsed").textContent = formatTime(0);
        resetTimer();
    }else{
        startTimer(this.value);
    }
})
pat.addEventListener('change',function(){
    pattern = this.value;
    if(pattern == 1){
        for (let i = 0; i < videoIdList.length; i++) {
            randomIndex.push(i);
          }
        listsort(randomIndex,1)
        indexcount = 0;
    }
})