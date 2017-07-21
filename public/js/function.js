/**
 * @Type	: Functional File
 * @Brief	: 提供功能支持
 * @Author	: 林晓州
 * @Date	: 2017.07.20
 */

/* -------------------------------------------------- 启动 ------------------------------------------------ */
jQuery(document).ready(function($) {
	_Build_Database();
	_Prepare_PageInfo();
});



/* -------------------------------------------------- 数据处理 ------------------------------------------------ */
/*  
 * 全局变量
 */
var OL_TickectInfo_Cache = null;

var OL_StationData = null;
var OL_StationData_Pinyin = new Array();
var OL_StationData_Zhongwen = new Array();

/*  
 * 数据构造
 */
function _Build_Database() {
	OL_StationData = StationData.data;
	OL_StationData_Pinyin = StationData.name;

	OL_StationData_Zhongwen.length = 0;
	for(var i=0; i<OL_StationData_Pinyin.length; i++) {
		var py = OL_StationData_Pinyin[i];
		var zw = OL_StationData[py].name;
		OL_StationData_Zhongwen.push(zw)
	}
}

/*  
 * 根据中文名称获取火车站代码
 */
function _Get_tCode(zw) {
	if(!zw) {
		return null;
	}

	for(var i=0; i<OL_StationData_Zhongwen.length; i++) {
		if(OL_StationData_Zhongwen[i] == zw) {
			var py = OL_StationData_Pinyin[i];
			return OL_StationData[py].code;
		}
	}

	return null;
}
/*  
 * 根据拼音获取火车站代码
 */
function _Get_tCode_PY(py) {
	if(!py) {
		return null;
	}

	py = py.toLowerCase();
	var code = null;
	var _tmp = OL_StationData[py];
	if(!_tmp) {
		return null;
	}
	if(_tmp.code) {
		code = OL_StationData[py].code;
	}
	return code;
}



/*  
 * 查找字符串（中文站名）
 */
function _Search_Key_CN(zw) {
	if(!zw) {
		return [];
	}
	var arr = new Array();
	for(var i=0; i<OL_StationData_Zhongwen.length; i++) {
		if(-1 != OL_StationData_Zhongwen[i].indexOf(zw)) {
			var py = OL_StationData_Pinyin[i];
			if(OL_StationData[py]) {
				arr.push(OL_StationData[py])
			}
		}
	}
	return arr;
}
/*  
 * 查找字符串（英文站名）
 */
function _Search_Key_PY(_py) {
	if(!_py) {
		return [];
	}

	_py = _py.toLowerCase();
	var arr = new Array();
	for(var i=0; i<OL_StationData_Pinyin.length; i++) {
		if(-1 != OL_StationData_Pinyin[i].indexOf(_py)) {
			var py = OL_StationData_Pinyin[i];
			if(OL_StationData[py]) {
				arr.push(OL_StationData[py])
			}
		}
	}
	return arr;
}

/*  
 * 根据火车编号查询列车信息
 */
function _Get_Data_tNo(tNo) {
	if(!tNo) {
		return null;
	}
	for(var i=0; i<OL_TickectInfo_Cache.length; i++) {
		if(OL_TickectInfo_Cache[i].train_no == tNo) {
			return OL_TickectInfo_Cache[i];
		}
	}
	return null;

}




/* -------------------------------------------------- 页面 ------------------------------------------------ */
var _Md_Table = '<table class="table table-hover table-sm table-bordered"><thead><tr class="bg-primary text-center"><th>车次</th><th>起止站</th><th>发车</th><th>到达</th><th>商务</th><th>一等</th><th>二等</th><th>动卧</th><th>软卧</th><th>硬卧</th><th>软座</th><th>硬座</th><th>无座</th></tr></thead><tbody>##BODY##</tbody></table>';
var _Md_Table2 = '<table class="table table-hover table-sm table-bordered"><thead><tr class="bg-primary text-center"><th>车序</th><th>站名</th><th>到站</th><th>出发</th><th>停靠</th></tr></thead><tbody>##BODY##</tbody></table>';
	
function _Prepare_PageInfo() {
	$("#ol_tt_date").val(_get_standard_date_string());
}

function _Color_Tickect_Number(num) {
	if(!num) {
		return "<span class='text-muted'>-</span>"
	}
	if("无"==num) {
		return "<span class='text-muted'>无</span>"
	}

	if("有" == num) {
		return "<span style='font-weight:bold; color:#5cb85c;'>"+num+"</span>"
	}
	else {
		return "<span style='font-weight:bold;'>"+num+"</span>"
	}
}


function _Render_Query_Result(data) {
	if(!data) {
		alert("返回数据错误！")
		return;
	}
	
	var list = "";
	for(var i=0; i<data.length; i++) {
		list += "<tr class='text-center' style='cursor:pointer;' onclick=\"OL_TrainTickets.findStations('"+data[i].train_no+"')\">"
					+ "<td><strong>"+data[i].tId+"</strong></td>"
					+ "<td>"+data[i].fSation+" - "+data[i].tSation+"</td>"
					+ "<td>"+data[i].sTime+"</td>"
					+ "<td>"+data[i].eTime+"</td>"

					+ "<td>"+_Color_Tickect_Number(data[i].bcSeat)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].fcSeat)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].scSeat)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].dongwo)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].ruanwo)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].yingwo)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].ruanzuo)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].yingzuo)+"</td>"
					+ "<td>"+_Color_Tickect_Number(data[i].wuzuo)+"</td>"
				+"</tr>";
	}

	if(0 >= data.length) {
		list = "<p class='text-muted'>没有符合条件的车次</p>";
	}
	else {
		list = _Md_Table.replace("##BODY##", list)
	}
	$("#ol_tt_result").html(list);
}


function _Render_StationsList_Result(data) {
	if(!data) {
		alert("返回数据错误！")
		return;
	}
	
	var tId = data[0].station_train_code;
	var list = "";
	for(var i=0; i<data.length; i++) {
		list += "<tr class='text-center'>"
					+ "<td><strong>"+data[i].station_no+"</strong></td>"
					+ "<td>"+data[i].station_name+"</td>"
					+ "<td>"+data[i].arrive_time+"</td>"
					+ "<td>"+data[i].start_time+"</td>"
					+ "<td>"+data[i].stopover_time+"</td>"
				+"</tr>";
	}

	if(0 >= data.length) {
		list = "<p class='text-muted'>查询失败！</p>";
	}
	else {
		list = _Md_Table2.replace("##BODY##", list)
		list = "<h2>"+tId+"次 列车站点信息</h2><hr>" 
				+ list 
				+ "<hr><p class='text-center'><button class='btn btn-outline-primary btn-sm' onclick='_Close_Panel2()'>关闭</button></p>";
	}

	$(".mask").remove()
	$("#ol_tt_result2").remove()
	$("body").after("<div onclick='_Close_Panel2()' class='mask'></div>");
	$("#ol_tt_result").after("<div class='modalbox' id='ol_tt_result2'>"+list+"</div>");
}


function _Close_Panel2() {
	$(".mask").remove()
	$("#ol_tt_result2").remove();
}


function _Show_Is_Query(data) {
	list = "<p class='text-muted loading1'>正在查询...</p>";
	$("#ol_tt_result").html(list);
}

function _Show_Is_Query2(data) {
	$(".mask").remove()
	$("#ol_tt_result2").remove()

	list = "<h4 class='text-center loading1'>正在查询...</h4>"
				+ "<hr><p class='text-center'><button class='btn btn-outline-primary btn-sm' onclick='_Close_Panel2()'>关闭</button></p>";
	$("body").after("<div onclick='_Close_Panel2()' class='mask'></div>");
	$("#ol_tt_result").after("<div class='modalbox' id='ol_tt_result2'>"+list+"</div>");
}



// 监控输入站名
function Monitor_Station_Input(obj) {
	var id = obj.id;
	var name = obj.value;

	if("" == name) {
		$("#"+id+"_opts").html('<h6 class="dropdown-header">输入中文或拼音</h6>');
		return
	}

	var cn = _Search_Key_CN(name);
	var py = _Search_Key_PY(name);
	var arr = [];
	if(0 < cn.length) {
		arr = cn
	}
	else if(0 < py.length) {
		arr = py
	}

	_FromStation_AutoPadding_Options(arr, id)

	return;
}

// 自动补齐输入的站名（提供选项）
function _FromStation_AutoPadding_Options(arr, inputid) {
	var options = "";
	if(0 == arr.length) {
		options = '<h6 class="dropdown-header">没有符合条件的车站</h6>';
	}
	else {
		for(var i=0; i<arr.length; i++) {
			var station = arr[i];
			options += '<a onclick="_FromStation_AutoInput(\''+station.name+'\', \''+inputid+'\')" class="dropdown-item" href="#">'
						+station.name+' <small>'+station.pinyin+'</small></a>';
		}
	}
	$("#"+inputid+"_opts").html(options);
	if("none" == $("#"+inputid+"_opts").css("display")) {
		$("#"+inputid+"_opts").dropdown('toggle')
	}
}

// 直接填充站名输入框
function _FromStation_AutoInput(name, inputid) {
	$("#"+inputid).val(name);
}




/* -------------------------------------------------- OL_TrainTickets ------------------------------------------------ */
var OL_TrainTickets = function() {};

OL_TrainTickets.rebase = function() { 

	var data = {};
	$.ajax({  
	　　type 	 : 'post',
	　　url  	 : '/rebase',  
	　　data 	 : data,  
	　　dataType : 'Json',
	　　success  : function(msg){
			if(msg.error) {
				alert(msg.error)
			}
			else {
				alert("重置完成")
			}
		},
	　　error:function(){
	　		alert("无法获取数据！请检查网络！");
	　　}
	})
};


OL_TrainTickets.query = function() { 

	var date = $("#ol_tt_date").val();
	var _fromStation = $("#ol_tt_fromStation").val().replace(/ /g, "");
	var _toStation = $("#ol_tt_toStation").val().replace(/ /g, "");

	if(!date || _check_date_validity(date)) {
		alert("日期不能为空！")
		return
	}
	if(!_fromStation) {
		alert("出发站不能为空！")
		return
	}
	if(!_toStation) {
		alert("终点站不能为空！")
		return
	}

	var fromStation = _Get_tCode(_fromStation)
	if(!fromStation) {
		fromStation = _Get_tCode_PY(_fromStation)
		if(!fromStation) {
			alert("出发站无效！")
			return
		}
	}
	var toStation = _Get_tCode(_toStation)
	if(!toStation) {
		toStation = _Get_tCode_PY(_toStation)
		if(!toStation) {
			alert("终点站无效！")
			return
		}
	}

	_Show_Is_Query();
	var data = {
		date : date,
		from_station : fromStation,
		end_station : toStation,
	};
	$.ajax({  
	　　type 	 : 'post',
	　　url  	 : '/tickect',  
	　　data 	 : data,  
	　　dataType : 'Json',
	　　success  : function(msg){
			if(msg.error) {
				alert(msg.error)
			}
			else {
				OL_TickectInfo_Cache = msg.data;
				_Render_Query_Result(msg.data)
			}
		},
	　　error:function(){
	　		alert("无法获取数据！请检查网络！");
	　　}
	})
};



OL_TrainTickets.findStations = function(train_no) { 

	var tickect = _Get_Data_tNo(train_no);
	if(!tickect) {
		alert("无法查询！")
		return
	}
	
	_Show_Is_Query2();
	var data = {
		train_no : train_no,
		from_station : _Get_tCode(tickect.fSation),
		end_station : _Get_tCode(tickect.tSation),
		date : _conv_date(tickect.date),
	};
	$.ajax({  
	　　type 	 : 'post',
	　　url  	 : '/stations',  
	　　data 	 : data,  
	　　dataType : 'Json',
	　　success  : function(msg){
			if(msg.error) {
				alert(msg.error)
			}
			else {
				_Render_StationsList_Result(msg.data);
			}
		},
	　　error:function(){
	　		alert("无法获取数据！请检查网络！");
	　　}
	})
};



