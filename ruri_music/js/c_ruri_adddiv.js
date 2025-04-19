// 表示・非表示
function displaydiv(i_type) {
    var outdiv = document.getElementById('div_addframe');
    if (i_type == 1) {
        outdiv.style.display = "";
    } else if (i_type == 2) {
        outdiv.style.display = "none";
    }
}
function makeHtml(){
    let vhtml = '';
    vhtml = vhtml + '<div id="config_contents">'
    vhtml = vhtml + '<div>'
    vhtml = vhtml + '    経過時間: <span id="elapsed">00:00</span>'
    vhtml = vhtml + '</div>'
    vhtml = vhtml + '<select id="sleep_timer">'
    vhtml = vhtml + '  <option value="0">OFF</option>'
    vhtml = vhtml + '  <option value="10">10分</option>'
    vhtml = vhtml + '  <option value="15">15分</option>'
    vhtml = vhtml + '  <option value="20">20分</option>'
    vhtml = vhtml + '  <option value="30">30分</option>'
    vhtml = vhtml + '  <option value="45">45分</option>'
    vhtml = vhtml + '  <option value="60">60分</option>'
    vhtml = vhtml + '</select>'
    vhtml = vhtml + '<select id="pattern">'
    vhtml = vhtml + '  <option value="0">連続再生</option>'
    vhtml = vhtml + '  <option value="1">ランダム再生</option>'
    vhtml = vhtml + '</select>'
    vhtml = vhtml + '</div>'
    return vhtml
}
  const newDiv = document.createElement("div");
  const newForm = document.createElement("div");
  const newCloseDiv = document.createElement("div");
  const newCloseButton = document.createElement("button");
  const newContents = document.createElement("div");
  //外枠設定
  newDiv.id = 'div_addframe';
  newDiv.style="display: none;";
  //内枠設定
  newForm.id = 'forms';
  //ボタン設定
  newCloseDiv.id = 'close_position'
  newCloseButton.id = 'close_button'
  newCloseButton.setAttribute('onclick', 'displaydiv(2)');
  newCloseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#434343"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>';
  //コンテンツ設定
  newContents.id = 'mod_contents';
  newContents.innerHTML = makeHtml();
  
  // テキストノードを新規作成した div に追加します

  newCloseDiv.appendChild(newCloseButton);
  newForm.appendChild(newCloseDiv);
  newForm.appendChild(newContents);
  newDiv.appendChild(newForm);

  // DOM に新しく作られた要素とその内容を追加します
  const currentDiv = document.body.firstChild;
  document.body.insertBefore(newDiv, currentDiv);
