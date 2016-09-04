
window.onload = function() {

	var newSort = document.getElementById("new-sort");
	var newTask = document.getElementById("new-task");

	newSort.onclick = addNewSort;
	newTask.onclick = addNewTask;

	//加载分类数据
	if (loadClassificationData("ife")) {
		if (loadClassificationData("graduation")) {
			if (loadClassificationData("association")) {
				if (loadClassificationData("family")) {
					loadClassificationData("other");
				}
			}
		}
	}

	//显示大分类的任务数量
	displayAllTaskNum();
	
	//选中默认分类
	selectDefaultClass();

	//给大分类添加事件
	addEventListenerToSort();

	//加载中间的数据
	loadAllSortTask();

	//给中间按钮添加事件
	addEventListenerToButton();
}

//localStorage
var oStorage = window.localStorage;

//显示总任务数量
function displayAllTaskNum() {

	var numSpan = document.getElementById("whole-num");
	var num1 = displayTaskNum("ife");
	var num2 = displayTaskNum("graduation");
	var num3 = displayTaskNum("association");
	var num4 = displayTaskNum("family");
	var num5 = displayTaskNum("other");
	var wholeNum = 0;
	var num = [num1, num2, num3, num4, num5];

	for (var i in num) {	
			wholeNum += num[i];
	}
	numSpan.innerHTML = wholeNum;
}

//加载中间列及最右列任务内容
function loadAllSortTask() {

	document.getElementById("ife").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
	document.getElementById("graduation").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
	document.getElementById("association").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
	document.getElementById("family").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
	document.getElementById("other").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");


	var selected = document.getElementsByClassName("selected")[0];
	var arrDescript = ["task-finish", "task-display", "task-edit", "task-new"];
	//console.log(selected);
	//设置按钮样式
	document.getElementById(selected.getAttribute("id")).getElementsByClassName("li-img")[0].setAttribute("src", "images/folder_white.png");
	document.getElementsByClassName("checked")[0].setAttribute("class", "");
	document.getElementById("all-task").setAttribute("class", "checked")

	if (document.getElementsByClassName("li-select").length !== 0) {
		//console.log("fff")
		var liSelect = document.getElementsByClassName("li-select")[0];
		var selectedTask = liSelect.getAttribute("id");
		//console.log(selected.getAttribute("id") + "content");
		//console.log(oStorage.getItem(selected.getAttribute("id") + "content"));
		if(oStorage.getItem(selected.getAttribute("id") + "content") !== null && oStorage.getItem(selected.getAttribute("id") + "content") !== "") {
			//console.log("eee")
			var taskData = oStorage.getItem(selected.getAttribute("id") + "content");

			if (taskData.length !== 0) {
				
				var arrTaskContent = taskData.split("&");
				var timetitleArr = [];
				var arrTime = [];
				var arrTitle = [];
				var arrTask = []
				
				for (var i = 1; i < arrTaskContent.length; i++) {

					var arr = arrTaskContent[i].split("^");
					arrTime[i-1] = arr[2];
					arrTitle[i-1] =arr[1];
					arrTask[i-1] = arr[0];
				}
				
				var oldArrTime = arrTime;
				arrTime = uniqArray(arrTime);
				var resultArr = [];

				//给数组排序
				arrTime = squenceTime(arrTime);

				for (var i in arrTime) {
					resultArr[i] = arrTime[i];

					for (var j in arrTitle) {
						if (arrTime[i] === oldArrTime[j]) {
							resultArr[i] =  resultArr[i] + "^" + arrTask[j] + "^" + arrTitle[j];
						}
					}
				}

				var ulTime = document.getElementsByClassName("li-time")[0];

				var mytitle = "";
				for (var i in resultArr) {					
					if　(resultArr[i].split("^")[1] === selectedTask) {

						mytitle = resultArr[i].split("^")[2];
						break;
					}
				}

				if (mytitle !== "") {
					displayTaskContent(selected, liSelect, arrDescript, mytitle);
				} else {
					for (var i in arrDescript) {

						if (i !== 1) {		
							document.getElementById(arrDescript[i]).style.display = "none";
						}
					}
					document.getElementById(arrDescript[1]).style.display = "block";
			
					var displayTask = document.getElementById(arrDescript[1]);
					displayTask.getElementsByClassName("task-title")[0].innerHTML = "";
					displayTask.getElementsByTagName("time")[0].innerHTML = "";
					displayTask.getElementsByClassName("task-content")[0].innerHTML = "";					
				}
			
				for (var i in arrTime) {
					
					var liTime = document.createElement("li"); 
					liTime.innerHTML = arrTime[i];
					var allTask = resultArr[i];
					var arrTask = allTask.split("^");

					for (var j = 1; j < arrTask.length; j+=2) {
						
						if (arrTask[j] === selectedTask) {

							var ulCont = document.createElement("ul");
							ulCont.setAttribute("class", "li-cont");

							var liCont = document.createElement("li");

							if (oStorage.getItem(arrTask[j + 1]) === "finish") {
								liCont.style.color = "#A2CD5A";
							}

							liCont.innerHTML = arrTask[j + 1];
							ulCont.appendChild(liCont);

							(function() {
								liCont.onclick = function() {									
									displayTaskContent(selected, liSelect, arrDescript, this.innerHTML);
								}
							})();
					
							liTime.appendChild(ulCont);		
							ulTime.appendChild(liTime);					
						}						
					}
					
				}
				document.getElementsByClassName("list")[0].appendChild(ulTime);
			}
		} else {
			console.log('haoba')
			for (var i in arrDescript) {
				if (i !== 1) {		
					document.getElementById(arrDescript[i]).style.display = "none";
				}
			}
			document.getElementById(arrDescript[1]).style.display = "block";
			
			var displayTask = document.getElementById(arrDescript[1]);
			displayTask.getElementsByClassName("task-title")[0].innerHTML = "";
			displayTask.getElementsByTagName("time")[0].innerHTML = "";
			displayTask.getElementsByClassName("task-content")[0].innerHTML = "";

		}
	}
}

function squenceTime(arrTime) {

	var resultArr = [];
	for(var i in arrTime) {
		resultArr[i] = new Date(arrTime[i] + " 00:00:00").getTime();
	}
	
	resultArr = resultArr.sort();
	
	for (var i in resultArr) {

		var year = new Date(resultArr[i]).getFullYear();
		var month = new Date(resultArr[i]).getMonth() + 1;
		var date = new Date(resultArr[i]).getDate();
		if (month < 10) month = "0" + month;
		if (date < 10) date = "0" + date;
		resultArr[i] = year + "-" + month + "-" + date;
	}
	return resultArr;
}

// Date.prototype.Format = function (fmt) { 
//     var o = {
//         "M+": this.getMonth() + 1, //月份 
//         "d+": this.getDate(), //日 
//         "h+": this.getHours(), //小时 
//         "m+": this.getMinutes(), //分 
//         "s+": this.getSeconds(), //秒 
//         "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
//         "S": this.getMilliseconds() //毫秒 
//     };
//     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//     for (var k in o)
//     if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//     return fmt;
// }

function uniqArray(arr) {

	var newArr = [];

	for(var i in arr) {
		if(newArr.indexOf(arr[i])== -1) {
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

function addEventListenerToButton() {

	var allTask = document.getElementById("all-task");
	var notFinish = document.getElementById("not-finish");
	var hasFinish = document.getElementById("has-finish");

	allTask.onclick = function() {

		var checked = document.getElementsByClassName("checked")[0];
		checked.setAttribute("class", "");
		this.setAttribute("class", "checked");
		clearTaskList();
		loadAllSortTask();
	}

	notFinish.onclick = function() {

		var checked = document.getElementsByClassName("checked")[0];
		checked.setAttribute("class", "");
		this.setAttribute("class", "checked");
		clearTaskList();
		loadNotFinishTask();		
	}

	hasFinish.onclick = function() {

		var checked = document.getElementsByClassName("checked")[0];
		checked.setAttribute("class", "");
		this.setAttribute("class", "checked");
		clearTaskList();
		loadHasFinishTask();		
	}
}

function clearTaskList() {
	
	var liTime = document.getElementsByClassName("li-time")[0];
	liTime.innerHTML = "";
}

function loadHasFinishTask() {
	
	var selected = document.getElementsByClassName("selected")[0];
	var arrDescript = ["task-finish", "task-display", "task-edit", "task-new"];

	if (document.getElementsByClassName("li-select").length !== 0) {

		var liSelect = document.getElementsByClassName("li-select")[0];
		var selectedTask = liSelect.getAttribute("id");

		if(oStorage.getItem(selected.getAttribute("id") + "content") !== null && oStorage.getItem(selected.getAttribute("id") + "content") !== "") {
			
			var taskData = oStorage.getItem(selected.getAttribute("id") + "content");
			
			if (taskData.length !== 0) {
				
				var arrTaskContent = taskData.split("&");
				var timetitleArr = [];
				var arrTime = [];
				var arrTitle = [];
				var arrTask = []
				
				for (var i = 1; i < arrTaskContent.length; i++) {

					var arr = arrTaskContent[i].split("^");
					arrTime[i-1] = arr[2];
					arrTitle[i-1] =arr[1];
					arrTask[i-1] = arr[0];
				}
				
				var oldArrTime = arrTime;
				arrTime = uniqArray(arrTime);
				var resultArr = [];

				arrTime = squenceTime(arrTime);

				for (var i in arrTime) {

					resultArr[i] = arrTime[i];
					for (var j in arrTitle) {
						if (arrTime[i] === oldArrTime[j]) {
							resultArr[i] =  resultArr[i] + "^" + arrTask[j] + "^" + arrTitle[j];
						}
					}
				}

				var ulTime = document.getElementsByClassName("li-time")[0];

				var mytitle = "";
				for (var i in resultArr) {
					
					if　(resultArr[i].split("^")[1] === selectedTask) {
						mytitle = resultArr[i].split("^")[2];
						break;
					}
				}

				if (mytitle !== "") {
					displayTaskContent(selected, liSelect, arrDescript, mytitle);
				} else {
					for (var i in arrDescript) {
						if (i !== 1) {				
							document.getElementById(arrDescript[i]).style.display = "none";
						}
					}
					document.getElementById(arrDescript[1]).style.display = "block";
			
					var displayTask = document.getElementById(arrDescript[1]);
					displayTask.getElementsByClassName("task-title")[0].innerHTML = "";
					displayTask.getElementsByTagName("time")[0].innerHTML = "";
					displayTask.getElementsByClassName("task-content")[0].innerHTML = "";					
				}

				for (var i in arrTime) {
					var liTime = document.createElement("li"); 
					var allTask = resultArr[i];
					var arrTask = allTask.split("^");
					
					for (var j = 1; j < arrTask.length; j+=2) {
						
						if (arrTask[j] === selectedTask && oStorage.getItem(arrTask[j+1])==="finish" ) {
							console.log("finish")
							liTime.innerHTML = arrTime[i];
							var ulCont = document.createElement("ul");
							ulCont.setAttribute("class", "li-cont");

							var liCont = document.createElement("li");

							liCont.innerHTML = arrTask[j + 1];
							ulCont.appendChild(liCont);

							(function() {
								liCont.onclick = function() {
									displayTaskContent(selected, liSelect, arrDescript, this.innerHTML);
								}
							})();
							liTime.appendChild(ulCont);													
						}					
					}
					ulTime.appendChild(liTime);
				}
				document.getElementsByClassName("list")[0].appendChild(ulTime);
			}
		}
	}	
}

function loadNotFinishTask() {
	
	var selected = document.getElementsByClassName("selected")[0];
	var arrDescript = ["task-finish", "task-display", "task-edit", "task-new"];

	if (document.getElementsByClassName("li-select").length !== 0) {

		var liSelect = document.getElementsByClassName("li-select")[0];
		var selectedTask = liSelect.getAttribute("id");

		if(oStorage.getItem(selected.getAttribute("id") + "content") !== null && oStorage.getItem(selected.getAttribute("id") + "content") !== "") {
			
			var taskData = oStorage.getItem(selected.getAttribute("id") + "content");
			
			if (taskData.length !== 0) {
				
				var arrTaskContent = taskData.split("&");
				var timetitleArr = [];
				var arrTime = [];
				var arrTitle = [];
				var arrTask = []
				
				for (var i = 1; i < arrTaskContent.length; i++) {

					var arr = arrTaskContent[i].split("^");
					arrTime[i-1] = arr[2];
					arrTitle[i-1] =arr[1];
					arrTask[i-1] = arr[0];
				}
				
				var oldArrTime = arrTime;
				arrTime = uniqArray(arrTime);
				var resultArr = [];

				arrTime = squenceTime(arrTime);

				for (var i in arrTime) {
					resultArr[i] = arrTime[i];
					for (var j in arrTitle) {
						if (arrTime[i] === oldArrTime[j]) {
							resultArr[i] =  resultArr[i] + "^" + arrTask[j] + "^" + arrTitle[j];
						}
					}
				}

				var ulTime = document.getElementsByClassName("li-time")[0];

				var mytitle = "";
				for (var i in resultArr) {
				
					if　(resultArr[i].split("^")[1] === selectedTask) {
						mytitle = resultArr[i].split("^")[2];
						break;
					}
				}

				if (mytitle !== "") {
					displayTaskContent(selected, liSelect, arrDescript, mytitle);
				} else {
					for (var i in arrDescript) {
						if (i !== 1) {				
							document.getElementById(arrDescript[i]).style.display = "none";
						}
					}
					document.getElementById(arrDescript[1]).style.display = "block";
			
					var displayTask = document.getElementById(arrDescript[1]);
					displayTask.getElementsByClassName("task-title")[0].innerHTML = "";
					displayTask.getElementsByTagName("time")[0].innerHTML = "";
					displayTask.getElementsByClassName("task-content")[0].innerHTML = "";					
				}

				for (var i in arrTime) {
					var liTime = document.createElement("li"); 
					var allTask = resultArr[i];
					var arrTask = allTask.split("^");

					for (var j = 1; j < arrTask.length; j+=2) {
						
						if (arrTask[j] === selectedTask && (oStorage.getItem(arrTask[j+1])===null || oStorage.getItem(arrTask[j+1])==="")) {
							liTime.innerHTML = arrTime[i];
							var ulCont = document.createElement("ul");
							ulCont.setAttribute("class", "li-cont");

							var liCont = document.createElement("li");

							liCont.innerHTML = arrTask[j + 1];
							ulCont.appendChild(liCont);

							(function() {
								liCont.onclick = function() {

									displayTaskContent(selected, liSelect, arrDescript, this.innerHTML);
								}
							})();
							liTime.appendChild(ulCont);
						ulTime.appendChild(liTime);							
						}
					}
				}
				document.getElementsByClassName("list")[0].appendChild(ulTime);
			}
		}
	}
}

function displayTaskNum(sortId) {
	
	var thissort = document.getElementById(sortId);
	var thisul = thissort.getElementsByTagName("ul")[0];
	var allnum = 0;

	if (oStorage.getItem(sortId) !== null && oStorage.getItem(sortId) !== "") {

		var mysort = oStorage.getItem(sortId);
		var arrsort = mysort.split("$");
		for (var i = 1; i < arrsort.length; i++) {
			
			var num = getTaskNum(sortId, arrsort[i]);
			allnum += num;										       				
		}

		thissort.getElementsByClassName("all-num")[0].innerHTML = "("+ allnum + ")";		
				
	} else {
		thissort.getElementsByClassName("all-num")[0].innerHTML = "("+ 0 + ")";
	}
	return allnum;
}

function updateTaskNum(sortId, taskId) {

	var mainSort = document.getElementById(sortId);
	var subSort = document.getElementById(taskId);

	var mainSpan = mainSort.getElementsByClassName("all-num")[0].innerHTML;
	var subSpan = subSort.getElementsByTagName("span")[0].innerHTML;

	var mainNum = parseInt(mainSpan.split("(")[1].split(")")[0]) + 1;
	var subNum = parseInt(subSpan.split("(")[1].split(")")[0]) + 1;

	mainSort.getElementsByClassName("all-num")[0].innerHTML = "(" + mainNum + ")";
	subSort.getElementsByTagName("span")[0].innerHTML = "(" + subNum + ")"
}

//加载分类数据
function loadClassificationData(sortId) {
	
	if (oStorage.getItem(sortId) !== null && oStorage.getItem(sortId) !== "") {
		//console.log("...")
		var mysort = oStorage.getItem(sortId);
		var arrsort = mysort.split("$");
		var thissort = document.getElementById(sortId);
		var thisul = thissort.getElementsByTagName("ul")[0];
		var allnum = 0;
		if (document.getElementsByClassName("selected").length !== 0) {
			document.getElementsByClassName("selected")[0].setAttribute("class", "");			
		}

		thissort.setAttribute("class", "selected");
		for (var i = 1; i < arrsort.length; i++) {

			(function(x) {
				var newSortLi = document.createElement("li");

				var num = getTaskNum(sortId, arrsort[x]);
				allnum += num;
				newSortLi.innerHTML = '<img class="li-img" src="images/file.png">'+ arrsort[x] +'<span>('+ num +')</span><img class="delete" src="images/delete.png">';
				newSortLi.setAttribute("id", arrsort[x]);	
				thisul.appendChild(newSortLi);

				newSortLi.onclick = function(event) {
			
					var event = window.event || event;
					if (event && event.stopPropagation) {
            			event.stopPropagation();    
        			} else {
            			event.cancelBubble=true;
        			}

					var selectedLi = document.getElementsByClassName("li-select");
			
					if (selectedLi.length === 0) {
				
						newSortLi.setAttribute("class", "li-select");
						newSortLi.parentNode.parentNode.setAttribute("class", "selected");
					} else {
				
						selectedLi[0].setAttribute("class", "");
						newSortLi.setAttribute("class", 'li-select');

						if(selectedLi[0] !== undefined) {
							selectedLi[0].parentNode.parentNode.setAttribute("class", "");
						}
						newSortLi.parentNode.parentNode.setAttribute("class", "selected");
					}

					clearTaskList();
					loadAllSortTask();
				}

				newSortLi.onmouseover = function() {

					var deleteImg = this.getElementsByClassName("delete")[0];			
					deleteImg.style.opacity = 1.0;

					deleteImg.onclick = function(event) {

						console.log("...");
				
						var event = window.event || event;
						if (event && event.stopPropagation){
            				event.stopPropagation();    
       	 				}
        				else {
            				event.cancelBubble=true;
        				}

        				var confi = confirm("确认删除该类别？");

						if (this.style.opacity == 1.0 && confi) {
					
							var deleteLi = this.parentNode;
							var deleteSort = deleteLi.parentNode.parentNode;
							var strSort = oStorage.getItem(deleteSort.getAttribute("id"));
					
							strSort = strSort.replace("$"+ deleteLi.getAttribute("id"), "");
							oStorage.setItem(deleteSort.getAttribute("id"), strSort);
				
							deleteLi.parentNode.removeChild(deleteLi);	
							document.getElementById(sortId).getElementsByTagName("ul")[0].innerHTML = "";

							deleteTaskContent(sortId, newSortLi.getAttribute("id"));
							if (loadClassificationData("ife")) {
								if (loadClassificationData("graduation")) {
									if (loadClassificationData("association")) {
										if (loadClassificationData("family")) {
											loadClassificationData("other");
										}
									}
								}
							}
							selectDefaultClass();

							clearTaskList();
							loadAllSortTask();	
							displayTaskNum(sortId);
							displayAllTaskNum();			
						}
					}		
				}

				newSortLi.onmouseout = function() {
					var deleteImg = this.getElementsByClassName("delete")[0];
			
					deleteImg.style.opacity = 0;
				}	
			})(i);
		}

		thissort.getElementsByClassName("all-num")[0].innerHTML = "("+ allnum + ")";
		return false;
	} else {
		return true;
	}
	
}

function getTaskNum(sortId, taskId) {

	var taskContent = oStorage.getItem(sortId + "content");
	var num = 0;
	if (taskContent !== null && taskContent !== "") {

		var arrContent = taskContent.split("&");
		for (var i = 1; i < arrContent.length; i++) {

			if (arrContent[i].split("^")[0] === taskId) {
				num ++;
			}
		}
	}
	return num;
}

function deleteTaskContent(mainId, subId) {

	if (oStorage.getItem(mainId + "content") !== null && oStorage.getItem(mainId + "content") !== "") {
		var mainTask = oStorage.getItem(mainId + "content");
	
		var arrMain = mainTask.split("&");
		var newMain = "";
		for (var i = 1; i < arrMain.length; i++) {
			var arrSub = arrMain[i].split("^");
			if (arrSub[0] !== subId) {
				newMain = newMain + "&" + arrMain[i];
			}
		}

		oStorage.setItem(mainId + "content", newMain);		
	}

	//clearTaskList();
	//loadAllSortTask();	
}

//选中默认分类
function selectDefaultClass() {
	//console.log("default");
	var sortList = document.getElementById("sort");
	var allSort = sortList.getElementsByTagName("ul");
	
	var i = 1;
	while (i < allSort.length) {

		 if(allSort[i].length !== 0) {
		 	if (allSort[i].getElementsByTagName("li").length !== 0) {

		 		var sortTask = allSort[i].getElementsByTagName("li");		 		
		 		sortTask[0].setAttribute("class", "li-select");
		 		allSort[i].parentNode.setAttribute("class", "selected");
		 		break;
		 	}
		 }
		 i++;
	}

	if(document.getElementsByClassName("selected").length == 0) {
		document.getElementById("ife").setAttribute("class", "selected");
	}
}

function addNewSort() {

	var name = prompt("请输入任务分类名字：", "");
	if (name != null && name !== "") {

		var selectedClass = document.getElementsByClassName("selected")[0];
		var selectedId = selectedClass.getAttribute("id");
		var selectedVal = oStorage.getItem(selectedId);
	
		if (selectedVal === null) {
			selectedVal = "";
		}

		selectedVal = selectedVal + '$' + name;
		oStorage.setItem(selectedId, selectedVal);

		var newSortLi = document.createElement("li");
		newSortLi.innerHTML = '<img class="li-img" src="images/file.png">'+ name +'<span>(0)</span><img class="delete" src="images/delete.png">';
		newSortLi.setAttribute("id", name);

		if (document.getElementsByClassName("li-select").length !== 0) {
			document.getElementsByClassName("li-select")[0].setAttribute("class", "");
		}

		newSortLi.setAttribute("class", "li-select");
		selectedClass.getElementsByTagName("ul")[0].appendChild(newSortLi);

        clearTaskList();
        loadAllSortTask();  
		//增加选中监听事件
		newSortLi.onclick = function(event) {
			
			var event = window.event || event;
			if (event && event.stopPropagation){
            	event.stopPropagation();    
        	}
        	else {
            	event.cancelBubble=true;
        	}

			var selectedLi = document.getElementsByClassName("li-select");
			
			if (selectedLi.length === 0) {
				
				newSortLi.setAttribute("class", "li-select");
				newSortLi.parentNode.parentNode.setAttribute("class", "selected");
			} else {
				
				selectedLi[0].setAttribute("class", "");
				newSortLi.setAttribute("class", 'li-select');

				 if(selectedLi[0] !== undefined) {
					selectedLi[0].parentNode.parentNode.setAttribute("class", "");
				}

				newSortLi.parentNode.parentNode.setAttribute("class", "selected");
			}
            clearTaskList();
            loadAllSortTask();  
		}

		//增加删除监听事件
		newSortLi.onmouseover = function() {

			var deleteImg = this.getElementsByClassName("delete")[0];			
			deleteImg.style.opacity = 1.0;

			deleteImg.onclick = function(event) {
				
				var event = window.event || event;
				if (event && event.stopPropagation){
            		event.stopPropagation();    
       	 		}
        		else {
            		event.cancelBubble=true;
        		}

        		var confi = confirm("确认删除该类别？");

				if (this.style.opacity == 1.0 && confi) {
					
					var deleteLi = this.parentNode;
					var deleteSort = deleteLi.parentNode.parentNode;
					var strSort = oStorage.getItem(deleteSort.getAttribute("id"));
					
					strSort = strSort.replace("$"+ deleteLi.getAttribute("id"), "");
					oStorage.setItem(deleteSort.getAttribute("id"), strSort);
					deleteLi.parentNode.removeChild(deleteLi);	
						
					deleteTaskContent(selectedId, newSortLi.getAttribute("id"));

					document.getElementById(selectedId).getElementsByTagName("ul")[0].innerHTML = "";

					if (loadClassificationData("ife")) {
						if (loadClassificationData("graduation")) {
							if (loadClassificationData("association")) {
								if (loadClassificationData("family")) {
									loadClassificationData("other");
								}
							}
						}
					}
					selectDefaultClass();
 					clearTaskList();
                    loadAllSortTask();      
                    displayTaskNum(selectedId);
                    displayAllTaskNum();  
					
				}
				//console.log(selectedId);

			}		
		}

		newSortLi.onmouseout = function() {

			var deleteImg = this.getElementsByClassName("delete")[0];			
			deleteImg.style.opacity = 0;
		}

		//clearTaskList();
		//loadAllSortTask();
		//selectedClass.getElementsByClassName("all-num")[0].innerHTML = "("+ allnum + ")";
	}
}

function addNewTask() {

	var liSelect = document.getElementsByClassName("li-select");
	var arrDescript = ["task-finish", "task-display", "task-edit", "task-new"];

	if (liSelect.length !== 0) {

		for (var i in arrDescript) {	
				document.getElementById(arrDescript[i]).style.display = "none";
		}

		document.getElementById(arrDescript[3]).style.display = "block";

		var taskNew = document.getElementById(arrDescript[3]);
		var sureBtn = taskNew.getElementsByClassName("sure")[0];
		var quitBtn = taskNew.getElementsByClassName("quit")[0];

		taskNew.getElementsByClassName("task-title")[0].value = "";
		taskNew.getElementsByClassName("time")[0].value = "";
		taskNew.getElementsByClassName("task-content")[0].value = "";		

		sureBtn.onclick = function() {

			var title = taskNew.getElementsByClassName("task-title")[0].value;
			var time = taskNew.getElementsByClassName("time")[0].value;
			var content = taskNew.getElementsByClassName("task-content")[0].value;

			if (title.length > 15) {
				alert("标题字数不能超过15个字！");
			}			
			var titleContain = (title.indexOf("^") !== -1) || (title.indexOf("$") !== -1) || (title.indexOf("$") !== -1);
			var contentContain = (content.indexOf("^") !== -1) || (content.indexOf("$") !== -1) || (content.indexOf("$") !== -1);
			if (titleContain || contentContain) {
				alert("标题或者内容中不能包括$、&、^字符！");
			}
			if (isRepeat(title)) {
				alert("标题不能重复，请重新输入！");
			}
			if (content.length > 500) {
				alert("内容字数不能超过500个字！");
			}

			if (isRightDate(time) && (title.length <=15) && (content.length <= 500) && !(titleContain || contentContain) && !isRepeat(title)) {
				
				var belongMainSort = document.getElementsByClassName("selected")[0];
				var belongSubSort = document.getElementsByClassName("li-select")[0];

				var oldContent = oStorage.getItem(belongMainSort.getAttribute("id")+"content");
				if (oldContent === null) {
					oldContent = "";
				}

				oStorage.setItem(belongMainSort.getAttribute("id")+"content", oldContent+"&"+belongSubSort.getAttribute("id")+"^"+title+"^"+time+"^"+content);
				displayTaskContent(belongMainSort, belongSubSort, arrDescript, title);

				clearTaskList();
			    loadAllSortTask();

			    var sortId = belongMainSort.getAttribute("id");
			    updateTaskNum(sortId, belongSubSort.getAttribute("id"));
			    displayAllTaskNum();
			}

		}

		quitBtn.onclick = function() {

			for (var i in arrDescript) {	
					document.getElementById(arrDescript[i]).style.display = "none";
			}

			document.getElementById(arrDescript[3]).style.display = "block";
			taskNew.getElementsByClassName("task-title")[0].value = "";
			taskNew.getElementsByClassName("time")[0].value = "";
			taskNew.getElementsByClassName("task-content")[0].value = "";		
		}
	} else {
		alert("请选择一个任务分类或者新建一个任务分类！");
	}
}

function isRepeat(title) {

	var ifeContent = oStorage.getItem("ifecontent");
	var graduationContent = oStorage.getItem("graduationcontent");
	var associationContent = oStorage.getItem("associationcontent");
	var familyContent = oStorage.getItem("familycontent");
	var otherContent = oStorage.getItem("othercontent");

	if (ifeContent !== null) {
		var isrepeat1 = (ifeContent.indexOf(title) !==-1);
	} 
	if (graduationContent !== null) {
		var isrepeat2 = (graduationContent.indexOf(title) !==-1);
	} 
	if (associationContent !== null) {
		var isrepeat3 = (associationContent.indexOf(title) !==-1);
	} 
	if (familyContent !== null) {
		var isrepeat4 = (familyContent.indexOf(title) !==-1);
	} 
	if (otherContent !== null) {
		var isrepeat5 = (otherContent.indexOf(title) !==-1);
	} 	

	if (isrepeat1 || isrepeat2 || isrepeat3 || isrepeat4 || isrepeat5) {
		return true;
	} else {
		return false;
	}
}

function isRightDate(time) {
	var reg = /^(\d{4})-(\d{2})-(\d{2})$/;  
	var arr = reg.exec(time);
	if (!reg.test(time) || RegExp.$2 > 12 || RegExp.$3 > 31){  
		alert("请保证输入的日期格式为yyyy-mm-dd且日期正确!");  
		return false;
	} else {
		return true;
	}
}

function displayTaskContent(belongMainSort, belongSubSort, arrDescript, mytitle) {

	var displayTask = document.getElementById(arrDescript[1]);
	var finishTask = document.getElementById(arrDescript[0]);

	var mainSortId = belongMainSort.getAttribute("id");
	var subSortId = belongSubSort.getAttribute("id");

	var allContent = oStorage.getItem(mainSortId + "content");
	var arrTaskContent = allContent.split("&");
	
	if (oStorage.getItem(mytitle) !== "finish") {

		for (var i in arrDescript) {
			if (i !== 1) {				
				document.getElementById(arrDescript[i]).style.display = "none";
			}
		}
		document.getElementById(arrDescript[1]).style.display = "block";

		for (var i in arrTaskContent) {

			if ((arrTaskContent[i].indexOf(subSortId) !== -1) && (arrTaskContent[i].indexOf(mytitle) !== -1)) {
				var arr = arrTaskContent[i].split("^");
				displayTask.getElementsByClassName("task-title")[0].innerHTML = arr[1];
				displayTask.getElementsByTagName("time")[0].innerHTML = arr[2];
				displayTask.getElementsByClassName("task-content")[0].innerHTML = arr[3];
			}
		}
		//给display页面的上的按钮增加监听事件
		addEventListenerToDisplay();		
	} else {
		for (var i in arrDescript) {
			if (i !== 0) {				
				document.getElementById(arrDescript[i]).style.display = "none";
			}
		}
		document.getElementById(arrDescript[0]).style.display = "block";

		for (var i in arrTaskContent) {

			if ((arrTaskContent[i].indexOf(subSortId) !== -1) && (arrTaskContent[i].indexOf(mytitle) !== -1)) {
				var arr = arrTaskContent[i].split("^");
				finishTask.getElementsByClassName("task-title")[0].innerHTML = arr[1];
				finishTask.getElementsByTagName("time")[0].innerHTML = arr[2];
				finishTask.getElementsByClassName("task-content")[0].innerHTML = arr[3];
			}
		}
	}
}

function addEventListenerToDisplay() {

	var displayTask = document.getElementById("task-display");
	var arrImg = displayTask.getElementsByTagName("img");
	var arrDescript = ["task-finish", "task-display", "task-edit", "task-new"];
	var oldTitle = displayTask.getElementsByClassName("task-title")[0].innerHTML;
	var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
	var oldContent = displayTask.getElementsByClassName("task-content")[0].innerHTML;

	arrImg[0].onclick = function() {

		var title = displayTask.getElementsByClassName("task-title")[0].innerHTML;
		var time = displayTask.getElementsByTagName("time")[0].innerHTML;
		var content = displayTask.getElementsByClassName("task-content")[0].innerHTML;	

		var confi = confirm("是否确认完成？");

		if (confi) {
			oStorage.setItem(title, "finish");
			//跳到finish页面
			for (var i in arrDescript) {

				document.getElementById(arrDescript[i]).style.display = "none";
			}
			document.getElementById(arrDescript[0]).style.display = "block";	

			var finishTask = document.getElementById("task-finish");
			
			finishTask.getElementsByClassName("task-title")[0].innerHTML = title;
			finishTask.getElementsByTagName("time")[0].innerHTML = time;
			finishTask.getElementsByClassName("task-content")[0].innerHTML = content;	
			
			clearTaskList();
			loadAllSortTask();

			for (var i in arrDescript) {

					document.getElementById(arrDescript[i]).style.display = "none";
			}
			document.getElementById(arrDescript[0]).style.display = "block";	
		}
	}

	arrImg[1].onclick = function() {

		var belongMainSort = document.getElementsByClassName("selected")[0];
		var belongSubSort = document.getElementsByClassName("li-select")[0];
		var mainSortId = belongMainSort.getAttribute("id");
		var subSortId = belongSubSort.getAttribute("id");	
		var taskEdit = document.getElementById("task-edit");

		//跳到edit页面
		for (var i in arrDescript) {

				document.getElementById(arrDescript[i]).style.display = "none";
		}
		document.getElementById(arrDescript[2]).style.display = "block";

		var sureBtn = taskEdit.getElementsByClassName("sure")[0];
		var quitBtn = taskEdit.getElementsByClassName("quit")[0];

		taskEdit.getElementsByClassName("task-title")[0].value = oldTitle;
		taskEdit.getElementsByClassName("time")[0].value = oldTime;
		taskEdit.getElementsByClassName("task-content")[0].value = oldContent;		

		sureBtn.onclick = function() {

			var title = taskEdit.getElementsByClassName("task-title")[0].value;
			var time = taskEdit.getElementsByClassName("time")[0].value;
			var content = taskEdit.getElementsByClassName("task-content")[0].value;

			if (title.length > 15) {
				alert("标题字数不能超过15个字！");
			}
			var titleContain = (title.indexOf("^") !== -1) || (title.indexOf("$") !== -1) || (title.indexOf("$") !== -1);
			var contentContain = (content.indexOf("^") !== -1) || (content.indexOf("$") !== -1) || (content.indexOf("$") !== -1);
			if (titleContain || contentContain) {
				alert("标题或者内容中不能包括$、&、^字符！");
			}
			// if (isRepeat(title)) {
			// 	alert("标题不能重复，请重新输入！");
			// }
			if (content.length > 500) {
				alert("内容字数不能超过500个字！");
			}

			if (isRightDate(time) && (title.length <=15) && (content.length <= 500) && !(titleContain || contentContain)) {
				var belongMainSort = document.getElementsByClassName("selected")[0];
				var belongSubSort = document.getElementsByClassName("li-select")[0];

				var oldContent = oStorage.getItem(belongMainSort.getAttribute("id")+"content");
				if (oldContent === null) {
					oldContent = "";
				}

				var arrAll =  oStorage.getItem(belongMainSort.getAttribute("id")+"content").split("&");
				var setContent = "";

				for (var i = 1; i < arrAll.length; i++) {

					if (arrAll[i].split("^")[1] === oldTitle) {
						
						arrAll[i] = belongSubSort.getAttribute("id")+"^"+title+"^"+time+"^"+content;
						console.log(arrAll[i]); 
						setContent = setContent + "&" + arrAll[i];
					} else {
						setContent = setContent + "&" + arrAll[i];
					}
				}

				oStorage.setItem(belongMainSort.getAttribute("id")+"content", setContent);

				clearTaskList();
			    loadAllSortTask();
			}

		}

		var title = taskEdit.getElementsByClassName("task-title")[0].value;
		var time = taskEdit.getElementsByClassName("time")[0].value;
		var content = taskEdit.getElementsByClassName("task-content")[0].value;

		quitBtn.onclick = function() {

			for (var i in arrDescript) {	
					document.getElementById(arrDescript[i]).style.display = "none";
			}

			document.getElementById(arrDescript[2]).style.display = "block";

			taskEdit.getElementsByClassName("task-title")[0].value = title;
			taskEdit.getElementsByClassName("time")[0].value = time;
			taskEdit.getElementsByClassName("task-content")[0].content = "";	

			for (var i in arrDescript) {	
					document.getElementById(arrDescript[i]).style.display = "none";
			}	
			document.getElementById(arrDescript[1]).style.display = "block";	
		}		

	}
}

function addEventListenerToSort() {

	var arrSort = [];
	arrSort[0] = document.getElementById("ife");
	arrSort[1] = document.getElementById("graduation");
	arrSort[2] = document.getElementById("association");
	arrSort[3] = document.getElementById("family");
	arrSort[4] = document.getElementById("other");

	for (var i in arrSort) {

		(function(x) {
			arrSort[x].onclick = function() {

				document.getElementById("ife").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
				document.getElementById("graduation").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
				document.getElementById("association").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
				document.getElementById("family").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
				document.getElementById("other").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");

				this.getElementsByClassName("li-img")[0].setAttribute("src", "images/folder_white.png");
				//this.style.color = "#fff";
				//删除其他分类li
				if (document.getElementById("ife").getElementsByTagName("li").length !== 0) {
					deleteClassificationData("ife");
				}
				else if (document.getElementById("graduation").getElementsByTagName("li").length !== 0) {
					deleteClassificationData("graduation");
				}
				else if (document.getElementById("association").getElementsByTagName("li").length !== 0) {
					deleteClassificationData("association");
				}
				else if (document.getElementById("family").getElementsByTagName("li").length !== 0) {
					deleteClassificationData("family");
				}
				else if (document.getElementById("other").getElementsByTagName("li").length !== 0) {
					deleteClassificationData("other");
				}
				
				//加载数据
				if(this.getElementsByTagName("li").length === 0) {
					loadClassificationData(arrSort[x].getAttribute("id"));
				}
				
				if (document.getElementsByClassName("selected").length !== 0) {
					var selectedSort = document.getElementsByClassName("selected")[0];

					selectedSort.setAttribute("class", "");
					this.setAttribute("class", "selected");

					if (document.getElementsByClassName("li-select").length !== 0) {
						document.getElementsByClassName("li-select")[0].setAttribute("class", "");
					}
		
					if (this.getElementsByTagName("li").length !== 0) {
		
						this.getElementsByTagName("li")[0].setAttribute("class", "li-select");					
					}			
				} else {
					this.setAttribute("class", "selected");
				}
				clearTaskList();
				loadAllSortTask();				
			}
		})(i);
	}	
}

function deleteClassificationData(sortId) {

	var sort = document.getElementById(sortId);
	var sortLi = sort.getElementsByTagName("li");
	
	while (sortLi.length !== 0) {
		sort.getElementsByTagName("ul")[0].removeChild(sortLi[0]);
	}
}


