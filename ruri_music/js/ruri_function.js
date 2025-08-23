////////////////////////////////////////////////////
// 変数宣言
////////////////////////////////////////////////////
let inputfocus = false;
let currentIndex = 0;
let playlength = 0;
let timer;
let interval;
const playlistUl = document.getElementById('playlist-field');
////////////////////////////////////////////////////////////
// ファンクション
////////////////////////////////////////////////////
function formatTime(seconds) {
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
////////////////////////////////////////////////////
function displaydiv(i_type) {
    var outdiv = document.getElementById('div_addframe');
    if (i_type == 1) {
        outdiv.style.display = "";
    } else if (i_type == 2) {
        outdiv.style.display = "none";
    }
}
////////////////////////////////////////////////////
function setAction(){
  document.getElementById('config').addEventListener("click", () => {
    displaydiv(1);
  });
  document.getElementById('close_button').addEventListener("click", () => {
    displaydiv(2);
  });
  document.getElementById('search').addEventListener("input", (event) => {
    document.querySelectorAll("input[name='searchitem']").forEach(item => {
      pitem = item.parentElement;
      txt = event.target.value.toLowerCase();
      itemtitle = pitem.dataset.title.toLowerCase();
      itemartist = pitem.dataset.artist.toLowerCase();
      if (itemtitle.includes(txt) || itemartist.includes(txt) ){
        item.checked = false;
      }else{
        item.checked = true;
      }
    });
  });
  document.getElementById('search').addEventListener("focus", () => {
    inputfocus =true;
  });
  document.getElementById('search').addEventListener("blur", () => {
    inputfocus =false;
  });
  const guideIcon = document.getElementById('guide');
  const tooltip = document.getElementById('guide-tooltip');

  guideIcon.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block';
  });

  guideIcon.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  //スリープタイマー設定
  document.getElementById('sleep_timer').addEventListener('change',function(){
    if(this.value == 0){
        document.getElementById("elapsed").textContent = formatTime(0);
        resetTimer();
    }else{
        startTimer(this.value);
    }
  })
  document.getElementById('short_type').addEventListener("change", () => {
      if(!this.checked){
        document.querySelectorAll('#playlist-field .item').forEach(item =>{
          console.log(item)
        })
      }
  });
  
  
}
////////////////////////////////////////////////////
function pagestart(){
  let loading = document.getElementById('nowloading');
  loading.classList.add('fade-out');
  setTimeout(() => loading.remove(), 300);
}
////////////////////////////////////////////////////
function handleKeyPress(event) {
    if (!playerReady) return;
    if(inputfocus) return;
    switch(event.key) {
        case 'k': player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo(); break;
        case 'j': player.seekTo(player.getCurrentTime() - 10, true); break;
        case 'l': player.seekTo(player.getCurrentTime() + 10, true); break;
        case 'ArrowLeft': player.seekTo(player.getCurrentTime() - 5, true); break;
        case 'ArrowRight': player.seekTo(player.getCurrentTime() + 5, true); break;
        case 'n': playNextVideo(); break;
//        case 'i': playNextVideo(0); break;
    }
}
////////////////////////////////////////////////////
function func_title(i_data){
    let f_time =  formatTime(Number(i_data.time_e) - Number(i_data.time_s));
    let imgs = `<img width="80" height="60" src="https://i.ytimg.com/vi/${i_data.videoid}/default.jpg" loading="lazy" class="img_middle">`
    let titles = `<input class="width100 input-bordernone" type="text" value="${i_data.musictitle}" readonly/>`
    let singer = `<input class="width100 input-bordernone" type="text" value="${i_data.singer}" readonly/>`
    let artists = `<input class="width100 input-bordernone" type="text" value="${i_data.artist}" readonly/>`
    let times = `<span>${f_time}</span>`
    
    let div_info = '<div class="play_column top-center"><div>'+ imgs +'</div>' + '<div class="play_info">'+ titles + artists + singer +'</div>' + times + '</div>'
    return div_info
}

////////////////////////////////////////////////////
function startTimer(i_time) {
    if (timer) clearTimeout(timer);
    if (interval) clearInterval(interval);

    startTime = Date.now();

    timer = setTimeout(function() {
        player.pauseVideo();
        showMessage(`${i_time}分が経ちました！`,0);
        sleeptime = document.getElementById('sleep_timer')
        sleeptime.value = "0";
        sleeptime.dispatchEvent(new Event('change'));
    }, i_time * 60 * 1000);

    // 経過時間を1秒ごとに更新
    interval = setInterval(function() {
        let now = Date.now();
        let elapsedMs = now - startTime;
        let totalSeconds = Math.floor(elapsedMs / 1000);
        document.getElementById("elapsed").textContent = formatTime(totalSeconds);
    }, 1000);
}

////////////////////////////////////////////////////
// タイマーリセット関数
function resetTimer() {
    clearTimeout(timer);
    clearInterval(interval);
//    startTimer();
}

////////////////////////////////////////////////////
// video_typeごとに
function setVideo_type(){
  document.querySelectorAll('input[name="video_type"]:checked').forEach(vt =>{
    console.log(vt);
  })
}


////////////////////////////////////////////////////
function crePlaylist(){
 let count = 0;
  try{
  playlistUl.innerHTML = ''; // 既存のリストをクリア
  setSpreadsheet(Url).then(val =>{
    for (v of val){
      const div = document.createElement('div');
      div.className = 'item';
      div.dataset.index = count;
      div.dataset.videoid = v['videoid'];
      div.dataset.title = v['musictitle'];
      div.dataset.artist = v['artist'];
      div.dataset.singer = v['singer'];
      div.dataset.time_s = v['time_s'];
      div.dataset.time_e = v['time_e'];
      div.dataset.video_type = v['video_type'];
      
      // radio input
      let radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "selectitem";
      radio.hidden = true;
      if(count === 0){
        radio.checked = true;
      }
      radio.addEventListener("change", () => {
        if(radio.checked){
          Play(div.dataset.index)
        }
      })
      
      // checkbox input
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "searchitem";
      checkbox.hidden = true;
      
      // content div
      let content = document.createElement("div");
      content.className = "content";
      content.innerHTML = func_title(v);
      content.addEventListener("click", () => {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      })
      // 要素を .item に追加
      div.appendChild(radio);
      div.appendChild(checkbox);
      div.appendChild(content);
      playlistUl.appendChild(div);
      count++;
    }
    //件数を確認する
    playlength = val.length;
    player.cueVideoById({
          videoId: val[0]['videoid'],
          startSeconds: val[0]['time_s'],
          endSeconds: val[0]['time_e']
    })
    document.getElementById('musictitle').value = val[0]['musictitle'];
    document.getElementById('artist').value = val[0]['artist'];
    document.getElementById('singer').value = val[0]['singer'];
    pagestart();
  })
  }catch(e){
      console.error(e)
      alert('エラー：ごめんなさい！しばらく時間をおいてから再度起こしください。m(_ _)m')
  }
}
////////////////////////////////////////////////////
function Play(i_index){
  currentIndex = i_index;
  document.querySelectorAll("input[name='selectitem']").forEach((item, index) => {
    if (index == currentIndex){
      item.checked =true;
      pitem = item.parentElement
      player.loadVideoById({
          videoId: pitem.dataset.videoid,
          startSeconds: pitem.dataset.time_s,
          endSeconds: pitem.dataset.time_e
      });
      document.getElementById('musictitle').value = pitem.dataset.title;
      document.getElementById('artist').value = pitem.dataset.artist;
    document.getElementById('singer').value = pitem.dataset.singer;
    }
  })
}
////////////////////////////////////////////////////
function updVideoinfo(i_index){
  document.querySelectorAll("input[name='selectitem']").forEach((item, index) => {
    if (index == i_index){
      pitem = item.parentElement;
      document.getElementById('musictitle').value = pitem.dataset.title;
      document.getElementById('artist').value = pitem.dataset.artist;
    }
  })
}
////////////////////////////////////////////////////
function playNextVideo(){
  const playOrder = document.getElementById('playtype').value;
  if (playOrder === 'random') {
      let nextIndex;
      do {
          nextIndex = Math.floor(Math.random() * playlength);
      } while (nextIndex === currentIndex && playlength > 1); // 同じ曲が連続しないように
      Play(nextIndex);
  } else { // sequential (降順)
      if (currentIndex < playlength - 1) {
        Play(Number(currentIndex) + 1);
      } else {
        currentIndex = 0;
        Play(0); // 最初に戻る
      }
  }

}


