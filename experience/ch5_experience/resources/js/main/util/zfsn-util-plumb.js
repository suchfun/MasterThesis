var plumbUtil = {
	_tempConnObj: {}, // 临时的连线对象
	// 实例化jsPlumb
	getInstance: function() {
		var _base = FLOW._base;
		
		// 1、获取实例，设置相关属性
		_base.plumb = jsPlumb.getInstance({
			/**
			 * 设置连线
			 * Bezier(贝塞尔曲线，默认)、Straight(直线)、Flowchart(流程图线)、StateMachine(状态线)
			 */
			Connector: [
				CONFIG.conn.connectionType, // 连线类型
				{
					gap: CONFIG.conn.connectionGap, // 连线到端点的距离
					cornerRadius: CONFIG.conn.connectionCornerRadius, // 连线圆角程度
					alwaysRespectStubs: CONFIG.conn.connectionAlwaysRespectStubs
				}
			],
			/**
			 * 给连线添加箭头，写在配置中的名字为 connectorOverlays，写在连接中的名字为 overlays
			 * location 0.5 表示箭头位于中间，location 1 表示箭头设置在连线末端。 一根连线是可以添加多个箭头的。
			 */
			ConnectionOverlays: [
				[
					'Arrow',
					{
						width: CONFIG.arrow.arrowWidth, 
						length: CONFIG.arrow.arrowLength, 
						location: CONFIG.arrow.arrowLocation
					}
				]
			],
			/**
			 * 设置连线样式
			 */
			PaintStyle: {
				stroke: CONFIG.conn.stroke, // 连线颜色
				strokeWidth: CONFIG.conn.strokeWidth // 连线粗细
			},
			/**
			 * 鼠标悬浮在连接线上的样式
			 */
			HoverPaintStyle: {
				stroke: CONFIG.conn.hoverConnStroke // 悬浮颜色
			},
			/**
			 * 设置端点样式
			 */
			EndpointStyle: {
				fill: CONFIG.endPonit.fill, // 填充色
				stroke: CONFIG.endPonit.stroke, // 外框色
				strokeWidth: CONFIG.endPonit.strokeWidth, // 外框厚度
				radius: CONFIG.endPonit.radius // 半径
			},
			/**
			 * 鼠标悬浮在端点上的样式
			 */
			EndpointHoverStyle: {
				fill: CONFIG.endPonit.hoverEndPointStroke // 悬浮颜色
			}
		});
		
		// 2、建立连接前触发
		_base.plumb.bind('beforeDrop', function(info) {
			var _base = FLOW._base;
			var sourceId = info.sourceId;
			var targetId = info.targetId;
			console.log($("#"+sourceId).offset());
			// 2.1、出现自连接直接断开
			if (sourceId == targetId) return false;
			//2.1.1 结束点不能作为输出点
			if(sourceId.charAt(0)=="E"){
				layer.tips(CONFIG.msg.wrongSource, ZFSN.getJQSel(sourceId), {
					tips: [2, '#23262e'],
					time: 1000
				});
				return  false;
			}
			//开始节点不能作为输入点
			if(targetId.charAt(0)=="S"){
				layer.tips(CONFIG.msg.wrongTarget, ZFSN.getJQSel(targetId), {
					tips: [2, '#23262e'],
					time: 1000
				});
				return  false;
			}

			// 2.2、相同两节点不能出现有方向的重复连接
			if (_base.graph.hasEdge(sourceId, targetId)) {
				layer.tips(CONFIG.msg.repeatRouter, ZFSN.getJQSel(sourceId), {
					tips: [2, '#23262e'],
					time: 1000
				});
				return false;
			}
			
			// 2.3、修改保存状态为未保存
			$("#saveStatus").css('display', '');
			
			// 2.4、将当前流程图push到撤销栈
			_base.undoStack.push(FLOW.getCurrentFlow());
			
			// 2.5、从id池中拿连线id
			var connId = idPoolUtil.getNextNodeId('R');
			
			// 2.6、连接之前赋值临时的连线对象，用于连线后触发plumb绑定的connection事件
			plumbUtil._tempConnObj.sourceId = sourceId;
			plumbUtil._tempConnObj.targetId = targetId;
			plumbUtil._tempConnObj.routerId = connId;
			
			// 2.7、将连线记录到图对象中
			var sourceEndPointId = sourceId + '-' + ZFSN.getUUID();
			var targetEndPointId = targetId + '-' + ZFSN.getUUID();
			var sourceAnchors = CONFIG.anchors.defaultAnchors;
			var targetAnchors = CONFIG.anchors.defaultAnchors;
			var edge = new graphUtil.Edge(connId, sourceEndPointId, targetEndPointId, sourceAnchors, targetAnchors);
			graphUtil.addEdge(sourceId, targetId, edge);
			
			return true;
		});
		
		// 3、建立连接后触发
		_base.plumb.bind('connection', function(connObj, b) {
			var o = plumbUtil._tempConnObj;
			var selector = ZFSN.getJQSel(o.routerId);
			console.log($("#"+o.sourceId).offset());
			console.log($("#"+o.targetId).offset());
			// 3.1、连线id
			connObj.connection.canvas.id = o.routerId;
			
			// 3.2、存储源节点和目标节点的id
			$(selector).attr('sourceId', o.sourceId);
			$(selector).attr('targetId', o.targetId);
			
			// 3.3、监听连线事件（例如单击连线）
			window.ContextMenu.bind(selector, connectionMenuJson);
			$(selector).click(function(event) {
				console.log(1);
				event = document.all ? window.event : arguments[0] ? arguments[0] : event;
				event.stopPropagation();
				// attrCfgUtil.setConnAttr($(selector).attr('sourceId'), $(selector).attr('targetId'));
			});
			
			// 3.4、记录连线id
			idPoolUtil.recordNodeId(o.routerId);
		});

		
		// 4、设置连接是否可以被拉断
		_base.plumb.importDefaults({
			ConnectionsDetachable: CONFIG.conn.isDetachable
		});
	},
	// 给节点添加端点，返回端点id
	addEndPoint: function(nodeId, anchors) {
		var _base = FLOW._base;
		var endPointId = nodeId + '-' + ZFSN.getUUID();
		
		ZFSN.lazyExecute(function() {
			_base.plumb.addEndpoint(nodeId, {
				uuid: endPointId,
				anchors: anchors
			});
		});
		
		return endPointId;
	},
	// 连接两个节点
	connectNode: function(sourceId, targetId, routerId, sourceAnchors, targetAnchors) {
		var _base = FLOW._base;

		// 1、新增端点，一条连接线两个端点
		var sourceEndPointId = plumbUtil.addEndPoint(sourceId, sourceAnchors);
		var targetEndPointId = plumbUtil.addEndPoint(targetId, targetAnchors);

		// 2、连接
		ZFSN.lazyExecute(function () {
			// 2.1、连接之前赋值临时的连线对象，用于连线后触发plumb绑定的connection事件
			plumbUtil._tempConnObj.sourceId = sourceId;
			plumbUtil._tempConnObj.targetId = targetId;
			plumbUtil._tempConnObj.routerId = routerId;

			// 2.2、连线
			_base.plumb.connect({
				// 通过编码连接endPoint，连线不会混乱
				uuids: [sourceEndPointId, targetEndPointId]
				// 源节点
				//source: id1,
				// 目标节点
				//target: id2,
				// 端点
				//endpoint: 'Rectangle'
			});
		});

		// 3、将连线添加到图对象中
		var edge = new graphUtil.Edge(routerId, sourceEndPointId, targetEndPointId, sourceAnchors, targetAnchors);
		graphUtil.addEdge(sourceId, targetId, edge);
		console.log(sourceId);
	},

	// 连接两个节点(映射)
	connectFlowNode: function(sourceId, targetId, routerId, sourceAnchors, targetAnchors) {
		var _base = FLOW._base;

		// 1、新增端点，一条连接线两个端点
		var sourceEndPointId = plumbUtil.addEndPoint(sourceId, sourceAnchors);
		var targetEndPointId = plumbUtil.addEndPoint(targetId, targetAnchors);

		// 2、连接
		ZFSN.lazyExecute(function () {
			// 2.1、连接之前赋值临时的连线对象，用于连线后触发plumb绑定的connection事件
			plumbUtil._tempConnObj.sourceId = sourceId;
			plumbUtil._tempConnObj.targetId = targetId;
			plumbUtil._tempConnObj.routerId = routerId;

			// 2.2、连线
			_base.plumb.connect({
				// 通过编码连接endPoint，连线不会混乱
				uuids: [sourceEndPointId, targetEndPointId]
				// 源节点
				//source: id1,
				// 目标节点
				//target: id2,
				// 端点
				//endpoint: 'Rectangle'
			});
		});

		// 3、将连线添加到图对象中
		var edge = new graphUtil.Edge(routerId, sourceEndPointId, targetEndPointId, sourceAnchors, targetAnchors);
		graphUtil.addEdge(sourceId, targetId, edge);
		console.log(sourceId);
	},

	// 设置节点可以被移动,监听移动过程，实时更新位置
	setNodeDraggable: function(nodeId) {
		var scrollX;
		var scrollY;
		var _base = FLOW._base;
		
		ZFSN.lazyExecute(function() {
			_base.plumb.draggable(nodeId, {
				filter:".enableDraggable",
				containment: 'parent',
				// grid: [10, 10],
				// 拖拽前记录当前的流程文档对象
				start: function() {
					_base.undoStack.push(FLOW.getCurrentFlow());
				},
				// 拖拽过程中实时更新节点位置
				drag: function(event) {
					// canvasId的相对位置
					var canvasX = $('#canvasId').offset().left;
					var canvasY = $('#canvasId').offset().top;
					// 当前滚动条位置
					scrollX = $('#canvasId').scrollLeft();
					scrollY = $('#canvasId').scrollTop();
					if (!_base.selectedMultipleFlag) {
						layer.tips('X: ' + parseInt($('#' + event.el.id).offset().left - canvasX + scrollX) + '  Y: ' + parseInt($('#' + event.el.id).offset().top - canvasY + scrollY), ZFSN.getJQSel(event.el.id), {
							tips: [1, '#23262e'],
							time: 2000
						});
					}
				},
				// 拖拽结束后更新图对象中存储的节点位置
				stop: function(event) {
					// 更新图对象
					var id = event.el.id;

					console.log("top:"+$('#' + id).offset().top+"left:"+$('#' + id).offset().left);

					var x = $('#' + id).offset().left + scrollX;
					var y = $('#' + id).offset().top + scrollY;
					var node = _base.graph.node(ZFSN.removeJQSel(id));
					node.locLeft = x;
					node.locTop = y;
					graphUtil.updateNode(id);
				}
			});
		});
	},
	// 允许节点被移动
	ableDraggable: function(nodeId) {
		var _base = FLOW._base;
		var flag = _base.plumb.toggleDraggable(nodeId);
		if (!flag) {
			_base.plumb.toggleDraggable(nodeId);
		}
	},
	// 禁止节点被移动
	unableDraggable: function(nodeId) {
		var _base = FLOW._base;
		var flag = _base.plumb.toggleDraggable(nodeId);
		if (flag) {
			_base.plumb.toggleDraggable(nodeId);
		}
	},
	// 获取连线文本
	getRouterLabel: function(sourceId, targetId) {
		var _base = FLOW._base;
		
		var routerLabel = _base.plumb.getConnections({
			source: ZFSN.removeJQSel(sourceId),
			target: ZFSN.removeJQSel(targetId)
		})[0].getLabel();
		if (strUtil.isBlank(routerLabel)) return '';
		return routerLabel;
	},
	// 设置连线文本
	setRouterLabel: function(sourceId, targetId, label) {
		var _base = FLOW._base;
		
		ZFSN.lazyExecute(function() {
			if (strUtil.isNotBlank(label)) {
				// 文本不为空
				_base.plumb.getConnections({
					source: sourceId,
					target: targetId
				})[0].setLabel({
					label: label, 
					cssClass: 'labelClass'
				});
			} else {
				// 1、文本为空，首先获取连接
				var c = _base.plumb.getConnections({
					source: ZFSN.removeJQSel(sourceId),
					target: ZFSN.removeJQSel(targetId)
				})[0];
				
				// 2、获取文本覆盖物，判断是否存在，存在时移除文本覆盖物
				var labelOverlay = c.getLabelOverlay();
				if (labelOverlay != undefined) {
					c.removeOverlay(labelOverlay.id);
				}
			}
		});
	},
	// 对齐方式检查
	alignWayCheck: function() {
		var _base = FLOW._base;
		
		// 1、检查选中的节点个数是否大于等于2
		if (_base.selectedNodeList.length < 2) {
			layer.msg(CONFIG.msg.alignWayCheck, { icon: 5 });
			return null;
		}
		return _base.selectedNodeList;
	},
	// 左对齐
	leftAlign: function(selectedNodeIdArr) {
		var _base = FLOW._base;
		
		// 1、第一个选中的节点的初始值，其余节点以此为基准
		var topCount = parseInt($('#' + selectedNodeIdArr[0]).css('top'));
		var leftCount = parseInt($('#' + selectedNodeIdArr[0]).css('left'));
		
		// 2、对齐被选中的节点
		for (var i = 1; i < selectedNodeIdArr.length; i++) {
			// 下一个节点的 top 是上一个节点的 top 加上上一个节点的 height 加上垂直间距
			topCount = topCount + parseInt($('#' + selectedNodeIdArr[i - 1]).css('height')) + CONFIG.alignParam.verticalDistance;
			// 下一个节点的 left 是第一个节点的 left
			// leftCount = leftCount;
			// 动画效果移动节点到 topCount、leftCount 的位置，动画持续时间为 500ms
			_base.plumb.animate(selectedNodeIdArr[i], { top: topCount, left: leftCount }, { duration: CONFIG.alignParam.alignDuration } );
		}
	},
	// 垂直居中
	verticalCenter: function(selectedNodeIdArr) {
		var _base = FLOW._base;
		
		// 1、第一个选中的节点的初始值，其余节点以此为基准
		var topCount = parseInt($('#' + selectedNodeIdArr[0]).css('top'));
		var leftCount = parseInt($('#' + selectedNodeIdArr[0]).css('left'));
		var leftTemp = leftCount;
		
		// 2、对齐被选中的节点
		for (var i = 1; i < selectedNodeIdArr.length; i++) {
			// 下一个节点的 top 是上一个节点的 top 加上上一个节点的 height 加上垂直间距
			topCount = topCount + parseInt($('#' + selectedNodeIdArr[i - 1]).css('height')) + CONFIG.alignParam.verticalDistance;
			// 下一个节点的 left 是第一个节点的 width 减去下一个节点的 width 的一半加上第一个节点的left
			leftCount = leftTemp + (parseInt($('#' + selectedNodeIdArr[0]).css('width')) - parseInt($('#' + selectedNodeIdArr[i]).css('width'))) / 2;
			// 动画效果移动节点到 topCount、leftCount 的位置，动画持续时间为 500ms
			_base.plumb.animate(selectedNodeIdArr[i], { top: topCount, left: leftCount }, { duration: CONFIG.alignParam.alignDuration } );
		}
	},
	// 右对齐
	rightAlign: function(selectedNodeIdArr) {
		var _base = FLOW._base;
		
		// 1、第一个选中的节点的初始值，其余节点以此为基准
		var topCount = parseInt($('#' + selectedNodeIdArr[0]).css('top'));
		var leftCount = parseInt($('#' + selectedNodeIdArr[0]).css('left'));
		var leftCountTemp = leftCount;
		
		// 2、对齐被选中的节点
		for (var i = 1; i < selectedNodeIdArr.length; i++) {
			// 下一个节点的 top 是上一个节点的 top 加上上一个节点的 height 加上垂直间距
			topCount = topCount + parseInt($('#' + selectedNodeIdArr[i - 1]).css('height')) + CONFIG.alignParam.verticalDistance;
			// 下一个节点的 left 是第一个节点的 left 加上第一个节点的 width 减去下一个节点的 width
			leftCount = leftCountTemp + (parseInt($('#' + selectedNodeIdArr[0]).css('width')) - parseInt($('#' + selectedNodeIdArr[i]).css('width')));
			// 动画效果移动节点到 topCount、leftCount 的位置，动画持续时间为 500ms
			_base.plumb.animate(selectedNodeIdArr[i], { top: topCount, left: leftCount }, { duration: CONFIG.alignParam.alignDuration } );
		}
	},
	// 上对齐
	upAlign: function(selectedNodeIdArr) {
		var _base = FLOW._base;
		
		// 1、第一个选中的节点的初始值，其余节点以此为基准
		var topCount = parseInt($('#' + selectedNodeIdArr[0]).css('top'));
		var leftCount = parseInt($('#' + selectedNodeIdArr[0]).css('left'));
		
		// 2、对齐被选中的节点
		for (var i = 1; i < selectedNodeIdArr.length; i++) {
			// 下一个节点的 top 是第一个节点的 top
			// topCount = topCount;
			// 下一个节点的 left 是上一个节点的 left 加上一个节点的 width 加上水平间距
			leftCount = leftCount + parseInt($('#' + selectedNodeIdArr[i - 1]).css('width')) + CONFIG.alignParam.levelDistance;
			// 动画效果移动节点到 topCount、leftCount 的位置，动画持续时间为 500ms
			_base.plumb.animate(selectedNodeIdArr[i], { top: topCount, left: leftCount }, { duration: CONFIG.alignParam.alignDuration } );
		}
	},
	// 水平居中
	levelAlign: function(selectedNodeIdArr) {
		var _base = FLOW._base;
		
		// 1、第一个选中的节点的初始值，其余节点以此为基准
		var topCount = parseInt($('#' + selectedNodeIdArr[0]).css('top'));
		var topCountTemp = topCount;
		var leftCount = parseInt($('#' + selectedNodeIdArr[0]).css('left'));
		
		// 2、对齐被选中的节点
		for (var i = 1; i < selectedNodeIdArr.length; i++) {
			// 下一个节点的 top 是第一个节点的 height 减去下一个节点的 height 的一半加上第一个节点的top
			topCount = topCountTemp + (parseInt($('#' + selectedNodeIdArr[0]).css('height')) - parseInt($('#' + selectedNodeIdArr[i]).css('height'))) / 2;
			// 下一个节点的 left 是上一个节点的 left 加上上一个节点的 width 加上水平间距
			leftCount = leftCount + parseInt($('#' + selectedNodeIdArr[i - 1]).css('width')) + CONFIG.alignParam.levelDistance;
			// 动画效果移动节点到 topCount、leftCount 的位置，动画持续时间为 500ms
			_base.plumb.animate(selectedNodeIdArr[i], { top: topCount, left: leftCount }, { duration: CONFIG.alignParam.alignDuration } );
		}
	},
	// 下对齐
	downAlign: function(selectedNodeIdArr) {
		var _base = FLOW._base;
		
		// 1、第一个选中的节点的初始值，其余节点以此为基准
		var topCount = parseInt($('#' + selectedNodeIdArr[0]).css('top'));
		var topCountTemp = topCount;
		var leftCount = parseInt($('#' + selectedNodeIdArr[0]).css('left'));
		
		// 2、对齐被选中的节点
		for (var i = 1; i < selectedNodeIdArr.length; i++) {
			// 下一个节点的 top 是第一个节点的 top 加上第一个节点的 height 减去下一个节点的 height
			topCount = topCountTemp + (parseInt($('#' + selectedNodeIdArr[0]).css('height')) - parseInt($('#' + selectedNodeIdArr[i]).css('height')));
			// 下一个节点的 left 是上一个节点的 left 加上一个节点的 width 加上水平间距
			leftCount = leftCount + parseInt($('#' + selectedNodeIdArr[i - 1]).css('width')) + CONFIG.alignParam.levelDistance;
			// 动画效果移动节点到 topCount、leftCount 的位置，动画持续时间为 500ms
			_base.plumb.animate(selectedNodeIdArr[i], { top: topCount, left: leftCount }, { duration: CONFIG.alignParam.alignDuration } );
		}
	},
	// 设置节点可以被缩放
	nodeResizable: function(id) {
		var _base = FLOW._base;
		id = ZFSN.getJQSel(id);
		
		$(id).resizable({
			// 设置允许元素调整的最小高度
			minHeight: 50,
			// 设置允许元素调整的最小宽度
			minWidth: 100,
			// 设置允许元素调整的最大高度
			//maxHeight: 300,
			// 设置允许元素调整的最大宽度
			//maxWidth: 600,
			// 缩放时保持纵横比
			//aspectRatio: 1/1,
			// 缩放时的动画
			animate: true,
			//动画效果种类
			animateEasing: 'easeOutElastic',
			//动画效果持续时间
			animateDuration: 500,
			//缩放时的视觉反馈
			ghost: true,
			//默认隐藏掉可调整大小的手柄，除非鼠标移至元素上
			autoHide: true,
			//缩放结束后需要重新设置节点文字样式、重绘流程图，这个地方需要用到计时器，等动画结束之后重绘。更新图对象
			stop: function(event, ui) {
				var $this = $(this);
				setTimeout(function() {
					$this.css('line-height', $this.css('height'));
					repaintAll();
					// 更新图对象
					graphUtil.updateNode($this.attr('id'));
				}, 510);
			}
		});
		
		//设置节点可缩放后样式被改成了 relative，这里需要再次设置为 absolute
		$(id).css('position', 'absolute');
	},
	// 设置泳道可被缩放
	laneResizable: function(id) {
		var _base = FLOW._base;
		id = ZFSN.getJQSel(id);
		
		$(id).resizable({
			// 设置允许元素调整的最小高度
			minHeight: 150,
			// 设置允许元素调整的最小宽度
			minWidth: 200,
			// 设置允许元素调整的最大高度
			// maxHeight: 300,
			// 设置允许元素调整的最大宽度
			// maxWidth: 600,
			// 缩放时保持纵横比
			// aspectRatio: 1/1,
			// 缩放时的动画
			animate: true,
			// 动画效果种类
			animateEasing: 'easeOutElastic',
			// 动画效果持续时间
			animateDuration: 300,
			// 缩放时的视觉反馈
			ghost: true,
			// 默认隐藏掉可调整大小的手柄，除非鼠标移至元素上
			autoHide: true,
			// 缩放开始时设置两个值防止缩放过程中出现多选框
			start: function(event, ui) {
				px = '';
				py = '';
			},
			// 缩放结束后需要重新设置节点文字样式、重绘流程图，这个地方需要用到计时器，等动画结束之后重绘。更新泳道对象
			stop: function(event, ui) {
				var $this = $(this);
				var thisChildId = $this.children(':first-child')[0].id;
				var thisGraphNode = _base.laneObjs[$this.attr('id')];
				setTimeout(function() {
					if (thisGraphNode.nodeType == 'broadwiseLane') {
						$(ZFSN.getJQSel(thisChildId)).css({
							'height': parseInt($this.css('height')) - 3,
							'line-height': ZFSN.getLaneLineHeight(thisGraphNode.text, $('#' + thisChildId).css('height'))
						});
					}
					// 更新泳道对象
					graphUtil.updateLaneObjs($this.attr('id'));
				}, 310);
			}
		});
		
		// 设置节点可缩放后样式被改成了 relative，这里需要再次设置为 absolute
		$(id).css('position', 'absolute');
	}
}
