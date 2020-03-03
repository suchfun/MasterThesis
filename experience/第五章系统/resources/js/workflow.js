jsPlumb.ready(function() {


    var instance = get_plum_instance();
    $('#tree_viewer').treeview({data: getTreeData()});
    $('.list-group-item').attr('draggable','true').on('dragstart', function(ev){
        // ev.dataTransfer.setData("text", ev.target.id);
        ev.originalEvent.dataTransfer.setData('text',ev.target.textContent);
        console.log('drag start');
    });  //dragging

    $('#workflow_viewer').on('drop', function(ev){

        //avoid event conlict for jsPlumb
        if (ev.target.className.indexOf('_jsPlumb') >= 0 ) {
            return;
        }

        ev.preventDefault();
        var mx = '' + ev.originalEvent.offsetX + 'px';
        var my = '' + ev.originalEvent.offsetY + 'px';

        console.log('on drop : ' + ev.originalEvent.dataTransfer.getData('text'));
        var uid = new Date().getTime();
        // var uid = 0;
        var node = add_Node('workflow','node' + uid, 'node', {x:mx,y:my});
        add_Ports(instance, node, ['out1'],'output');
        add_Ports(instance, node, ['in1','in2'],'input');
        instance.draggable($(node));
    }).on('dragover', function(ev){
        ev.preventDefault();
        console.log('on drag over');
    });
    // var node1 = add_node('workflow','node1', 'node1', {x:'80px',y:'20px'});
    // var node2 = add_node('workflow','node2', 'node2', {x:'280px',y:'20px'});
    // instance.draggable($('.node'));
    // add_ports(instance, node1, ['out1','out2'], 'output');
    // add_ports(instance, node2, ['in','in1','in2'], 'input');
    //
    // connect_ports(instance, node1, 'out2', node2, 'in');
    instance.doWhileSuspended(function() {
        var color = "#E8C870";
        // declare some common values:
        var arrowCommon = { foldback:0.8, fillStyle:color, width:5 },
            // use three-arg spec to create two different arrows with the common values:
            overlays = [
                [ "Arrow", { location:0.8 }, arrowCommon ],
                [ "Arrow", { location:0.2, direction:-1 }, arrowCommon ]
            ];

        var node1 = add_Node('workflow','node1', 'node1', {x:'80px',y:'20px'});
        var node2 = add_Node('workflow','node2', 'node2', {x:'280px',y:'20px'});

        add_Ports(instance, node1, ['out1','out2','out3'],'output');
        add_Ports(instance, node2, ['in',],'input');

        connect_ports(instance, node1, 'out2', node2, 'in');

        instance.draggable($('.node'));

    });
});

function getTreeData() {
    var tree = [
        {
            text: "Nodes",
            nodes: [
                {
                    text: "Node1"
                },
                {
                    text: "Node2"
                }
            ]
        }
    ];

    return tree;
}

function get_plum_instance() {
    var color = "#E8C870";
    var instance = jsPlumb.getInstance({
        Connector : [ "Bezier", { curviness:50 } ],
        DragOptions : { cursor: "pointer", zIndex:2000 },
        PaintStyle : { stroke:color, lineWidth:4 },
        EndpointStyle : { radius:5, fill:color },
        HoverPaintStyle : {stroke:"#7073EB" },  //鼠标悬浮时的颜色
        EndpointHoverStyle : {fill:"#7073EB" }, //同上类似
        Container:"workflow_viewer"
    });
    return instance;
}

function add_Node(parent_id, node_id, node_label, position) {
    var panel = $("#" + parent_id);
    var node = $("<div></div>")  //动态创建div
                .css('width','120px')
                .css('height','50px')
                .css('position','absolute ')
                .css('top',position.y)
                .css('left',position.x)
                .css('border','2px#9DFFCA solid')
                .attr('align','center')
                .attr('id',node_id)
                .attr('name',node_label)
                // .addClass('node table')
                .addClass('node')
    var name = $("<div></div>")
                .addClass('name')
                .text(node_label);

    node.append(name);
    panel.append(node);
    return $('#' + node_id);

}

/*function add_Ports(instance, node, ports, type) {
    //Assume horizental layout
    var number_of_ports = ports.length;

    // $("#"+node).attr("input",ports.length);
    if(type=='input'){
    $(node).attr("input",ports.length.toString());
    }else if(type=='output'){
        $(node).attr("output",ports.length.toString());
    }
    //var height = $(node).height();  //Note, jquery does not include border for height
    var y_offset = 1 / ( number_of_ports + 1);
    var y = 0;

    for (i = 0; i < number_of_ports; i++) {
        var anchor = [0,0,0,0];
        var paintStyle = { radius:5, fill:'#FF8891' };
        var isSource = false, isTarget = false; //输入、输出
        if ( type === 'output' ) {
            // $("#"+node).attr('output',ports.length.toString());
            anchor[0] = 1;
            paintStyle.fill = '#D4FFD6';
            isSource = true;
        } else {
            // $("#"+node).attr('input',ports.length.toString());
            isTarget = true;
        }
        anchor[1] = y + y_offset;
        y = anchor[1];
        instance.addEndpoint(node, {
            uuid: $(node).attr("id") + "-" + ports[i],
            paintStyle: paintStyle,
            anchor:anchor,
            maxConnections:-1,
            isSource:isSource,
            isTarget:isTarget
        });
    }


}*/

function connect_ports(instance, node1, port1, node2 , port2) {
    // declare some common values:
    var color = "gray";
    var arrowCommon = { foldback:0.8, fillStyle:color, width:5 },
    // use three-arg spec to create two different arrows with the common values:
    overlays = [["Arrow", { location:0.8 }, arrowCommon ],
                [ "Arrow", { location:0.2, direction:-1 }, arrowCommon ]];

    var uuid_source = $(node1).attr("id") + "-" + port1;
    var uuid_target = $(node2).attr("id") + "-" + port2;

    instance.connect({uuids:[uuid_source, uuid_target]});

}
