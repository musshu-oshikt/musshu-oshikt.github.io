async function setSpreadsheet(csvUrl){
  let spl;
  if(csvUrl.indexOf('tsv') != -1){
    spl = '\t';
  }else{
    spl = ',';
  }
  return fetch(csvUrl)
    .then(response => {
      // ネットワークリクエストが成功したか確認
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // CSVデータをテキストとして取得
    })
    .then(csvText => {
      // CSVテキストをJSON形式に変換する処理
      const lines = csvText.split('\n'); // 行ごとに分割
      // 1行目をヘッダーとして扱う
      // .map(header => header.trim()) で各ヘッダーから余分な空白を取り除きます
      const headers = lines[0].split(spl).map(header => header.trim());
      const result = []; // 最終的なJSONデータが格納される配列
      // 2行目からデータを処理 (1行目はヘッダーなのでスキップ)
      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].trim(); // 現在の行から余分な空白を除去
        // 空行はスキップ
        if (currentLine === '') {
          continue;
        }
        const values = currentLine.split(spl).map(value => value.trim());
        const rowObject = {}; // 各行をオブジェクトとして格納
        // ヘッダーと値を使ってオブジェクトを作成
        for (let j = 0; j < headers.length; j++) {
          // ヘッダーが存在し、対応する値がある場合のみ格納
          if (headers[j]) {
            rowObject[headers[j]] = values[j] || ''; // 値がない場合は空文字列を設定
          }
        }
        result.push(rowObject); // 作成したオブジェクトを結果配列に追加
      }
      // 変換されたJSONデータをコンソールに表示
      return result;
    })
    .catch(error => {
      // エラーが発生した場合にコンソールに表示
      console.error("データの取得または処理中にエラーが発生しました:", error);
      return '';
    });
}