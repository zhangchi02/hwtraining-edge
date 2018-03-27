var t = new Date();
    var year = t.getFullYear();
    var month = add_zero(t.getMonth() + 1);
    var day = add_zero(t.getDate());
    var hour = add_zero(t.getHours());
    var minute = add_zero(t.getMinutes());
    var second = add_zero(t.getSeconds());
    
    var date = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    
    function add_zero(temp){
    	if(temp<10){return "0"+temp;}
    	else return temp;
    }
    var classId;
	var loggedinuser;
	var divs;
	var divsb;
    function getClassId(){
	    url = "hwtraining-teacher-service/hwtraining/v1/currentclassid";
	    $.ajax({
			type : "GET",
			url : url,
			dataType : "json",
			cache : false,
			async : false,
			data : {},
			success : function(data) {
				classId = data;
			},
			error : function(data) {
				alert("Error!!!");
			}
		});
    }
	function selectOpt() {
		classId = $("#classId").find("option:selected").val();
		var menu = $.session.get("menu");
		if(menu=="notice"){notice();}
		if(menu=="task"){taskShow();}
		if(menu=="student"){studentShow(0,0);}	
		if(menu=="score"){scoreShow();}
		if(menu=="forum"){forumShow(0,0);}
		if(menu=="survey"){surveyShow();}
	}
	function taskShow() {
		$.session.set("menu", "task");
		var classIds = $("#classId").find("option:selected").val();
		isLogin();
		$("#survey").fadeOut(10);
		$("#notice").fadeOut(10);
		var url = "hwtraining-teacher-service/hwtraining/v1/tasks";
		$
				.ajax({
					type : "GET",
					url : url,
					dataType : "json",
					cache : false,
					async : false,
					data : {
						classId : classIds
					},
					success : function(data) {
						var s = '<table  class="tablelist" ><tr><th width="50px;">班次</th><th width="50px;">状态</th><th width="130px;">截止时间</th><th width="50px;">责任人</th><th width="80px;">角色</th><th width="150px;">任务</th><th width="550px;">任务详情</th><th width="140px;">备注</th></tr>';
						var jsonReturn = eval(data);
						for (var i = 0; i < jsonReturn.length; i++) {
							s += '<tr id="'+i+'"><td >' + jsonReturn[i].classId
									+ '</td><td><input type="button" value="'
									+ jsonReturn[i].status
									+ '" onclick="changeStatus(' + i
									+ ')"/></td><td>' + jsonReturn[i].deadline
									+ '</td><td><input class="taskInput" type="text" value="' + jsonReturn[i].handPeople
									+ '"/></td><td>' + jsonReturn[i].role
									+ '</td><td>' + jsonReturn[i].task
									+ '</td><td title="'+ jsonReturn[i].detail +'">' + jsonReturn[i].detail
									+ '</td><td><textarea rows="6" cols="19"  title="'+ jsonReturn[i].comment +'">'
									+ jsonReturn[i].comment
									+ '</textarea></td></tr>';
						}
						s += '</table><input type="hidden" id="taskslist" value="'+jsonReturn.length+'">'
						$('#dv').html(s);
						$("#control").fadeOut(100);
						$("#forum").fadeOut(100);
					},
					error : function(XMLHttpRequest) {
						commonaction(XMLHttpRequest);
					}
				});
		var taskslist = $("#taskslist").val();
		for (var j = 0; j < taskslist; j++) {
			var btn = $("#" + j + " td:nth-child input[type='button'] ").val();
			if (btn == "1") {
				$("#" + j + " td:nth-child input[type='button'] ").val("已完成");
				$("#" + j + " td:nth-child input[type='button'] ").attr("disabled", "disabled");
				$("#" + j + " td:nth-child input[type='text'] ").attr("disabled", "disabled");
				$("#" + j + " td:nth-child textarea").attr("disabled",
						"disabled");
			} else {
				$("#" + j + " td:nth-child input[type='button'] ").val("未完成");
			}
		}
	}
	function changeStatus(id) {
		classId = $('#' + id + ' td:nth-child(1)').text();
		var task = $('#' + id + ' td:nth-child(6)').text();
		var handPeople = $('#' + id + ' td:nth-child input[type="text"]').val();
		if(handPeople==""||typeof(handPeople)=="undefined"){
			$("#" + id + " td:nth-child input[type='text'] ").attr("style", "background:#FF6161;");
			$("#" + id + " td:nth-child input[type='text'] ").focus();
			return;
		}
		var comment = $('#' + id + ' td:nth-child(8) textarea').val();
		url2 = "hwtraining-teacher-service/hwtraining/v1/tasks";
		$.ajax({
			type : "PUT",
			url : url2,
			dataType : "json",
			cache : false,
			async : false,
			data : {
				classId : classId,
				task : task,
				handPeople : handPeople,
				comment : comment
			},
			success : function(data) {
				taskShow();
			},
			error : function(data) {
				alert("Error!!!");
			}
		});
	}
	$(document).ready(function() {
		getClassId();
		$("#classId").val(classId);
		divs = document.getElementsByName("aaa");
		var len = divs.length;
		for(var i=0;i<len;i++){
			divs[i].onclick = function(){
				for(var j=0;j<len;j++){
					divs[j].style = "";
				}
				this.style= "background-position:left -56px;";
			};
		}
		divsb = document.getElementsByName("bbb");
		var lenb = divsb.length;
		for(var i=0;i<lenb;i++){
			divsb[i].onclick = function(){
				for(var j=0;j<lenb;j++){
					divsb[j].style = "";
				}
				this.style= "background-position:left -56px;";
			};
		}
		notice();
		var m = $.session.get("menu");
		var defaultMenu = $("#"+m+"Show");
		for(var i=0;i<len;i++){
			var con = divs[i].text;
			var label = defaultMenu.text();
			divs[i].style = "";
			if( con == label){
				divs[i].style= "background-position:left -56px;";
			}
		}
		$.session.set("day", 1);
		var d = $.session.get("day");
		var defaultDay = $("#day"+d);
		for(var i=0;i<lenb;i++){
			var con = divsb[i].text;
			var label = defaultDay.text();
			divsb[i].style = "";
			if( con == label){
				divsb[i].style= "background-position:left -56px;";
			}
		}
		$.session.set("curStu", 1);
		$.session.set("curForum", 1);
		login();
		if(isLogin()){
			$("#option").fadeIn(100);
		}
		$("#clickAdd").click(function() {
			var classIds = $("#classId").find("option:selected").val();
			getClassId();
			if(classIds!=classId){
				alert("请切换到正确的班次："+classId+"！！！");
				return;
			}
			$("#companyName").val("");
			$("#industry").val("");
			$("#name").val("");
			$("#title").val("");
			$("#phoneNumber").val("");
			$("#email").val("");
			$("#hwcloudId").val("");
			$("#comment").val("");
			$("#tipAdd").fadeIn(200);
		});
		$("#clickUpdate").click(function() {
			var obj = document.getElementsByName("student");
			var check_val = [];
			for (k in obj) {
				if (obj[k].checked)
					check_val.push(obj[k].value);
			}
			if(check_val.length<1){
				alert("请选择要修改的选项！！！");
				return false;
			}
			if(check_val.length>1){
				alert("只能选择一个要修改的选项！！！");
				return false;
			}
			var url2 = "hwtraining-teacher-service/hwtraining/v1/student";
			var n = check_val[0];
			var studentId = $('#' + n + ' td:nth-child(1) input[type="hidden"]').val();
			$.ajax({
				type : "GET",
				url : url2,
				dataType : "json",
				cache : false,
				async : false,
				data : {
					studentId: studentId
				},
				success : function(data) {
					var jsonReturn = eval(data);
					$("#companyName").val(jsonReturn[0].companyName);
					$("#industry").val(jsonReturn[0].industry);
					$("#name").val(jsonReturn[0].name);
					$("#title").val(jsonReturn[0].title);
					$("#phoneNumber").val(jsonReturn[0].phoneNumber);
					$("#email").val(jsonReturn[0].email);
					$("#hwcloudId").val(jsonReturn[0].hwcloudId);
					$("#comment").val(jsonReturn[0].comment);
					$("#studentId").val(jsonReturn[0].studentId);
				},
				error : function(data) {
					alert("Error!!!");
					return;
				}
			});
			$("#tipAdd").fadeIn(200);
		});
		
		$("#clickDelete").click(function() {
			$("#tipDelete").fadeIn(200);
		});
		$("#clickImport").click(function() {
			$("#tipImport").fadeIn(200);
		});
		$(".tiptop a").click(function() {
			$(".tip").fadeOut(200);
			$(".tipDelete").fadeOut(200);
		});
		$("#sureAdd").click(function() {
			$("#tipAdd").fadeOut(100);
			var studentId = $("#studentId").val();
			var inviter = $.session.get("loggedinuser");
			var companyName = $("#companyName").val();
			var industry = $("#industry").val();
			var name = $("#name").val();
			var title = $("#title").val();
			var phoneNumber = $("#phoneNumber").val();
			var email = $("#email").val();
			var hwcloudId = $("#hwcloudId").val();
			var comment = $("#comment").val();
			$.ajax({
				type : "POST",
				url : "hwtraining-teacher-service/hwtraining/v1/student",
				contentType : "application/json",
				dataType : "json",
				cache : false,
				async : false,
				data : JSON.stringify({
					"inviter" : inviter,
					"classId" : classId,
					"companyName" : companyName,
					"industry" : industry,
					"name" : name,
					"title" : title,
					"phoneNumber" : phoneNumber,
					"email" : email,
					"hwcloudId" : hwcloudId,
					"comment" : comment,
					"studentId": studentId
				}),
				success : function(data) {
					if (data == true) {
						studentShow(0,0);
					} else {
						alert("false!!!");
						return;
					}
				},
				error : function(data) {
					alert("Error!!!");
				}

			});
		});
		$("#sureDelete").click(function() {
			$("#tipDelete").fadeOut(100);
			var obj = document.getElementsByName("student");
			var check_val = [];
			for (k in obj) {
				if (obj[k].checked)
					check_val.push(obj[k].value);
			}
			var url2 = "hwtraining-teacher-service/hwtraining/v1/student";
			for (k in check_val) {
				n = check_val[k];
				studentId = $('#' + n + ' td:nth-child(1) input[type="hidden"]').val();
				classId = $('#' + n + ' td:nth-child(2)').text();
				name = $('#' + n + ' td:nth-child(6)').text();
				phoneNumber = $('#' + n + ' td:nth-child(8)').text();
				$.ajax({
					type : "DELETE",
					url : url2,
					dataType : "json",
					cache : false,
					async : false,
					data : {
						classId : classId,
						name : name,
						phoneNumber : phoneNumber,
						studentId: studentId
					},
					success : function(data) {
						if((parseInt(k)+1)==check_val.length){
							studentShow(0,0);
						}
					},
					error : function(data) {
						alert("Error!!!");
						return;
					}
				});
			}
		});
		$("#sureImport").click(function() {
			$("#tipImport").fadeOut(100);
			var options = {
					url : "hwtraining-teacher-service/hwtraining/v1/import",
					type : "POST",
					dataType : "json",
					cache : false,
					async : false,
					success : function(data) {
						console.log(data);
						alert("导入成功！！！");
					},
					error : function(data) {
						console.log(data);
						alert("导入失败！！！");
					}
			};
			$("#importForm").ajaxSubmit(options);
			$("#import").val("");
			studentShow(0,0);
		});
		$(".cancel").click(function() {
			$(".tip").fadeOut(100);
			$(".tipDelete").fadeOut(100);
			$(".tipImport").fadeOut(100);
		});
	});

	function notice() {
		$('#dv').html("");
		$.session.set("menu", "notice");
		$("#control").fadeOut(10);
		$("#forum").fadeOut(10);
		$("#survey").fadeOut(10);
		$("#survey").fadeOut(10);
		$("#notice").fadeIn(10);
		
	}
	var jsonReturn;
	function getStudents(){
		var classIds = $("#classId").find("option:selected").val();
		url = "hwtraining-teacher-service/hwtraining/v1/students";
		$.ajax({
			type : "GET",
			url : url,
			contentType : "application/json",
			dataType : "json",
			cache : false,
			async : false,
			data : {
				classId : classIds
			},
			success : function(data) {
				jsonReturn = eval(data);
			},
			error : function(XMLHttpRequest) {
				commonaction(XMLHttpRequest);
			}
		});
	}
	function studentShow(current,cal) {
		getStudents();
		var num1;
	    var num2;
	    var classIds = $("#classId").find("option:selected").val();
	    $.session.set("menu", "student");
	    isLogin();
	    $("#control").fadeOut(10);
	    $("#survey").fadeOut(10);
	    $("#notice").fadeOut(10);
	    var s = '<table id="studentTable" class="tablelist" ><tr><th width="30px;"><input type="checkbox"></th><th width="50px;">班次</th><th width="90px;">邀请人</th><th width="180px;">公司</th><th width="120px;">行业</th><th width="60px;">姓名</th><th width="105px;">岗位</th><th width="85px;">手机号</th><th width="160px;">邮箱</th><th width="100px;">公有云账户</th><th width="219px;">邀请理由</th></tr>';
	    var totalNum = jsonReturn.length;
	    var currentNum = parseInt($.session.get("curStu"));
	    var totalPage = Math.ceil(totalNum / 10);
	    if (cal != 0) {
	    	currentNum += cal;
	    	if (currentNum == 0) {
	    		currentNum = 1;
	    	}
	    }
	    if (current != 0) {
	    	currentNum = current;
	    }
	    if (cal == 0 && current == 0) {
	    	currentNum = 1;
	    }
	    if (totalNum == 0) {
	    	totalPage = 1;
	    }
	    $.session.set("curStu", currentNum);
	    num1 = (currentNum - 1) * 10;
	    num2 = currentNum * 10;
	    for (var i = 0; i < jsonReturn.length; i++) {
	    	if (i >= num1 && i < num2) {
	    		s += '<tr id="' + i
	    				+ '"><td><input name="student" type="checkbox" value="' + i
	    				+ '"/><input type="hidden" value="'
	    				+ jsonReturn[i].studentId + '"/></td><td >'
	    				+ jsonReturn[i].classId + '</td><td>'
	    				+ jsonReturn[i].inviter + '</td><td>'
	    				+ jsonReturn[i].companyName + '</td><td>'
	    				+ jsonReturn[i].industry + '</td><td>' 
	    				+ jsonReturn[i].name + '</td><td>' 
	    				+ jsonReturn[i].title + '</td><td>'
	    				+ jsonReturn[i].phoneNumber + '</td><td>'
	    				+ jsonReturn[i].email + '</td><td>'
	    				+ jsonReturn[i].hwcloudId + '</td><td>'
	    				+ jsonReturn[i].comment + '</td></tr>';
	    	}
	    }
	    s += '</table><input type="hidden" id="taskslist" value="'
	    		+ jsonReturn.length + '"><br/>';
	    s += '<a onclick="studentShow(1,0);">首页</a><a onclick="studentShow(0,-1);">上一页</a><a onclick="studentShow(0,1);">下一页</a><a onclick="studentShow('
	    		+ totalPage + ',0);">尾页</a> 总条数：' + totalNum;
	    $('#dv').html(s);
	    $("#control").fadeIn(100);
	    $("#forum").fadeOut(100);
	}
	function scoreShow() {
		$.session.set("menu", "score");
		var classIds = $("#classId").find("option:selected").val();
		url = "hwtraining-teacher-service/hwtraining/v1/studentscore";
		cid = classIds;
		$
				.ajax({
					type : "GET",
					url : url,
					dataType : "json",
					cache : false,
					sync : false,
					data : {
						classId : cid
					},
					success : function(data) {
						var s = '<table  class="tablelist" ><tr><th>班次</th><th>姓名</th><th>遗留应用</th><th>中间件</th><th>容器</th><th>微服务</th><th>航空订票</th><th>车联网</th><th>银行理财</th><th>EI视觉</th><th>签到</th><th>总分</th></tr>';
						var jsonReturn = eval(data);
						for (var i = 0; i < jsonReturn.length; i++) {
							total = parseInt(jsonReturn[i].subject1)
									+ parseInt(jsonReturn[i].subject2)
									+ parseInt(jsonReturn[i].subject3)
									+ parseInt(jsonReturn[i].subject4)
									+ parseInt(jsonReturn[i].subject5)
									+ parseInt(jsonReturn[i].subject6)
									+ parseInt(jsonReturn[i].subject7)
									+ parseInt(jsonReturn[i].subject8)
									+ parseInt(jsonReturn[i].subject9);
							var color = "background-color:#65E9B7";
							if (total < 100) {
								color = "background-color:#FFB6C1";
							} else {
								color = "background-color:#65E9B7";
							}
							if (isLogin()) {
								s += '<tr><td >'
										+ jsonReturn[i].classId
										+ '</td><td>'
										+ jsonReturn[i].name
										+ '</td><td  ondblclick="changeScoreStatus(this)" ><input  type="text" class="score" value="'
										+ jsonReturn[i].subject1
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject2
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject3
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject4
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject5
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject6
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject7
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject8
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td ondblclick="changeScoreStatus(this)"><input type="text" class="score" value="'
										+ jsonReturn[i].subject9
										+ '"  onblur="modifyScore(this)" onkeydown="if(event.keyCode==13) {modifyScore(this)}" disabled="" /></td><td> <input type="text" class="score" style="'+color+'" disabled="disabled" value="'+total+'"/></td></tr>';

							} else {

								s += '<tr><td >'
										+ jsonReturn[i].classId
										+ '</td><td>'
										+ jsonReturn[i].name
										+ '</td><td ><input  type="text" class="score" value="'		
							+ jsonReturn[i].subject1		
							+ '"   disabled="" /></td><td><input type="text" class="score" value="'		
							+ jsonReturn[i].subject2		
							+ '"   disabled="" /></td><td><input type="text" class="score" value="'		
							+ jsonReturn[i].subject3		
							+ '"   disabled="" /></td><td><input type="text" class="score" value="'		
							+ jsonReturn[i].subject4		
							+ '"  disabled="" /></td><td ><input type="text" class="score" value="'		
							+ jsonReturn[i].subject5		
							+ '"  disabled="" /></td><td ><input type="text" class="score" value="'		
							+ jsonReturn[i].subject6		
							+ '"   disabled="" /></td><td><input type="text" class="score" value="'		
							+ jsonReturn[i].subject7		
							+ '"  disabled="" /></td><td ><input type="text" class="score" value="'		
							+ jsonReturn[i].subject8		
							+ '"   disabled="" /></td><td><input type="text" class="score" value="'		
							+ jsonReturn[i].subject9		
							+ '"  disabled="" /></td><td> <input type="text" class="score" style="'+color+'" disabled="disabled" value="'+total+'"/></td></tr>';

							}
						}
						s += '</table><input type="hidden" id="taskslist" value="'+jsonReturn.length+'">'

						$('#dv').html(s);
						$("#control").fadeOut(100);
						$("#forum").fadeOut(100);
						$("#survey").fadeOut(100);
						$("#notice").fadeOut(10);
					},
					error : function(data) {
						alert("Error!!!");
					}
				});
	}
	function numberPattern(score){
		var pattern = /^[1-9][0-9]?$/;
		if(pattern.test(score)){
			return true;
		}else{
			return false;
		}
	    console.log(pattern.test(score));
	}
	function modifyScore(id) {
		var tr = $(id).parent().parent().children();
		classId = $(tr[0]).text();
		name = $(tr[1]).text();
		subject1 = $(tr[2]).children("input").attr('value');
		subject2 = $(tr[3]).children("input").attr('value');
		subject3 = $(tr[4]).children("input").attr('value');
		subject4 = $(tr[5]).children("input").attr('value');
		subject5 = $(tr[6]).children("input").attr('value');
		subject6 = $(tr[7]).children("input").attr('value');
		subject7 = $(tr[8]).children("input").attr('value');
		subject8 = $(tr[9]).children("input").attr('value');
		subject9 = $(tr[10]).children("input").attr('value');
		total = parseInt(subject1) + parseInt(subject2) + parseInt(subject3)
				+ parseInt(subject4) + parseInt(subject5) + parseInt(subject6)
				+ parseInt(subject7) + parseInt(subject8) + parseInt(subject9);
		if (total < 100) {
			$(tr[11]).children("input").attr('style', "background-color:#FFB6C1");
		} else {
			$(tr[11]).children("input").attr('style', "background-color:#65E9B7");

		}
		$(tr[11]).children("input").attr('value', total);
		console.log('subject===>', subject1, subject2, subject3, subject4,
				subject5, subject6, subject7, subject8, subject9)
		$.ajax({
			type : "PUT",
			url : url,
			contentType : "application/json",
			dataType : "json",
			cache : false,
			async : false,
			data : JSON.stringify({
				classId : classId,
				name : name,
				subject1 : subject1,
				subject2 : subject2,
				subject3 : subject3,
				subject4 : subject4,
				subject5 : subject5,
				subject6 : subject6,
				subject7 : subject7,
				subject8 : subject8,
				subject9 : subject9
			}),
			success : function(data) {
				if (data == true) {
					$(id).attr('disabled', 'disabled');
				}

			},
			error : function(data) {
				alert("Error!!!");
			}
		});
	}
	function changeScoreStatus(id) {
		console.log($(id).children("input").text());
		$(id).children("input").attr("disabled", false);
		$(id).children("input").focus();
	}
	function forumShow(current,cal) {
		var num1;
		var num2;
		$.session.set("menu", "forum");
		var classIds = $("#classId").find("option:selected").val();
		isLogin();
		var cid = classIds;
		url = "hwtraining-teacher-service/hwtraining/v1/forumcontent";
		$
				.ajax({
					type : "GET",
					url : url,
					dataType : "json",
					cache : false,
					async : false,
					data : {
						classId : cid
					},
					success : function(data) {
						var s = '<table class="forumTable" >';
						var jsonReturn = eval(data);
						var totalNum = jsonReturn.length;
						var currentNum = parseInt($.session.get("curForum"));
						var totalPage = Math.ceil(totalNum/10);
						if(cal != 0){
							currentNum+=cal;
							if(currentNum==0){
								currentNum = 1;
							}
						}
						if(current != 0){
							currentNum = current;
						}
						if(cal==0 && current==0){
							currentNum = 1;
						}
						if(totalNum == 0){
							totalPage =1;
						}
						$.session.set("curForum", currentNum);
						num1 = (currentNum-1) * 10;
						num2 = currentNum * 10;
						for (var i = 0; i < jsonReturn.length; i++) {
							if(i>=num1 && i<num2){
								s += '<tr id="'+i+'" class="list0"><td>'
										+ '<div class="forumLeft"><span>班次：' + jsonReturn[i].classId + '</span>'
										+ '<span>产品：' + jsonReturn[i].tenant + '</span>'
										+ '<span>姓名：' + jsonReturn[i].forumusername + '</span>'
										+ '<span>租户名：' + jsonReturn[i].name +'</span></div></td>'
										+ '<td><div class="forumMain"><div class="forumFirst"><p class="text">'	+ jsonReturn[i].content	+ '</p></div><div class="forumSecond">';
								if(jsonReturn[i].path !="" ){
									s+= '<div class="forumSecond"> <a href="'+jsonReturn[i].path+'" target="_blank"><image height="360px" src="'+ jsonReturn[i].path+ '" alt=""/></a></div>';
								}
								s+= '</div><div class="forumThird"><span class="date">' + jsonReturn[i].time + '</span></div></td></tr>';
							}
						}
						s += '</table><input type="hidden" id="taskslist" value="'+jsonReturn.length+'">'
						s += '<a onclick="forumShow(1,0);">首页</a><a onclick="forumShow(0,-1);">上一页</a><a onclick="forumShow(0,1);">下一页</a><a onclick="forumShow('+totalPage+',0);">尾页</a> 总条数：'+totalNum;
						$('#dv').html(s);
						$("#forum").fadeIn(100);
						$("#control").fadeOut(100);
						$("#survey").fadeOut(100);
						$("#notice").fadeOut(10);
					},
					error : function(data) {
						alert("查询问题失败！");
					}
				});
	}
	function uploadPic() {
		$("#uploadButton").val("请等待 图片上传中...");
		$("#uploadButton").attr("style", "background:#6B6B6B;");
		$("#uploadButton").attr("disabled", "disabled");
		var options = {
			url : "hwtraining-teacher-service/hwtraining/v1/upload",
			type : "POST",
			dataType : "text",
			success : function(data) {
				console.log(data);
				$("#allUrl").attr("src", data);
				$("#uploadButton").attr("disabled", false);
				$("#uploadButton").attr("style", "background:#E27575;");
				$("#uploadButton").val("提交");
			},
			error : function(data) {
				$("#uploadButton").attr("disabled", false);
				$("#uploadButton").attr("style", "background:#E27575;");
				$("#uploadButton").val("提交");
				alert("上传图片失败！！！");
				console.log(data);
				return;
			}
		};
		var path = $("#allUrl").attr("src");
		if(path==""){
			return;
		}
		$("#uploadForm").ajaxSubmit(options);
	}
	function upload() {
		cid = classId;
		var name = $("#userId").val();
		var forumusername = $("#forumusername").val();
		var tenant = $("#tenant").find("option:selected").val();
		var content = $("#content").val();
		var path = $("#allUrl").attr("src");
		if(path=="images/sample.jpg"){
			path="";
		}
		$.ajax({
			url : "hwtraining-teacher-service/hwtraining/v1/forumcontent",
			type : "POST",
			contentType : "application/json",
			dataType : "json",
			cache : false,
			async : false,
			data : JSON.stringify({
				classId : cid,
				forumusername : forumusername,
				name : name,
				tenant : tenant,
				time : date,
				content : content,
				path : path
			}),
			success : function(data) {
				console.log(data);
				$("#userId").attr("value","");
				$("#forumusername").attr("value","");
				$("#content").attr("value","");
				$("#allUrl").attr("src","images/sample.jpg");
				alert("提交成功！");
				forumShow(0,0);
			},
			error : function(data) {
				alert("保存失败!!!");
				console.log(data);
			}
		});
	}
	function login() {
		var m = $.session.get("menu");
		var username = $.session.get("username");
		if("" == username || "undefined" == typeof(username)){
			username = $("#username").val();
		}
		var password = $.session.get("password");
		if("" == password || "undefined" == typeof(password)){
		    password = $("#password").val();
		}
		var url = "hwtraining-teacher-service/hwtraining/v1/login";
		$.ajax({
			url : url,
			type : "POST",
			contentType : "application/json",
			dataType : "script",
			cache : false,
			async : false,
			data : JSON.stringify({
				userName : username,
				password : password
			}),
			success : function(data) {
				$('#dv').html();
				$("#dialog").fadeOut(100);
				$("#logout").fadeIn(100);
				$("#option").fadeIn(100);
				$.session.set('username', username, true);
				$.session.set('password', password, true);
				
				var len = divs.length;
				var defaultMenu = $("#"+m+"Show");
				for(var i=0;i<len;i++){
					var con = divs[i].text;
					var label = defaultMenu.text();
					divs[i].style = "";
					if( con == label){
						divs[i].style= "background-position:left -56px;";
					}
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
				console.log(textStatus);
				$.session.set('username', "");
				$.session.set('password', "");
			},
		    complete: function( XMLHttpRequest,data ){
		        loggedinuser=XMLHttpRequest.getResponseHeader('loggedinuser');
				$.session.set('loggedinuser', loggedinuser,true);
				$("#loggedinuser").val(loggedinuser);
				selectOpt();
		    }
		});
	}
	function logout() {
		var url = "hwtraining-teacher-service/hwtraining/v1/logout"
		$.ajax({
			url : url,
			type : "DELETE",
			dataType : "script",
			cache : false,
			async : false,
			data : {},
			success : function(data) {
				window.location.reload();
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			},
		});
		$.session.set("loggedinuser", "");
		$.session.set("username", "");
		$.session.set("password", "");
	}

	function commonaction(XMLHttpRequest) {
		if (XMLHttpRequest.status == "403") {
			$('#dv').html("");
			$("#forum").fadeOut(100);
			isLogin();
		}
	}

	function isLogin() {
		if ($.session.get("loggedinuser") == ""||typeof($.session.get("loggedinuser")) == "undefined"||$.session.get("loggedinuser")!=loggedinuser) {
			$("#logout").fadeOut(100);
			$("#dialog").fadeIn(100);
			return false;
		} else {
			$("#logout").fadeIn(100);
			$("#dialog").fadeOut(100);
			return true;
		}
	}
	function surveyShow(){
		$.session.set("menu", "survey");
		$('#dv').html("");
		$("#forum").fadeOut(10);
		$("#control").fadeOut(10);
		$("#notice").fadeOut(10);
		$("#survey").fadeIn(100);
		var day = $.session.get("day");
		dayShow(day);
	}
	function dayShow(day){
		if(day==1){
		    $("#surveyDay1").fadeIn(10);
		    $("#surveyDay2").fadeOut(10);
		    $("#surveyDay3").fadeOut(10);
		    $.session.set("day", 1);
		}
		if(day==2){
		    $("#surveyDay2").fadeIn(10);
		    $("#surveyDay1").fadeOut(10);
		    $("#surveyDay3").fadeOut(10);
		    $.session.set("day", 2);
		}
		if(day==3){
		    $("#surveyDay3").fadeIn(10);
		    $("#surveyDay1").fadeOut(10);
		    $("#surveyDay2").fadeOut(10);
		    $.session.set("day", 3);
		}
	}
	function review(day){
		getClassId();
		var re=[];
		for(var i=1;i<7;i++){
			var radios = document.getElementsByName("day"+day+"0"+i);
			var len = radios.length;
			for(var j=0;j<len;j++){
				if (radios[j].checked) {  
		            re[i-1]=radios[j].value;
		        }  
			}
		}
		var comment = $("#day"+day+"07").val();
		var re1 = "PaaS整体解决方案满意度1,"+re[0]+",PaaS整体解决方案满意度2,"+re[1]+",云中间件满意度1,"+re[2]+",云中间件满意度2,"+re[3]+",CCE满意度1,"+re[4]+",CCE满意度2,"+re[5]+",建议,"+comment;
		var re2 = "DevOps开发满意度1,"+re[0]+",DevOps开发满意度2,"+re[1]+",DevOps运维满意度1,"+re[2]+",DevOps运维满意度2,"+re[3]+",实战满意度1,"+re[4]+",实战满意度2,"+re[5]+",建议,"+comment;
		var re3 = "EI解决方案满意度1,"+re[0]+",EI解决方案满意度2,"+re[1]+",大数据平台满意度1,"+re[2]+",大数据平台满意度2,"+re[3]+",人工智能满意度1,"+re[4]+",人工智能满意度2,"+re[5]+",建议,"+comment;
		var rev;
		if(day==1){rev = re1;}
		if(day==2){rev = re2;}
		if(day==3){rev = re3;}
		$.ajax({
			url : "hwtraining-teacher-service/hwtraining/v1/survey",
			type : "POST",
			contentType : "application/json",
			dataType : "json",
			cache : false,
			async : false,
			data : JSON.stringify({
				classId : classId,
				day : day,
				comment : rev
			}),
			success : function(data) {
				alert("感谢您的评价！！！");
				for(var i=1;i<7;i++){
					var radios = document.getElementsByName("day"+day+"0"+i);
					var len = radios.length;
					for(var j=0;j<len;j++){
				       radios[j].checked = false;
					}
				}
				$("#day"+day+"07").attr("value","");
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			},
		});
	}
	var idTmr;
    function  getExplorer() {
        var explorer = window.navigator.userAgent ;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if(explorer.indexOf("Chrome") >= 0){
            return 'Chrome';
        }
        //Opera
        else if(explorer.indexOf("Opera") >= 0){
            return 'Opera';
        }
        //Safari
        else if(explorer.indexOf("Safari") >= 0){
            return 'Safari';
        }
    }
    function method5(tableid) {
    	var s = '<table id="exportTable"><tr><th>班次</th><th>邀请人</th><th>公司</th><th>行业</th><th>姓名</th><th>岗位</th><th>手机号</th><th>邮箱</th><th>公有云账户</th><th>邀请理由</th></tr>';
	    for (var i = 0; i < jsonReturn.length; i++) {
		    s += '<tr id="' + i
				+ '"><td >' + jsonReturn[i].classId + '</td><td>'
				+ jsonReturn[i].inviter + '</td><td>'
				+ jsonReturn[i].companyName + '</td><td>'
				+ jsonReturn[i].industry + '</td><td>' + jsonReturn[i].name
				+ '</td><td>' + jsonReturn[i].title + '</td><td>'
				+ jsonReturn[i].phoneNumber + '</td><td>' + jsonReturn[i].email
				+ '</td><td>' + jsonReturn[i].hwcloudId + '</td><td>'
				+ jsonReturn[i].comment + '</td></tr>';
	    }
	    s += '</table>';
	    $('#exportExcel').html(s);
	    
        if(getExplorer()=='ie'){
            var curTbl = document.getElementById(tableid);
            var oXL = new ActiveXObject("Excel.Application");
            var oWB = oXL.Workbooks.Add();
            var xlsheet = oWB.Worksheets(1);
            var sel = document.body.createTextRange();
            sel.moveToElementText(curTbl);
            sel.select();
            sel.execCommand("Copy");
            xlsheet.Paste();
            oXL.Visible = true;

            try {
                var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught " + e);
            } finally {
                oWB.SaveAs(fname);
                oWB.Close(savechanges = false);
                oXL.Quit();
                oXL = null;
                idTmr = window.setInterval("Cleanup();", 1);
            }
        } else {
            tableToExcel(tableid)
        }
        $('#exportExcel').html("");
    }
    function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }
    var tableToExcel = (function() {
	var uri = 'data:application/vnd.ms-excel;base64,', template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>', base64 = function(
			s) {
		return window.btoa(unescape(encodeURIComponent(s)))
	}, format = function(s, c) {
		return s.replace(/{(\w+)}/g, function(m, p) {
			return c[p];
		})
	}
	return function(table, name) {
		if (!table.nodeType)
			table = document.getElementById(table)
		var ctx = {
			worksheet : name || 'Worksheet',
			table : table.innerHTML
		}
		window.location.href = uri + base64(format(template, ctx))
	}
    })()