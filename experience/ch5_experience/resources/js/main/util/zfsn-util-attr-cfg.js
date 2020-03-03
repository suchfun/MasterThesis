// 属性、样式设置工具类
var attrCfgUtil = {
	// 设置流程属性
	setCanvasAttr: function() {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").addClass("layui-show");
		// $('#processForm').my('remove');
		// var flowId = FLOW._base.flowId;
		var flowName = FLOW._base.flowName;
		var flowDescription = FLOW._base.flowDescription;
		var d = {flowName:flowName,flowDescription:flowDescription};
		var manifest = {
			data: { flowName:d.flowName,flowDescription:d.flowDescription},
			init: function ($node, runtime) {
				$node.html(
			    	'<div class="layui-form-item"  >' +
					'<label class="layui-form-label" style="text-align: left">发布者：</label>' +
					'<div class="layui-input-block" >' +
					'<label style="text-align: left">UESTCer</label>' +
					'</div>'+
					'<label class="layui-form-label" style="text-align: left">任务名称：</label>' +
					'<div class="layui-input-block" >' +
					'<input id="flowName" type="text" name="title" lay-verify="title" autocomplete="off" class="layui-input">' +
					'</div>'+
					'<label class="layui-form-label" style="text-align: left">任务描述：</label>' +
					'<div class="layui-input-block" >' +
					'<input id="flowDescription" type="text" name="title" lay-verify="title" autocomplete="off" class="layui-input">' +
					'</div>'+
					'<label class="layui-form-label" style="text-align: left">版本：</label>' +
					'<div class="layui-input-block" >' +
					'<label class="layui-form-label">v1</label>' +
					'</div>'+
					'</div>'

				);
			},
			ui: {
				'#flowName': {
					bind: function(data, value, $control) {
						var t = data.flowName;
						if (value != undefined) {
							t = value;
							FLOW._base.flowName = t;
						}
						return t;
					}
				},
				'#flowDescription': {
					bind: function(data, value, $control) {
						var t = data.flowDescription;
						if (value != undefined) {
							t = value;
							FLOW._base.flowDescription = t;
						}
						return t;
					}
				}
			}
		};
		$('#processForm').my( manifest, d );
	},
	// 设置节点属性、样式

	/*setNodeAttr: function(nodeId) {
		$('#attrForm').my('remove');

		// $("#"+nodeId).attr("param","1");
		var d = {
			textId: $('#' + nodeId).children(':first-child').text(),//节点名称
				textDataParam: $('#' + nodeId).attr("param")
            };

		console.log(d.textDataParam);
			var name = '<div class="layui-form-item" >' +
				'<label class="layui-form-label" style="text-align: left">名称：</label>' +
				'<div class="layui-input-block">' +
				'<input id="textId" type="text" name="title"  autocomplete="off" placeholder="请输入文本信息" class="layui-input">' +
				'</div>' +
				'</div>';
			var dataSource = '<div class="layui-form-item">' +
				'<label class="layui-form-label" style="text-align: left">数据源：</label>' +
				'<div style="margin-left:110px;min-height:36px">' +
				'<button type="button" id="choseData" class="btn  btn-success col-lg-12">选择数据源</button>' +
				'</div>' +
				'</div>';
			var parameter = '<div class="layui-form-item">' +
				'<label class="layui-form-label" style="text-align: left">模型参数：</label>' +
				'<div class="layui-input-block">' +
				'<input id="textDataParam" type="text" name="title"  autocomplete="off" placeholder="请输入模型参数" class="layui-input">' +
				'</div>' +
				'</div>';

		if(nodeId.charAt(0)=="T"){
			var manifest = {
				data: { textId: '' ,textDataParam:''},
				init: function ($node, runtime) {
					$node.html(
						name+parameter
					);
				},
				ui: {
					'#textId': {
						bind: function(data, value, $control) {
							var t = data.textId;
							if (value != undefined) {
								t = value;
								FLOW._base.graph.node(nodeId).text = t;
								$('#' + nodeId).children(':first-child').text(t);  //写入节点
							}
							return t;
						}
					},
					'#textDataParam': {
						bind: function(data, value, $control) {
							var t = data.textDataParam;
							if (value != undefined) {
								t = value;
								textDataParam: $('#' + nodeId).attr("param",t)
							}
							return t;
						}
					}
				}
			};
		}else if(nodeId.charAt(0)=="S"){
			var manifest = {
				data: { textId: '' },
				init: function ($node, runtime) {
					$node.html(
						name+dataSource
					);
				},
				ui: {
					'#textId': {
						bind: function(data, value, $control) {
							var t = data.textId;
							if (value != undefined) {
								t = value;
								FLOW._base.graph.node(nodeId).text = t;
								$('#' + nodeId).children(':first-child').text(t);
							}
							return t;
						}
					}
				}
			};
		}
		else{
			var manifest = {
				data: { textId: '' },
				init: function ($node, runtime) {
					$node.html(
						name
					);
				},
				ui: {
					'#textId': {
						bind: function(data, value, $control) {
							var t = data.textId;
							if (value != undefined) {
								t = value;
								FLOW._base.graph.node(nodeId).text = t;
								$('#' + nodeId).children(':first-child').text(t);
							}
							return t;
						}
					}
				}
			};
		}

		// console.log()
		/!*new Vue({
			el: '#'+nodeId,
			data:{
				name:"teemo"
			},

		});*!/
		$('#attrForm').my( manifest, d );

	},*/

	setStartNodeAttr:function(){
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#startNode").addClass("layui-show");
		/*var html =" <div class=\"layui-input-block\" >\n" +
			" <input  type=\"checkbox\" name=\"like[write]\" title=\"数据中心1\">\n" +
			"  </div>\n" +
			"  <div class=\"layui-input-block\">\n" +
			" <input type=\"checkbox\" name=\"like[read]\" title=\"数据中心2\">\n" +
			"   </div>\n" +
			" <div class=\"layui-input-block\">\n" +
			" <input type=\"checkbox\" name=\"like[dai]\" title=\"数据中心3\">\n" +
			"  </div>"
		// layui.form.render('checkbox');
		// form.render('checkbox');

		$("#startForm").html(html);
		layui.use('form', function(){
			var form = layui.form;
			form.render('checkbox');
		});
		console.log(1)*/

	},

	setEndNodeAttr:function(){
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#endNode").addClass("layui-show");
		/*var html = "<select name=\"city\" lay-verify=\"\">\n" +
			"  <option value=\"\">请选择结果输出方式</option>\n" +
			"  <option value=\"010\">本地保存</option>\n" +
			"  <option value=\"021\">推送</option>\n" +
			"</select>     ";
		$("#endForm").html(html);
		layui.use('form', function(){
			var form = layui.form;
			form.render('select');
		});*/

	},

	setPositionModelNodeAttr:function(){
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#positionModelNode").addClass("layui-show");
	},

	setPositionQueryNodeAttr:function () {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#positionQueryNode").addClass("layui-show");
		$("#positionQueryModelSelection").empty();
		//var test = {"选项1":"test","选项2":"test2","选项3":"ZW模型训练V1"};  //TODO 替换为ajax 读取json文件
		$.ajax({
			url: "/in_sute_demo/getQueryModel.do",
			type: "POST",
			dataType: "json",
			success: function (result) {
				var temp = result.res;
				var json = {};
				var a = 1;
				for(var i=0;i<temp.length;i++){
					if(temp[i].toString().substring(0,2)=="zw"){
						json["选项"+a] = temp[i].toString();
						a++;
					}
				}
					var server = document.getElementById("positionQueryModelSelection"); //server为select定义的id
                    for(var p in json){
							var option = document.createElement("option");  // 创建添加option属性
							option.setAttribute("value",p); // 给option的value添加值
							option.innerText=json[p];     // 打印option对应的纯文本
							server.appendChild(option);           //给select添加option子标签
							layui.form.render("select");            // 刷性select，显示出数据
						}
                    }
		});
	},

	setExceptionModelNodeAttr:function () {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#exceptionModelNode").addClass("layui-show");
	},

	setExceptionQueryNodeAttr:function () {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#exceptionQueryNode").addClass("layui-show");
		$.ajax({
			url: "/in_sute_demo/getQueryModel.do",
			type: "POST",
			dataType: "json",
			success: function (result) {
				var temp = result.res;
				var json = {};
				var a = 1;
				for(var i=0;i<temp.length;i++){
					if(temp[i].toString().substring(0,2)=="yc"){
						json["选项"+a] = temp[i].toString();
						a++;
					}
				}
				var server = document.getElementById("exceptionQueryModelSelection"); //server为select定义的id
				for(let p in json){
					let option = document.createElement("option");  // 创建添加option属性
					option.setAttribute("value",p); // 给option的value添加值
					option.innerText=json[p];     // 打印option对应的纯文本
					server.appendChild(option);           //给select添加option子标签
					layui.form.render("select");            // 刷性select，显示出数据
				}
			}
		});
	},

	setFlightQueryNodeAttr:function(){
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#flightQueryNode").addClass("layui-show");
	},

	setSimpleQueryNodeAttr:function () {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#simpleQueryNode").addClass("layui-show");
		$.ajax({
			url: "/in_sute_demo/getQueryModel.do",
			type: "POST",
			dataType: "json",
			success: function (result) {
				var temp = result.res;
				var json = {};
				var a = 1;
				for(var i=0;i<temp.length;i++){
					if(temp[i].toString().substring(0,2)=="zw"){
						json["选项"+a] = temp[i].toString();
						a++;
					}
				}
				var server = document.getElementById("simpleQueryModelSelection"); //server为select定义的id
				for(var p in json){
					var option = document.createElement("option");  // 创建添加option属性
					option.setAttribute("value",p); // 给option的value添加值
					option.innerText=json[p];     // 打印option对应的纯文本
					server.appendChild(option);           //给select添加option子标签
					layui.form.render("select");            // 刷性select，显示出数据
				}
			}
		});
	},

	setFilterNodeAttr:function () {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#filterNode").addClass("layui-show");
	},

	setContinueNodeAttr:function () {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#continueNode").addClass("layui-show");
	},

	setPositionRatioNodeAttr:function () {
		$(".common ").removeClass("layui-show");
		$(".businessNode").removeClass("layui-show");
		$("#process").removeClass("layui-show");
		$("#positionRatioQueryNode").addClass("layui-show");
		$.ajax({
			url: "/in_sute_demo/getQueryModel.do",
			type: "POST",
			dataType: "json",
			success: function (result) {
				var temp = result.res;
				var json = {};
				var a = 1;
				for(var i=0;i<temp.length;i++){
					if(temp[i].toString().substring(0,2)=="zw"){
						json["选项"+a] = temp[i].toString();
						a++;
					}
				}
				var server = document.getElementById("positionRationQueryModelSelection"); //server为select定义的id
				for(var p in json){
					var option = document.createElement("option");  // 创建添加option属性
					option.setAttribute("value",p); // 给option的value添加值
					option.innerText=json[p];     // 打印option对应的纯文本
					server.appendChild(option);           //给select添加option子标签
					layui.form.render("select");            // 刷性select，显示出数据
				}
			}
		});
	}
}

	// 设置连接线属性、样式
	/*setConnAttr: function(sourceId, targetId) {
		$('#attrForm').my('remove');
		var d = { connTextId: plumbUtil.getRouterLabel(sourceId, targetId)};
		var manifest = {
			data: { connTextId: '' },
			init: function ($node, runtime) {
				$node.html(
			    	'<div class="layui-form-item">' + 
						'<label class="layui-form-label">连线名称：</label>' + 
						'<div class="layui-input-block">' + 
							'<input id="connTextId" type="text" name="title" lay-verify="title" autocomplete="off" class="layui-input">' + 
						'</div>' + 
					'</div>'
				);
			},
			ui: {
				'#connTextId': {
					bind: function(data, value, $control) {
						var t = data.connTextId;
						if (value != undefined) {
							t = value;
							// 修改保存状态为未保存，将当前流程对象放入可撤销数组中
							$("#saveStatus").css('display', '');
							FLOW._base.undoStack.push(FLOW.getCurrentFlow());
							
							// 设置新文本
							plumbUtil.setRouterLabel(sourceId, targetId, t);
						}
						return t;
					}
				}
			}
		};
		$('#attrForm').my( manifest, d );
	},*/
	// 设置泳道属性、样式
	/*setLaneAttr: function(laneId, c) {
		$('#attrForm').my('remove');
		var laneObj = FLOW._base.laneObjs[laneId];
		var d = { laneNameId: laneObj.text };
		var manifest = {
			data: { laneNameId: '' },
			init: function ($node, runtime) {
				$node.html(
			    	'<div class="layui-form-item">' + 
						'<label class="layui-form-label">泳道名称：</label>' + 
						'<div class="layui-input-block">' + 
							'<input id="laneNameId" type="text" name="title" lay-verify="title" autocomplete="off" class="layui-input">' + 
						'</div>' + 
					'</div>'
				);
			},
			ui: {
				'#laneNameId': {
					bind: function(data, value, $control) {
						var t = data.laneNameId;
						if (value != undefined) {
							t = value;
							// 更新泳道对象
							laneObj.text = t;
							
							// 更新节点
							if (laneObj.nodeType == 'broadwiseLane') {
								var tempText = '', textArr = t.split('');
								for (i = 0; i < textArr.length; i++) {
									tempText += '<span style="display: block;">' + textArr[i] + '</span>';
								}
								$('#' + c).html(tempText);
								$('#' + c).css('line-height', ZFSN.getLaneLineHeight(t, $('#' + c).css('height')));
							} else {
								$('#' + c).html('<span>' + t + '</span>');
							}
						}
						return t;
					}
				}
			}
		};
		$('#attrForm').my( manifest, d );
	}*/


