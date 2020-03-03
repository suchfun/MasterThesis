/*通过设置轮询来对全局数据进行实时更新*/
var setting = {
		url : "/in_sute_demo/flushOverallState.do",
		dateType : "json",
		success : function(result) {
			/*此处对应于gateway中的四个全局数据的id*/
			document.getElementById('center_num').innerText = result.OnlineTotal;
			document.getElementById('request_num').innerText = result.requestTotal;
			document.getElementById('bidding_amount').innerText = result.priceTotal;
			document.getElementById('system_utilization').innerText = result.systemUseingRate
					+ "%";

			/*此处用来判断系统占用率的大小，大于70时，将该行表格设置为红色*/
			if (parseInt(result.systemUseingRate) >= 70) {
				document.getElementById('state_4').setAttribute("class",
						"danger");
			} else
			{
				document.getElementById('state_4').setAttribute("class",
				"success");
			}
		}
	};
/*此处为轮询的核心，其中10000表示刷新频率*/
	window.setInterval(function() {
		$.ajax(setting)
	}, 1000);