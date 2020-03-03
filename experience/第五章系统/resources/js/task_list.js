function initList(data)
    {
		$("#incomplete_table").DataTable({
			destroy:true,
			data : data,
			columns : [ {
				data : '流程ID'
			}, {
				data : '发布者'
			}, {
				data : '任务名称'
			}, {
				data : '版本号'
			}
				// },{
				// 	data: 'taskId',visible: false
				// }
			],
			lengthMenu : [ 5, 10, 20, 30 ],
			searching : false,
			ordering : false,
			language : {
				paginate: {// 分页的样式内容。
					previous: "上一页",
					next: "下一页",
					first: "第一页",
					last: "最后"
				},
				info: " 总计 _TOTAL_个任务",
				lengthMenu:     "展示_MENU_ 条"
			},
			pagingType : "full_numbers"
		});
    	/*$("#incomplete_table").DataTable({
			destroy:true,
    		data : data,
			columns : [ {
				data : '任务类型'
			}, {
					data : '发起单位'
				}, {
				data : '当前状态'
			}, {
				data : '已执行时间'
			}, {
				data : '数据源数目'}
			// },{
			// 	data: 'taskId',visible: false
			// }
				],
			lengthMenu : [ 5, 10, 20, 30 ],
			searching : false,
			ordering : false,
			language : {
				paginate: {// 分页的样式内容。
					previous: "上一页",
					next: "下一页",
					first: "第一页",
					last: "最后"
				},
				info: " 总计 _TOTAL_个任务",
				lengthMenu:     "展示_MENU_ 条"
			},
			pagingType : "full_numbers"
		});
		$("#complete_table").DataTable({
			destroy:true,
			data : data2,
			columns : [  {
				data : '发起单位'
			}, {
				data : '完成时间'
			}, {
				data : '执行时长'
			}, {
				data : '知识产出数'
			},{
				data: 'taskId' ,visible: false
			} ],
			lengthMenu : [ 5, 10, 20, 30 ],
			searching : false,
			ordering : false,
			language : {
				paginate : {// 分页的样式内容。
					previous : "上一页",
					next : "下一页",
					first : "第一页",
					last : "最后"
				},
				info: " 总计 _TOTAL_个任务",
				lengthMenu:     "展示_MENU_ 条"
			},
			pagingType : "full_numbers"
		})*/
    }