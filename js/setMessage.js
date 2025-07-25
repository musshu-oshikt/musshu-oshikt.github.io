  const newMessageDiv = document.createElement("div");
  newMessageDiv.id = 'message-window';
  document.body.insertBefore(newMessageDiv, document.body.firstChild);
  
// メッセージウィンドウを表示する関数
function showMessage(i_Str,i_type) {
    const messageWindow = document.getElementById('message-window');
    messageWindow.innerText = i_Str;
    messageWindow.classList.add('show');
    if(i_type == 0){
        messageWindow.classList.add('ok_window');
    }else{
        messageWindow.classList.add('ng_window');
    }
    // 5秒後に自動的に非表示にする
    setTimeout(() => {
        messageWindow.classList.remove('show');
    }, 3000);
}
