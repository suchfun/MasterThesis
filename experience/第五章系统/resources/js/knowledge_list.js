$(document).ready(function() {
    $("#new_knowledge_list").dataTable({
        data:data,
        columns:[
            { data: '知识ID' },
            { data: '源任务' },
            { data: '知识类别' },
            { data: '产生时间' }
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
    $("#knowledge_priceCompetition_list").dataTable({
        data:data,
        columns:[
            { data: '知识ID' },
            { data: '源任务' },
            { data: '知识类别' },
            { data: '竞价总额' }
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
    $("#knowledge_hot_list").dataTable({
        data:data,
        columns:[
            { data: '知识ID' },
            { data: '源任务' },
            { data: '知识类别' },
            { data: '使用次数' }
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
    })
});