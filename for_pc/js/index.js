
window.onload = function() {   
    //防御触屏攻击
    if (top.location != location) {
        top.location = self.location;
    }
    var newSort = document.getElementById("new-sort");
    var newTask = document.getElementById("new-task");
    //给增加分类和增加任务按钮添加事件
    newSort.onclick = addNewSort;
    newTask.onclick = addNewTask;

    //加载分类数据，只加载最先有子分类的数据
    if (loadClassificationData("ife")) {
        if (loadClassificationData("graduation")) {
            if (loadClassificationData("association")) {
                if (loadClassificationData("family")) {
                    loadClassificationData("other");
                }
            }
        }
    }

    //显示主分类的任务数量
    displayAllTaskNum();    
    //选中一个默认分类
    selectDefaultClass();
    //给中间列的标签添加事件
    addEventListenerToSort();
    //加载中间列的相关数据
    loadAllSortTask();
    //给中间列的按钮添加事件
    addEventListenerToButton();
}

//全局变量
var oStorage = window.localStorage;
var arrDescript = ["task-finish", "task-display", "task-edit", "task-new"];
    
//兼容IE8不支持getElementsByClassName
if(!document.getElementsByClassName){  
    document.getElementsByClassName = function(className, element){  
        var children = (element || document).getElementsByTagName('*');  
        var elements = new Array();  
        for (var i = 0; i< children.length; i++){  
            var child = children[i];  
            var classNames = child.className.split(' ');  
            for (var j = 0; j < classNames.length; j++){  
                if (classNames[j] == className){   
                    elements.push(child);  
                    break;  
                }  
            }  
        }   
        return elements;  
    };  
}  

if (getFuncParameters(document.getElementsByClassName) === undefined) {
    var isGetClass = true;
} else {
    var isGetClass = false;
}

//返回函数形参
function getFuncParameters(func) {
  if (typeof func == 'function') {
    var mathes = /[^(]+\(([^)]*)?\)/gm.exec(Function.prototype.toString.call(func));
    if (mathes[1]) {
      var args = mathes[1].replace(/[^,\w]*/g, '').split(',');
      return args;
    } 
  }
}

//兼容IE8不支持indexof方法
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt)
            return from;
        }
        return -1;
    }
}

//添加分类按钮事件处理函数
function addNewSort() {
    var name = prompt("请输入任务分类名字：", "");
    var islegal = name.indexOf("<script") !== -1 || name.indexOf("<iframe") !== -1 || name.indexOf("<img") !== -1 || name.indexOf("<video") !== -1 || name.indexOf("<audio") !== -1 || name.indexOf("<base") !== -1 || name.indexOf("<form") !== -1;
    if (islegal) {
        alert("请输入有效的任务分类名字！");
    }
    if (name !== null && name !== "" && !islegal) {
        var selectedSort = document.getElementsByClassName("selected")[0];
        var selectedId = selectedSort.getAttribute("id");
        var selectedVal = oStorage.getItem(selectedId);
        var newSortLi = document.createElement("li");
        var selectedLi = document.getElementsByClassName("li-select");
    
        if (selectedVal === null) {
            selectedVal = "";
        }

        selectedVal = selectedVal + '$' + name;
        oStorage.setItem(selectedId, selectedVal);

        newSortLi.innerHTML = '<img class="li-img" src="images/file.png">'+ name +
                                '<span>(0)</span><img class="delete" src="images/delete.png">';
        newSortLi.setAttribute("id", name);
        
        if (selectedLi.length !== 0) {
            selectedLi[0].setAttribute("class", "");
        }

        newSortLi.setAttribute("class", "li-select");
        selectedSort.getElementsByTagName("ul")[0].appendChild(newSortLi);

        clearTaskList();
        loadAllSortTask();  

        //增加选中监听事件
        newSortLi.onclick = function(event) {            
            var event = window.event || event;
            if (event && event.stopPropagation){
                event.stopPropagation();    
            }
            else {
                event.cancelBubble = true;
            }

            addEventToNewSort(newSortLi);
        }
        //增加删除监听事件
        newSortLi.onmouseover = function() {
            if (isGetClass) {
                var deleteImg = this.getElementsByClassName("delete")[0];
            } else {
                var deleteImg = document.getElementsByClassName("delete", this)[0];  
            }
                     
            deleteImg.style.opacity = 1.0;

            deleteImg.onclick = function(event) {
                var that = this;                
                //阻止事件冒泡
                var event = window.event || event;
                if (event && event.stopPropagation){
                    event.stopPropagation();    
                }
                else {
                    event.cancelBubble = true;
                }
                addEventToDeleteSort(that, selectedId, newSortLi);             
            }       
        }

        newSortLi.onmouseout = function() {
            if (isGetClass) {
                var deleteImg = this.getElementsByClassName("delete")[0];
            } else {
                var deleteImg = document.getElementsByClassName("delete", this)[0];  
            }          
            deleteImg.style.opacity = 0;
        }
    }
}

//给新添加的分类标签添加的点击事件内容
function addEventToNewSort(newSortLi) {
    var selectedLi = document.getElementsByClassName("li-select");
            
    if (selectedLi.length === 0) {                
        newSortLi.setAttribute("class", "li-select");
        newSortLi.parentNode.parentNode.setAttribute("class", "selected");
    } else {
                
        selectedLi[0].setAttribute("class", "");
        newSortLi.setAttribute("class", 'li-select');

        selectedLi[0].parentNode.parentNode.setAttribute("class", "");
        newSortLi.parentNode.parentNode.setAttribute("class", "selected");
    }
    clearTaskList();
    loadAllSortTask();  
}

//给新添加的分类标签添加的删除事件内容
function addEventToDeleteSort(that, selectedId, newSortLi) {   
    var confi = confirm("确认删除该类别？");
    
    if (confi) {           
        var deleteLi = that.parentNode;
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
        displayAllTaskNum();  
    }  
}

//添加任务按钮事件处理函数
function addNewTask() {
    var liSelect = document.getElementsByClassName("li-select");

    if (liSelect.length !== 0) {
        for (var i = 0; i < 4; i++) {    
                document.getElementById(arrDescript[i]).style.display = "none";
        }

        document.getElementById(arrDescript[3]).style.display = "block";

        var taskNew = document.getElementById(arrDescript[3]);

        if (isGetClass) {
            var sureBtn = taskNew.getElementsByClassName("sure")[0];
            var quitBtn = taskNew.getElementsByClassName("quit")[0];
            var newTitle = taskNew.getElementsByClassName("task-title")[0];
            var newTime = taskNew.getElementsByClassName("time")[0];
            var newContent = taskNew.getElementsByClassName("task-content")[0];            
        } else {
            var sureBtn = document.getElementsByClassName("sure", taskNew)[0];
            var quitBtn = document.getElementsByClassName("quit", taskNew)[0];
            var newTitle = document.getElementsByClassName("task-title", taskNew)[0];
            var newTime = document.getElementsByClassName("time", taskNew)[0];
            var newContent = document.getElementsByClassName("task-content", taskNew)[0];            
        }

        newTitle.value = "";
        newTime.value = "";
        newContent.value = ""; 

        //placeholder兼容IE8 IE9
        if(!isPlaceholer()){
            var titleVar = newTitle.getAttribute("placeholder");
            var timeVar = newTime.getAttribute("placeholder");
            var contentVar = newContent.getAttribute("placeholder");

            placeholder(newTitle);
            placeholder(newTime);
            placeholder(newContent);
        }

        sureBtn.onclick = function() {
            addEventToSureBtn(taskNew);
        }

        quitBtn.onclick = function() {
            for (var i = 0; i < 4; i++) {
                if (i !== 0) {      
                    document.getElementById(arrDescript[i]).style.display = "none";
                }
            }
            document.getElementById(arrDescript[0]).style.display = "block";
            
            var finishTask = document.getElementById(arrDescript[0]);

            if (isGetClass) {
                finishTask.getElementsByClassName("task-title")[0].innerHTML = "";
                finishTask.getElementsByTagName("time")[0].innerHTML = "";
                finishTask.getElementsByClassName("task-content")[0].innerHTML = "";                 
            } else {
                document.getElementsByClassName("task-title", finishTask)[0].innerHTML = "";
                finishTask.getElementsByTagName("time")[0].innerHTML = "";
                document.getElementsByClassName("task-content", finishTask)[0].innerHTML = "";                  
            }   
        }

    } else {
        alert("请选择一个任务分类或者新建一个任务分类！");
    }
}

//判断浏览器是否支持placeholder
function isPlaceholer(){
    var input = document.createElement("input");
    return "placeholder" in input;
}

function placeholder(input){
    var text = input.getAttribute("placeholder");
    var defaultValue = input.defaultValue;

    input.value = text;

    input.onfocus = function() {
        if(this.value == text) {
            this.value = "";
        }
    }

    input.onblur = function() {
        if(this.value == "") {
            this.value = text;
        }
    }
}   


//给编辑确认按钮的事件处理函数
function addEventToSureBtn(taskNew) {
    if (isGetClass) {
        var title = taskNew.getElementsByClassName("task-title")[0].value;
        var time = taskNew.getElementsByClassName("time")[0].value;
        var content = taskNew.getElementsByClassName("task-content")[0].value;        
    } else {
        var title = document.getElementsByClassName("task-title", taskNew)[0].value;
        var time = document.getElementsByClassName("time", taskNew)[0].value;
        var content = document.getElementsByClassName("task-content", taskNew)[0].value;        
    }

    var isRight = isInputTaskRight(title, content);

    if (isRepeat(title)) {
        alert("标题不能重复，请重新输入！");
    }

    if (isRightDate(time) && isRight && !isRepeat(title)) {                
        var belongMainSort = document.getElementsByClassName("selected")[0];
        var belongSubSort = document.getElementsByClassName("li-select")[0];
        var oldContent = oStorage.getItem(belongMainSort.getAttribute("id")+"content");
        var selectedId = belongMainSort.getAttribute("id");
        
        if (oldContent === null) {
            oldContent = "";
        }

        var setContent = oldContent+"&"+belongSubSort.getAttribute("id")+"^"+title+"^"+time+"^"+content;

        oStorage.setItem(belongMainSort.getAttribute("id")+"content", setContent);

        clearTaskList();
        loadAllSortTask();
        displayTaskContent(belongMainSort, belongSubSort, arrDescript, title);
        updateTaskNum(selectedId, belongSubSort.getAttribute("id"));
        displayAllTaskNum();
    }
}

//确认输入的任务内容是否正确
function isInputTaskRight(title, content) {
    var titleContain = (title.indexOf("^") !== -1) || (title.indexOf("$") !== -1) || (title.indexOf("$") !== -1);
    var contentContain = (content.indexOf("^") !== -1) || (content.indexOf("$") !== -1) || (content.indexOf("$") !== -1);
    var titleLegal = title.indexOf("<script") !== -1 || title.indexOf("<iframe") !== -1 || title.indexOf("<img") !== -1 || title.indexOf("<video") !== -1 || title.indexOf("<audio") !== -1 || title.indexOf("<base") !== -1 || title.indexOf("<form") !== -1;
    var contentLegal = content.indexOf("<script") !== -1 || content.indexOf("<iframe") !== -1 || content.indexOf("<img") !== -1 || content.indexOf("<video") !== -1 || content.indexOf("<audio") !== -1 || content.indexOf("<base") !== -1 || content.indexOf("<form") !== -1;
    
    if (title.length > 15) {
        alert("标题字数不能超过15个字！");
    }

    if (titleContain || contentContain) {
        alert("标题或者内容中不能包括$、&、^字符！");
    } 

    if (titleLegal || contentLegal) {
        alert("请输入合法的标题或内容！");
    } 

    if (content.length > 500) {
        alert("内容字数不能超过500个字！");
    }

    if ((title.length <=15) && (content.length <= 500) && !(titleContain || contentContain) && !titleLegal && !contentLegal) {
        return true;
    } else {
        return false;
    }
}

//判断标题是否重复
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

//判断输入的日期是否正确
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

//加载某分类下的数据
function loadClassificationData(selectedId) {   
    if (oStorage.getItem(selectedId) !== null && oStorage.getItem(selectedId) !== "") {        
        var selectedVal = oStorage.getItem(selectedId);
        var arrSort = selectedVal.split("$");
        var selectedSort = document.getElementById(selectedId);
        var thisUl = selectedSort.getElementsByTagName("ul")[0];
        var allnum = 0;
        var selected = document.getElementsByClassName("selected");

        if (selected.length !== 0) {
            selected[0].setAttribute("class", "");           
        }
        selectedSort.setAttribute("class", "selected");

        for (var i = 1; i < arrSort.length; i++) {
            (function(x) {
                var newSortLi = document.createElement("li");
                var num = getTaskNum(selectedId, arrSort[x]);

                allnum += num;
                newSortLi.innerHTML = '<img class="li-img" src="images/file.png">'+ arrSort[x] +
                                        '<span>('+ num +')</span><img class="delete" src="images/delete.png">';
                newSortLi.setAttribute("id", arrSort[x]);   
                thisUl.appendChild(newSortLi);

                newSortLi.onclick = function(event) {
            
                    var event = window.event || event;

                    if (event && event.stopPropagation){
                        event.stopPropagation();    
                    }
                    else {
                        event.cancelBubble = true;
                    }

                    addEventToNewSort(newSortLi);
                }

                newSortLi.onmouseover = function() {

                    var that = this;
                    if (isGetClass) {
                        var deleteImg = this.getElementsByClassName("delete")[0]; 
                    } else {
                        var deleteImg = document.getElementsByClassName("delete", that)[0]; 
                    }
                     

                    deleteImg.style.opacity = 1.0;

                    deleteImg.onclick = function(event) {
                        var that = this;
                
                        //阻止事件冒泡
                        var event = window.event || event;
                        if (event && event.stopPropagation){
                            event.stopPropagation();    
                        }
                        else {
                            event.cancelBubble = true;
                        }

                        addEventToDeleteSort(that, selectedId, newSortLi);             
                    }       
                }

                newSortLi.onmouseout = function() {

                var that = this;
                    if (isGetClass) {
                        var deleteImg = this.getElementsByClassName("delete")[0]; 
                    } else {
                        var deleteImg = document.getElementsByClassName("delete", that)[0]; 
                    }
                    deleteImg.style.opacity = 0;
                }  
            })(i);
        }
        if (isGetClass) {
            selectedSort.getElementsByClassName("all-num")[0].innerHTML = "("+ allnum + ")";
        } else {
            document.getElementsByClassName("all-num", selectedSort)[0].innerHTML = "("+ allnum + ")"; 
        }        
        return false;

    } else {
        return true;
    }   
}

//清空中间列的数据
function clearTaskList() {   
    var liTime = document.getElementsByClassName("li-time")[0];
    liTime.innerHTML = "";
}

//加载中间列及对应的右边列的数据
function loadAllSortTask() {   
    var selected = document.getElementsByClassName("selected")[0];
    var selectedLi = document.getElementsByClassName("li-select");

    if (isGetClass) {
        document.getElementById("ife").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
        document.getElementById("graduation").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
        document.getElementById("association").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
        document.getElementById("family").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
        document.getElementById("other").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
    
        //设置按钮样式
        document.getElementById(selected.getAttribute("id")).getElementsByClassName("li-img")[0].setAttribute("src", "images/folder_white.png");       
    } else {
        document.getElementsByClassName("li-img", document.getElementById("ife"))[0].setAttribute("src", "images/folder.png");
        document.getElementsByClassName("li-img", document.getElementById("graduation"))[0].setAttribute("src", "images/folder.png");
        document.getElementsByClassName("li-img", document.getElementById("association"))[0].setAttribute("src", "images/folder.png");
        document.getElementsByClassName("li-img", document.getElementById("family"))[0].setAttribute("src", "images/folder.png");
        document.getElementsByClassName("li-img", document.getElementById("other"))[0].setAttribute("src", "images/folder.png");
    
        //设置按钮样式
        document.getElementsByClassName("li-img", document.getElementById(selected.getAttribute("id")))[0].setAttribute("src", "images/folder_white.png");        
    }


    document.getElementsByClassName("checked")[0].setAttribute("class", "");
    document.getElementById("all-task").setAttribute("class", "checked");

    if (selectedLi.length !== 0) {
        var liSelect = selectedLi[0];
        var selectedTask = liSelect.getAttribute("id");
        var taskData = oStorage.getItem(selected.getAttribute("id") + "content");
        
        if(taskData !== null && taskData !== "") {          
            if (taskData.length !== 0) {               
                var arrTaskContent = taskData.split("&");
                var timetitleArr = [];
                var arrTime = [];
                var arrTitle = [];
                var arrTask = []
                
                for (var i = 1; i < arrTaskContent.length; i++) {
                    var arr = arrTaskContent[i].toString().split("^");

                    arrTime[i-1] = arr[2];
                    arrTitle[i-1] =arr[1];
                    arrTask[i-1] = arr[0];
                }
                
                var oldArrTime = arrTime;
                var resultArr = [];

                arrTime = uniqArray(arrTime);
                //给数组排序
                arrTime = squenceTime(arrTime);

                for (var i = 0; i < arrTime.length; i++) {
                    resultArr[i] = arrTime[i];

                    for (var j = 0; j < arrTitle.length; j++) {
                        if (arrTime[i] === oldArrTime[j]) {
                            resultArr[i] =  resultArr[i] + "^" + arrTask[j] + "^" + arrTitle[j];
                        }
                    }
                }
                
                var ulTime = document.getElementsByClassName("li-time")[0];
                var mytitle = "";

                for (var i = 0; i < resultArr.length; i++) {                  
                    if　(resultArr[i].split("^")[1] === selectedTask) {

                        mytitle = resultArr[i].split("^")[2];
                        break;
                    }
                }

                if (mytitle !== "") {
                    displayTaskContent(selected, liSelect, arrDescript, mytitle);
                } else {
                    for (var i = 0; i < 4; i++) {
                        if (i !== 0) {      
                            document.getElementById(arrDescript[i]).style.display = "none";
                        }
                    }
                    document.getElementById(arrDescript[0]).style.display = "block";
            
                    var finishTask = document.getElementById(arrDescript[0]);

                    if (isGetClass) {
                        finishTask.getElementsByClassName("task-title")[0].innerHTML = "";
                        finishTask.getElementsByTagName("time")[0].innerHTML = "";
                        finishTask.getElementsByClassName("task-content")[0].innerHTML = "";                          
                    } else {
                        document.getElementsByClassName("task-title", finishTask)[0].innerHTML = "";
                        finishTask.getElementsByTagName("time")[0].innerHTML = "";
                        document.getElementsByClassName("task-content", finishTask)[0].innerHTML = "";  
                    }                
                }
            
                for (var i = 0; i < arrTime.length; i++) {                    
                    var liTime = document.createElement("li"); 
                    var allTask = resultArr[i];
                    var arrTask = allTask.split("^");

                    liTime.innerHTML = arrTime[i];

                    for (var j = 1; j < arrTask.length; j+=2) {                       
                        if (arrTask[j] === selectedTask) {
                            var ulCont = document.createElement("ul");
                            var liCont = document.createElement("li");

                            ulCont.setAttribute("class", "li-cont");

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
            for (var i = 0; i < 4; i++) {
                if (i !== 0) { 
                    document.getElementById(arrDescript[i]).style.display = "none";
                }
            }
            document.getElementById(arrDescript[0]).style.display = "block";
            
            var finishTask = document.getElementById(arrDescript[0]);

            if (isGetClass) {
                finishTask.getElementsByClassName("task-title")[0].innerHTML = "";
                finishTask.getElementsByTagName("time")[0].innerHTML = "";
                finishTask.getElementsByClassName("task-content")[0].innerHTML = "";                          
            } else {
                document.getElementsByClassName("task-title", finishTask)[0].innerHTML = "";
                finishTask.getElementsByTagName("time")[0].innerHTML = "";
                document.getElementsByClassName("task-content", finishTask)[0].innerHTML = "";  
            }              
        }
    } else {            
        for (var i = 0; i < 4; i++) {
            if (i !== 0) {
                document.getElementById(arrDescript[i]).style.display = "none";
            }
        }
        document.getElementById(arrDescript[0]).style.display = "block";
            
        var finishTask = document.getElementById(arrDescript[0]);

        if (isGetClass) {
            finishTask.getElementsByClassName("task-title")[0].innerHTML = "";
            finishTask.getElementsByTagName("time")[0].innerHTML = "";
            finishTask.getElementsByClassName("task-content")[0].innerHTML = "";                          
        } else {
            document.getElementsByClassName("task-title", finishTask)[0].innerHTML = "";
            finishTask.getElementsByTagName("time")[0].innerHTML = "";
            document.getElementsByClassName("task-content", finishTask)[0].innerHTML = "";  
        }  
    }
}

//删除数组重复元素
function uniqArray(arr) {
    var newArr = [];

    for(var i = 0; i < arr.length; i++) {
        if(newArr.indexOf(arr[i])== -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

//给时间数组排序
function squenceTime(arrTime) {    
    var resultArr = [];

    for(var i = 0; i < arrTime.length; i++) {
        var arrDate = arrTime[i].toString().split("-");
        resultArr[i] = new Date(arrDate[0], arrDate[1] - 1, arrDate[2]).getTime();
    }
    
    resultArr = resultArr.sort();
   
    for (var i = 0; i < resultArr.length; i++) {
        var year = new Date(resultArr[i]).getFullYear();
        var month = new Date(resultArr[i]).getMonth() + 1;
        var date = new Date(resultArr[i]).getDate();
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        resultArr[i] = year + "-" + month + "-" + date;
    }
    return resultArr;
}

//选中一个默认分类
function selectDefaultClass() {    
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

//删除localstorage中被删除分类相关的任务数据
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
}

//显示最右边列表示的任务具体内容
function displayTaskContent(belongMainSort, belongSubSort, arrDescript, mytitle) {   
    var displayTask = document.getElementById(arrDescript[1]);
    var finishTask = document.getElementById(arrDescript[0]);
    var mainSortId = belongMainSort.getAttribute("id");
    var subSortId = belongSubSort.getAttribute("id");
    var allContent = oStorage.getItem(mainSortId + "content");
    var arrTaskContent = allContent.split("&");
    
    if (oStorage.getItem(mytitle) !== "finish") {
        for (var i = 0; i < 4; i++) {
            if (i !== 1) {              
                document.getElementById(arrDescript[i]).style.display = "none";
            }
        }
        document.getElementById(arrDescript[1]).style.display = "block";

        for (var i = 0; i < arrTaskContent.length; i++) {
            if ((arrTaskContent[i].indexOf(subSortId) !== -1) && (arrTaskContent[i].indexOf(mytitle) !== -1)) {
                var arr = arrTaskContent[i].split("^");

                if (isGetClass) {
                    displayTask.getElementsByClassName("task-title")[0].innerHTML = arr[1];
                    displayTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                    displayTask.getElementsByClassName("task-content")[0].innerHTML = arr[3];                    
                } else {
                    document.getElementsByClassName("task-title", displayTask)[0].innerHTML = arr[1];
                    displayTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                    document.getElementsByClassName("task-content", displayTask)[0].innerHTML = arr[3];
                }
            }
        }
        //给display页面的上的按钮增加监听事件
        addEventListenerToDisplay();  
    } else {       
        for (var i = 0; i < 4; i++) {
            if (i !== 0) {              
                document.getElementById(arrDescript[i]).style.display = "none";
            }
        }
        document.getElementById(arrDescript[0]).style.display = "block";

        for (var i = 0; i < arrTaskContent.length; i++) {
            var arr = arrTaskContent[i].toString().split("^");
            
            if (arr[0] === subSortId && arr[1] === mytitle) {                
                if (isGetClass) {
                    finishTask.getElementsByClassName("task-title")[0].innerHTML = arr[1];
                    finishTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                    finishTask.getElementsByClassName("task-content")[0].innerHTML = arr[3];                    
                } else {
                    document.getElementsByClassName("task-title", finishTask)[0].innerHTML = arr[1];
                    finishTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                    document.getElementsByClassName("task-content", finishTask)[0].innerHTML = arr[3];
                }
            }
        }
    }
}

//显示子分类的任务数量
function displayTaskNum(sortId) {   
    var selectedSort = document.getElementById(sortId);
    var allnum = 0;

    if (oStorage.getItem(sortId) !== null && oStorage.getItem(sortId) !== "") {
        var sortContent = oStorage.getItem(sortId);
        var arrSort = sortContent.split("$");

        for (var i = 1; i < arrSort.length; i++) {            
            var num = getTaskNum(sortId, arrSort[i]);
            allnum += num;                                                          
        }

        if (isGetClass) {
            selectedSort.getElementsByClassName("all-num")[0].innerHTML = "("+ allnum + ")";
        } else {
            document.getElementsByClassName("all-num", selectedSort)[0].innerHTML = "("+ allnum + ")";
        }                
    } else {
        if (isGetClass) {
            selectedSort.getElementsByClassName("all-num")[0].innerHTML = "("+ 0 + ")";
        } else {
            document.getElementsByClassName("all-num", selectedSort)[0].innerHTML = "("+ 0 + ")";
        }       
    }
    return allnum;
}

//返回对应分类的任务数
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

//更新任务数量
function updateTaskNum(sortId, taskId) {
    var mainSort = document.getElementById(sortId);
    var subSort = document.getElementById(taskId);
    if (isGetClass) {
        var mainSpan = mainSort.getElementsByClassName("all-num")[0].innerHTML;
    } else {
        var mainSpan = document.getElementsByClassName("all-num", mainSort)[0].innerHTML;
    }
    
    var subSpan = subSort.getElementsByTagName("span")[0].innerHTML;
    var mainNum = parseInt(mainSpan.split("(")[1].split(")")[0]) + 1;
    var subNum = parseInt(subSpan.split("(")[1].split(")")[0]) + 1;

    if (isGetClass) {
        mainSort.getElementsByClassName("all-num")[0].innerHTML = "(" + mainNum + ")";
    } else {
        document.getElementsByClassName("all-num", mainSort)[0].innerHTML = "(" + mainNum + ")";
    }
    
    subSort.getElementsByTagName("span")[0].innerHTML = "(" + subNum + ")"
}

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
    
    for (var i = 0; i < num.length; i++) {    
            wholeNum += num[i];
    }
    numSpan.innerHTML = wholeNum;
}

//给display页面的按钮添加事件
function addEventListenerToDisplay() {
    var displayTask = document.getElementById("task-display");
    var arrImg = displayTask.getElementsByTagName("img");

    if (isGetClass) {
        var oldTitle = displayTask.getElementsByClassName("task-title")[0].innerHTML;
        var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
        var oldContent = displayTask.getElementsByClassName("task-content")[0].innerHTML;        
    } else {
        var oldTitle = document.getElementsByClassName("task-title", displayTask)[0].innerHTML;
        var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
        var oldContent = document.getElementsByClassName("task-content", displayTask)[0].innerHTML;
    }

    arrImg[0].onclick = function() {
        if (isGetClass) {
            var title = displayTask.getElementsByClassName("task-title")[0].innerHTML;
            var time = displayTask.getElementsByTagName("time")[0].innerHTML;
            var content = displayTask.getElementsByClassName("task-content")[0].innerHTML;        
        } else {
            var title = document.getElementsByClassName("task-title", displayTask)[0].innerHTML;
            var time = displayTask.getElementsByTagName("time")[0].innerHTML;
            var content = document.getElementsByClassName("task-content", displayTask)[0].innerHTML;
        }

        var confi = confirm("是否确认完成？");

        if (confi) {
            oStorage.setItem(title, "finish");
            //跳到finish页面
            for (var i = 0; i < 4; i++) {
                document.getElementById(arrDescript[i]).style.display = "none";
            }
            document.getElementById(arrDescript[0]).style.display = "block";    

            var finishTask = document.getElementById("task-finish");
            
            if (isGetClass) {
                finishTask.getElementsByClassName("task-title")[0].innerHTML = title;
                finishTask.getElementsByTagName("time")[0].innerHTML = time;
                finishTask.getElementsByClassName("task-content")[0].innerHTML = content;                 
            } else {
                document.getElementsByClassName("task-title", finishTask)[0].innerHTML = title;
                finishTask.getElementsByTagName("time")[0].innerHTML = time;
                document.getElementsByClassName("task-content", finishTask)[0].innerHTML = content; 
            }
            
            clearTaskList();
            loadAllSortTask();

            for (var i = 0; i < 4; i++) {
                document.getElementById(arrDescript[i]).style.display = "none";
            }
            document.getElementById(arrDescript[0]).style.display = "block";    
        }
    }

    arrImg[1].onclick = function() {
        if (isGetClass) {
        var oldTitle = displayTask.getElementsByClassName("task-title")[0].innerHTML;
        var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
        var oldContent = displayTask.getElementsByClassName("task-content")[0].innerHTML;        
    } else {
        var oldTitle = document.getElementsByClassName("task-title", displayTask)[0].innerHTML;
        var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
        var oldContent = document.getElementsByClassName("task-content", displayTask)[0].innerHTML;
    }

        var belongMainSort = document.getElementsByClassName("selected")[0];
        var belongSubSort = document.getElementsByClassName("li-select")[0];
        var mainSortId = belongMainSort.getAttribute("id");
        var subSortId = belongSubSort.getAttribute("id");   
        var taskEdit = document.getElementById("task-edit");

        //跳到edit页面
        for (var i = 0; i < 4; i++) {
                document.getElementById(arrDescript[i]).style.display = "none";
        }
        document.getElementById(arrDescript[2]).style.display = "block";

        if (isGetClass) {
            var sureBtn = taskEdit.getElementsByClassName("sure")[0];
            var quitBtn = taskEdit.getElementsByClassName("quit")[0];
            taskEdit.getElementsByClassName("task-title")[0].value = oldTitle;
            taskEdit.getElementsByClassName("time")[0].value = oldTime;
            taskEdit.getElementsByClassName("task-content")[0].value = oldContent;                
        } else {
            var sureBtn = document.getElementsByClassName("sure", taskEdit)[0];
            var quitBtn = document.getElementsByClassName("quit", taskEdit)[0];
            document.getElementsByClassName("task-title", taskEdit)[0].value = oldTitle;
            document.getElementsByClassName("time", taskEdit)[0].value = oldTime;
            document.getElementsByClassName("task-content", taskEdit)[0].value = oldContent;      
        }
          
        sureBtn.onclick = function() {
            if (isGetClass) {
                var title = taskEdit.getElementsByClassName("task-title")[0].value;
                var time = taskEdit.getElementsByClassName("time")[0].value;
                var content = taskEdit.getElementsByClassName("task-content")[0].value;                
            } else {
                var title = document.getElementsByClassName("task-title", taskEdit)[0].value;
                var time = document.getElementsByClassName("time", taskEdit)[0].value;
                var content = document.getElementsByClassName("task-content", taskEdit)[0].value; 
            }
            
            var isRight = isInputTaskRight(title, content);

            if (isRightDate(time) && isRight) {
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
                        setContent = setContent + "&" + arrAll[i];
                    } else {
                        setContent = setContent + "&" + arrAll[i];
                    }
                }

                oStorage.setItem(belongMainSort.getAttribute("id")+"content", setContent);

                for (var i = 0; i < 4; i++) {
                    if (i !== 1) {      
                        document.getElementById(arrDescript[i]).style.display = "none";
                    }
                }
                document.getElementById(arrDescript[1]).style.display = "block";
            
                var displayTask = document.getElementById(arrDescript[1]);

                if (isGetClass) {
                    displayTask.getElementsByClassName("task-title")[0].innerHTML = title;
                    displayTask.getElementsByTagName("time")[0].innerHTML = time;
                    displayTask.getElementsByClassName("task-content")[0].innerHTML = content;                     
                } else {
                    document.getElementsByClassName("task-title", displayTask)[0].innerHTML = title;
                    document.getElementsByTagName("time", displayTask)[0].innerHTML = time;
                    document.getElementsByClassName("task-content", displayTask)[0].innerHTML = content; 
                }
                  
                var liCont = document.getElementsByClassName("li-cont");
               
                for(var i = 0; i < liCont.length; i++) {
                    if (liCont[i].getElementsByTagName("li").length !== 0) {
                        var subLi = liCont[i].getElementsByTagName("li");

                        for ( var j = 0; j < subLi.length; j++) {                            
                            if(subLi[j].innerHTML === oldTitle) {
                                subLi[j].innerHTML = title;
                                break;
                            }
                        }
                    }                       
                }               
            }

        }

        quitBtn.onclick = function() {
            for (var i = 0; i < 4; i++) {    
                    document.getElementById(arrDescript[i]).style.display = "none";
            }

            document.getElementById(arrDescript[2]).style.display = "block";

            if (isGetClass) {
                taskEdit.getElementsByClassName("task-title")[0].value = oldTitle;
                taskEdit.getElementsByClassName("time")[0].value = oldTime;
                taskEdit.getElementsByClassName("task-content")[0].content = "";                  
            } else {
                document.getElementsByClassName("task-title", taskEdit)[0].value = oldTitle;
                document.getElementsByClassName("time", taskEdit)[0].value = oldTime;
                document.getElementsByClassName("task-content", taskEdit)[0].content = "";   
            }   

            for (var i = 0; i < 4; i++) {    
                    document.getElementById(arrDescript[i]).style.display = "none";
            }   
            document.getElementById(arrDescript[1]).style.display = "block";    
        }       

    }
}

//给最左边列的主分类标签添加事件
function addEventListenerToSort() {
    var arrSort = [];

    arrSort[0] = document.getElementById("ife");
    arrSort[1] = document.getElementById("graduation");
    arrSort[2] = document.getElementById("association");
    arrSort[3] = document.getElementById("family");
    arrSort[4] = document.getElementById("other");

    for (var i = 0; i < 5; i++) {
        (function(x) {
            arrSort[x].onclick = function() {
                var that = this;
                if (isGetClass) {
                    document.getElementById("ife").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
                    document.getElementById("graduation").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
                    document.getElementById("association").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
                    document.getElementById("family").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
                    document.getElementById("other").getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");

                    this.getElementsByClassName("li-img")[0].setAttribute("src", "images/folder_white.png");                    
                } else {
                    document.getElementsByClassName("li-img", document.getElementById("ife"))[0].setAttribute("src", "images/folder.png");
                    document.getElementsByClassName("li-img", document.getElementById("graduation"))[0].setAttribute("src", "images/folder.png");
                    document.getElementsByClassName("li-img", document.getElementById("association"))[0].setAttribute("src", "images/folder.png");
                    document.getElementsByClassName("li-img", document.getElementById("family"))[0].setAttribute("src", "images/folder.png");
                    document.getElementsByClassName("li-img", document.getElementById("other"))[0].setAttribute("src", "images/folder.png");

                    document.getElementsByClassName("li-img", that)[0].setAttribute("src", "images/folder_white.png");
                }

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
                
                var selected = document.getElementsByClassName("selected");

                if (selected.length !== 0) {
                    var selectedSort = selected[0];
                    var selectedLi = document.getElementsByClassName("li-select");

                    selectedSort.setAttribute("class", "");
                    this.setAttribute("class", "selected");
                    
                    if (selectedLi.length !== 0) {
                        selectedLi[0].setAttribute("class", "");
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

//删除某个分类下的数据
function deleteClassificationData(sortId) {   
    var sort = document.getElementById(sortId);
    var sortLi = sort.getElementsByTagName("li");
    
    while (sortLi.length !== 0) {
        sort.getElementsByTagName("ul")[0].removeChild(sortLi[0]);
    }
}

//给中间列中的按钮添加事件
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
        loadHasOrNotFinishTask(1);        
    }

    hasFinish.onclick = function() {
        var checked = document.getElementsByClassName("checked")[0];

        checked.setAttribute("class", "");
        this.setAttribute("class", "checked");
        clearTaskList();
        loadHasOrNotFinishTask(0);        
    }
}

//中间列按钮的事件处理函数
function loadHasOrNotFinishTask(isFinish) {
    var selected = document.getElementsByClassName("selected")[0];

    if (document.getElementsByClassName("li-select").length !== 0) {
        var liSelect = document.getElementsByClassName("li-select")[0];
        var selectedTask = liSelect.getAttribute("id");
        var taskData = oStorage.getItem(selected.getAttribute("id") + "content");

        if(taskData !== null && taskData !== "") {                       
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
                var resultArr = [];

                arrTime = uniqArray(arrTime);

                arrTime = squenceTime(arrTime);

                for (var i = 0; i < arrTime.length; i++) {
                    resultArr[i] = arrTime[i];
                    for (var j = 0; j < arrTitle.length; j++) {
                        if (arrTime[i] === oldArrTime[j]) {
                            resultArr[i] =  resultArr[i] + "^" + arrTask[j] + "^" + arrTitle[j];
                        }
                    }
                }

                var ulTime = document.getElementsByClassName("li-time")[0];
                var mytitle = "";

                for (var i = 0; i < resultArr.length; i++) {                
                    if　(resultArr[i].split("^")[1] === selectedTask) {
                        mytitle = resultArr[i].split("^")[2];
                        break;
                    }
                }

                if (mytitle !== "") {
                    displayTaskContent(selected, liSelect, arrDescript, mytitle);
                } else {
                    for (var i = 0; i < 4; i++) {
                        if (i !== 1) {              
                            document.getElementById(arrDescript[i]).style.display = "none";
                        }
                    }
                    document.getElementById(arrDescript[1]).style.display = "block";
            
                    var displayTask = document.getElementById(arrDescript[1]);

                    if (isGetClass) {

                        displayTask.getElementsByClassName("task-title")[0].innerHTML = "";
                        displayTask.getElementsByTagName("time")[0].innerHTML = "";
                        displayTask.getElementsByClassName("task-content")[0].innerHTML = "";                          
                    } else {

                        document.getElementsByClassName("task-title", displayTask)[0].innerHTML = "";
                        document.getElementsByTagName("time", displayTask)[0].innerHTML = "";
                        document.getElementsByClassName("task-content", displayTask)[0].innerHTML = "";  
                    }                
                }

                var isDisplay = false;

                for (var i = 0; i < arrTime.length; i++) {
                    var liTime = document.createElement("li"); 
                    var allTask = resultArr[i];
                    var arrTask = allTask.split("^");
                
                    if (isFinish === 0) {                       
                        for (var j = 1; j < arrTask.length; j+=2) {
                            if (arrTask[j] === selectedTask && (oStorage.getItem(arrTask[j+1])==="finish")) {
                                liTime.innerHTML = arrTime[i];
                                var ulCont = document.createElement("ul");
                                var liCont = document.createElement("li");

                                ulCont.setAttribute("class", "li-cont");

                                liCont.innerHTML = arrTask[j + 1];
                                ulCont.appendChild(liCont);

                                (function() {
                                    liCont.onclick = function() {

                                        displayTaskContent(selected, liSelect, arrDescript, this.innerHTML);
                                    }
                                })();
                                liTime.appendChild(ulCont);
                                ulTime.appendChild(liTime);
                                if (!isDisplay) {
                                    displayTaskContent(selected, liSelect, arrDescript, arrTask[j+1]);  
                                    isDisplay = true;                                  
                                }                         
                            }                              
                        }
                        if (!isDisplay) {
                            for (var i = 0; i < 4; i++) {

                                if (i !== 0) {      
                                    document.getElementById(arrDescript[i]).style.display = "none";
                                }
                            }
                            document.getElementById(arrDescript[0]).style.display = "block";
            
                            var finishTask = document.getElementById(arrDescript[0]);

                            if (isGetClass) {
                                finishTask.getElementsByClassName("task-title")[0].innerHTML = "";
                                finishTask.getElementsByTagName("time")[0].innerHTML = "";
                                finishTask.getElementsByClassName("task-content")[0].innerHTML = "";                          
                            } else {
                                document.getElementsByClassName("task-title", finishTask)[0].innerHTML = "";
                                document.getElementsByTagName("time", finishTask)[0].innerHTML = "";
                                document.getElementsByClassName("task-content", finishTask)[0].innerHTML = "";  
                            }  
                        }
                    }

                    
                    if (isFinish === 1) {                        
                        for (var j = 1; j < arrTask.length; j+=2) {
                            if (arrTask[j] === selectedTask && (oStorage.getItem(arrTask[j+1])===null || oStorage.getItem(arrTask[j+1])==="")) {
                                liTime.innerHTML = arrTime[i];
                                var ulCont = document.createElement("ul");
                                var liCont = document.createElement("li");

                                ulCont.setAttribute("class", "li-cont");
                                liCont.innerHTML = arrTask[j + 1];
                                ulCont.appendChild(liCont);

                                (function() {
                                    liCont.onclick = function() {

                                        displayTaskContent(selected, liSelect, arrDescript, this.innerHTML);
                                    }
                                })();
                                liTime.appendChild(ulCont);
                                ulTime.appendChild(liTime);
                                if (!isDisplay) {
                                    displayTaskContent(selected, liSelect, arrDescript, arrTask[j+1]);  
                                    isDisplay = true;                                  
                                }                         
                            }                              
                        }
                        if (!isDisplay) {
                            for (var i = 0; i < 4; i++) {

                                if (i !== 0) {      
                                    document.getElementById(arrDescript[i]).style.display = "none";
                                }
                            }
                            document.getElementById(arrDescript[0]).style.display = "block";
            
                            var finishTask = document.getElementById(arrDescript[0]);

                            if (isGetClass) {
                                finishTask.getElementsByClassName("task-title")[0].innerHTML = "";
                                finishTask.getElementsByTagName("time")[0].innerHTML = "";
                                finishTask.getElementsByClassName("task-content")[0].innerHTML = "";                          
                            } else {
                                document.getElementsByClassName("task-title", finishTask)[0].innerHTML = "";
                                document.getElementsByTagName("time", finishTask)[0].innerHTML = "";
                                document.getElementsByClassName("task-content", finishTask)[0].innerHTML = "";  
                            }    
                        }
                    }
                }                  
                document.getElementsByClassName("list")[0].appendChild(ulTime);
            }
        }
    }
}
