var module="manage";
var sub="file";
jQuery(document).ready(function() {
	Metronic.init(); // init metronic core components
	Layout.init(); // init current layout
	QuickSidebar.init(); // init quick sidebar
	Demo.init(); // init demo features
	ComponentsDropdowns.init();
	Frame.init(module,sub);
	Page.init();
	Record.init();
});
/*================================================================================*/
var Record = function() {
	var userId=undefined;
	var userName=undefined;
	var userRole=undefined;
	var userAvatar=undefined;
	var initRecordStyle = function() {
	};
	var initRecordList = function(){
		getRecord();
	}
	var getRecord = function(){
		Metronic.startPageLoading({message: '正在查询中，请稍候...'});	//开始等待动画
		var id=$("#id").val();
		var existResultset=$("#exist_resultset").val();
		var url="../../"+module+"_"+sub+"_servlet_action?action=get_record&id="+id+"&exist_resultset="+existResultset;
		$.post(url,function(json){
			if(json.result_code==0){
				Record.userId=json.user_id;
				Record.userName=json.user_name;
				Record.userRole=json.user_role;
				Record.userAvatar=json.user_avatar;
				Page.showResult(json);
			}else{
				if(Page!=null){
					Page.processError(json);
				}
			}
			Metronic.stopPageLoading();	//停止等待动画
		}).error(function(xhr,errorText,errorType){
	        alert('错误信息：'+errorText+",错误类型："+errorType);
	    });
	};
	var viewRecord=function(id){
		window.location.href=sub+"_view.jsp?id="+id+"&exist_resultset=1";
	};
	var deleteRecord = function(id){
		if(confirm("您确定要删除这条记录吗？")){
			if(id>-1){
				$.post("../../"+module+"_"+sub+"_servlet_action?action=delete_record&id="+id,function(json){
					if(json.result_code==0){
						var count=json.count;
						var amount=json.amount;
						initRecordList();
						initRecordStyle();
						alert("已经从数据表删除该记录！");
					}
				})
			}
		}
	};
	var exportRecord=function(){
		window.location.href="../../"+module+"_"+sub+"_servlet_action?action=export_record&exist_resultset=1";
	}
	var search=function(){
		page_form.submit();
	}
	return {
		init: function() {
			initRecordList();
			initRecordStyle();
		},
		deleteRecord:function(id){
			deleteRecord(id);
		},
		viewRecord:function(id){
			viewRecord(id);
		},
		exportRecord:function(){
			exportRecord();
		},
		search:function(){
			search();
		}
	};
}();//Record;
/* ================================================================================ */
//关于页面的控件生成等操作都放在Page里，和Record独立，Record主要是和记录集交互
var Page = function() {
	var html="";
	var layout=1;
	var initPageStyle = function() {
		hideFrameNav();
	};
	var hideFrameNav=function(){
		//根据需要隐藏掉一些不需要的面板
		//隐藏顶部菜单栏
		//$("#page_top_div").hide();
		//隐藏旁边的菜单栏
		//$("#page_sidebar_wrapper_div").hide();
		//隐藏风格设置栏
		$("#style_customizer_div").hide();
		//隐藏page header
		$("#page_header_div").hide();
		//隐藏page 底部
		$("#page_footer_div").hide();
		var displaySidebar=true;
		if(!displaySidebar){
			if($("body").hasClass("page-container-bg-solid")){
				$("body").removeClass("page-sidebar-closed-hide-logo page-container-bg-solid");
				$("body").addClass("page-full-width");
			}else{}
		}
		//隐藏提醒图标
		$("#header_inbox_bar").hide();
		$("#header_calendar_bar").hide();
	};
	var processError=function(json){
		if(Frame!=null)
			Frame.processError(json);
	};
	var handleButtonEvent=function(){
		$('#return_button').click(function() {Page.confirmBack();});
		$('#search_button').click(function() {Page.searchRecord();});
		$('#delete_button').click(function() {Page.deleteRecord();});
		$('#add_button').click(function() {Page.addRecord();});
		$('#submit_button').click(function() {Page.submitRecord();});
		$('#tools_menu_reload').click(function() {Page.reload();});
		$('#help_button').click(function() {Page.help();});
		$('#export_button').click(function() {Page.exportRecord();});
		$('#statistic_button').click(function() {Page.statisticRecord();});
		$('#layout_button').click(function() {Page.layoutRecord();});
		$('#print_button').click(function() {Page.printRecord();});
	};
	var addRecord=function(){
		window.location.href="manage_add.jsp";
	}
	var showResult=function(json){
		var title="记录显示";
		if($("#title_div")) $("#title_div").html(title);
		if(json!=null){
			var list=json.aaData;
			var tip="当前查询到了 "+list.length+" 条记录";
			if($("#tip_div")) $("#tip_div").html(tip);
			if($("#record_list_tip")) $("#record_list_tip").html(tip);
			showRecordList(list);
		}
	};
	var showRecordList=function(list){
		html="													<div><span id=\"tip_div\"></span>";
		for(var i=0;i<list.length;i++){
			showRecord(list[i]);
		}
		html=html+"													</div>";
		$("#record_list_div").html(html);
	};
	var showRecord = function(json){
		var id=json[0];
		var image="../../assets/module/img/public/cat.jpg";
		var title=json[1];
		var content=json[2];
		var createTime=json[7];
		var breed=json[8];
		var sex=json[9];
		var others=json[10];
		var me=json[11];
		html=html+"														<div style=\"clear:both;width:100%;margin-top:5px;border:0px solid blue;\">";
		html=html+"															<div style=\"float:left;border:0px solid green;\">";
		html=html+"																<img src=\""+image+"\" style=\"width:100px;height:auto;\"></img>";
		html=html+"															</div>";
		html=html+"															<div style=\"display:table-cell;margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;border:0px solid blue;\"><p>";
		html=html+"																<span>名称："+title+"</span><p>";
		html=html+"																<span>疫苗信息："+content+"</span><p>";
		html=html+"																<span>时间："+createTime+"</span><p>";
		html=html+"																<span>品种："+breed+"</span><p>";
		html=html+"																<span>性别："+sex+"</span><p>";
		html=html+"																<span>其他信息："+others+"</span><p>";
		if(me=="1"){
			html=html+"																<button  type=\"button\" class=\"btn-small\" onclick=\"Page.deleteRecord("+id+");\">删除</button>";
			html=html+"																<button  type=\"button\" class=\"btn-small\" onclick=\"Page.modifyRecord("+id+");\">修改</button>";
		}
		html=html+"																<button  type=\"button\" class=\"btn-small\" onclick=\"Page.viewRecord("+id+");\">详细信息</button>";
		html=html+"															</div>";
		html=html+"														</div>";
	};
	var help=function(){
		var strUrl=location.pathname;
		window.open('../../help/online/new_win_help.jsp?page_url='+strUrl, 'big', 'fullscreen=yes');
	}
	var submitRecord=function(){
		if(checkInput()==true){
			page_form.action="../../"+module+"_"+sub+"_servlet_action";
			page_form.submit();
		}
	};
	var checkInput=function(){
		var bOk=true;
		var action=$("#action").val();
		if(action==null || action==""){Frame.showMsg("名称不能为空！");bOk=false;};
		return bOk;
	};
	var deleteRecord=function(id){
		Record.deleteRecord(id);
	};
	var viewRecord=function(id){
		Record.viewRecord(id);
	};
	var modifyRecord=function(id){
		window.location.href="manage_view.jsp?id="+id;
	};
	var searchRecord=function(){
		window.location.href="manage_query.jsp";
	};
	var statisticRecord=function(){
		window.location.href=sub+"_statistic.jsp";
	}
	var layoutRecord=function(){
		if(layout==1)
			window.location.href="record_list.jsp";
		if(layout==2)
			window.location.href=sub+"_list.jsp";
	}
	var printRecord=function(){
		window.location.href=sub+"_print.jsp?exist_resultset=1";
	};
	var confirmBack=function(){
		DraggableDialog.setId("confirm_back");
		DraggableDialog.setCancel(Page.onCancel);
		DraggableDialog.setButtonTitle("确定","取消");
		DraggableDialog.setOk(Page.returnBack);
		DraggableDialog.showMsg("确定要返回上一页吗？","提示");
	};
	var onCancel=function(){
		DraggableDialog.close();
	}
	var returnBack=function(){
		history.go(-1);
	};
	return {
		init: function() {
			initPageStyle();
			handleButtonEvent();
		},
		processError:function(json){
			processError(json);
		},
		showResult:function(json){
			showResult(json);
		},
		showRecordList:function(list){
			showRecordList(list);
		},
		submitRecord:function(){
			submitRecord();
		},
		addRecord:function(){
			addRecord();
		},
		deleteRecord:function(id){
			deleteRecord(id);
		},
		viewRecord:function(id){
			viewRecord(id);
		},
		searchRecord:function(){
			searchRecord();
		},
		exportRecord:function(){
			Record.exportRecord();
		},
		statisticRecord:function(){
			statisticRecord();
		},
		printRecord:function(){
			printRecord();
		},
		modifyRecord:function(id){
			modifyRecord(id);
		},
		reload:function(){
			window.location.reload();
		},
		layoutRecord:function(){
			layoutRecord();
		},
		confirmBack:function(){
			confirmBack();
		},
		returnBack:function(){
			returnBack();
		},
		onCancel:function(){
			onCancel();
		},
		help:function(){
			help();
		}
	}
}();//Page
/*================================================================================*/
