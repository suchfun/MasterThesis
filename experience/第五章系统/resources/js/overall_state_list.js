$(document).ready(function() {
    $("#overall_state").dataTable({
        data:data,
        rows:[
            { data: '属地中心上线数/属地中心总数' },
            { data: '累计请求数' },
            { data: '竞价总额' },
            { data: '累计产生知识数' },
            { data: '系统利用率' }
        ],

        lengthMenu: [5, 10, 20, 30],
        searching: false,
        ordering: false,
        language: {
            paginate: {//分页的样式内容。
                previous: "上一页",
                next: "下一页",
                first: "第一页",
                last: "最后"
            }
        },
        pagingType: "full_numbers"
    });
    console("test");
});