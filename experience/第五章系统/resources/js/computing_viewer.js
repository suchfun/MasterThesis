function getTreeData() {
    var tree = [
        {
            text: "计算中心1",
            nodes: [
                {
                    text: "计算节点1"
                },
                {
                    text: "计算节点2"
                }
            ]
        },
        {
            text:"计算中心2"
        }
    ];

    return tree;
}

function createList() {
    $('#computing_list').treeview({data: getTreeData()});
}

$(document).ready(function() {
    createList();
    $('#computing_list').on('nodeSelected', function(event, node) {

    });
})