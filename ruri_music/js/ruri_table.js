let videoIdList = [];

function func_title(i_data){
    let imgs = `<img width="80" height="60" src="https://i.ytimg.com/vi/${i_data.videoid}/default.jpg" loading="lazy" class="img_middle">`
    let titles = `<input type="text" value="${i_data.musictitle}" readonly/>`
    let singer = `<input type="text" value="${i_data.singer}" readonly/>`
    let artists = `<input type="text" value="${i_data.artist}" readonly/>`
    let div_info = '<div class="play_column"><div>'+ imgs +'</div>' + '<div class="play_info">'+ titles + artists + singer +'</div></div>'
    return div_info
}
let option = {
    ajax: {
        dataSrc: '',
        type: 'GET',
        url: 'https://nijiuta.shop/api/utawaku/',
        data: function(d) {
            d.q = '栞葉るり';
//                d.tags = tags;
//                d.filters = filters;
            }
        },
        columns:[
            {'data':'id'},
            {'data':'musictitle'},
            {'data':null
            ,render:function(data, type, row){
                return func_title(data)
            }}
            ],
        createdRow: function(row, data, dataIndex) {
            // 各 <tr> タグにカスタム属性を追加
            $(row).attr('id', 'row-' + data.id);
            $(row).attr('data-video-id', data.videoid);
            $(row).attr('data-start', data.time_s);
            $(row).attr('data-end', data.time_e);
        },
        language: {
            search: "リスト内検索:",
        },
        scrollY: 500,
        scrollX: false,
        paging: false,
        columnDefs:[{targets: 0 ,visible: false},{targets: 1 ,visible: false}],
        initComplete: function() {
            $('#playlist-table tbody tr').each(function() {
                videoIdList.push($(this).attr('id'));
            });
//            console.log('videoIdList:', videoIdList);
        }
    };
$('#playlist-table').DataTable(option);