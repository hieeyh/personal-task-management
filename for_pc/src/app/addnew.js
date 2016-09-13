//定义模块，用于添加分类和添加任务
define(['global', 'displaytask', 'addevent', 'taskcontent', 'addeventsort'], 
    function(global, displaytask, addevent, taskcontent, addeventsort) {

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

    var newSort = document.getElementById("new-sort");
    var newTask = document.getElementById("new-task");

    newSort.onclick = addNewSort;
    newTask.onclick = addNewTask;    

    function addNewSort() {
        var name = prompt("请输入任务分类名字：", "");
        if (name !== null && name !== "") {
            var islegal = name.indexOf("<script") !== -1 || name.indexOf("<iframe") !== -1 || name.indexOf("<img") !== -1 ||
                        name.indexOf("<video") !== -1 || name.indexOf("<audio") !== -1 || name.indexOf("<base") !== -1 || 
                        name.indexOf("<form") !== -1;
        }
        
        if (islegal) {
            alert("请输入有效的任务分类名字！");
        }
        if (name !== null && name !== "" && !islegal) {
            if (global.isGetClass) {
                var selectedSort = document.getElementsByClassName("selected")[0];
                var selectedLi = document.getElementsByClassName("li-select");            
            } else {
                var selectedSort = global.document.getElementsByClassName("selected")[0];
                var selectedLi = global.document.getElementsByClassName("li-select");
            }

            var selectedId = selectedSort.getAttribute("id");
            var selectedVal = global.oStorage.getItem(selectedId);
            var newSortLi = document.createElement("li");
           
            if (selectedVal === null) {
                selectedVal = "";
            }

            selectedVal = selectedVal + '$' + name;
            global.oStorage.setItem(selectedId, selectedVal);

            newSortLi.innerHTML = '<img class="li-img" src="images/file.png">'+ name +
                                '<span>(0)</span><img class="delete" src="images/delete.png">';
            newSortLi.setAttribute("id", name);
        
            if (selectedLi.length !== 0) {
                selectedLi[0].setAttribute("class", "");
            }

            newSortLi.setAttribute("class", "li-select");
            selectedSort.getElementsByTagName("ul")[0].appendChild(newSortLi);

            displaytask.clearTaskList();
            displaytask.loadAllSortTask();  

            //增加选中监听事件
            newSortLi.onclick = function(event) {            
                var event = window.event || event;
                if (event && event.stopPropagation){
                    event.stopPropagation();    
                }
                else {
                    event.cancelBubble = true;
                }

                addeventsort.addEventToNewSort(newSortLi);
            }

            //增加删除监听事件
            newSortLi.onmouseover = function() {
                if (global.isGetClass) {
                    var deleteImg = this.getElementsByClassName("delete")[0];
                } else {
                    var deleteImg = global.document.getElementsByClassName("delete", this)[0];  
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
                    addevent.addEventToDeleteSort(that, selectedId, newSortLi);             
                }       
            }

            newSortLi.onmouseout = function() {
                if (global.isGetClass) {
                    var deleteImg = this.getElementsByClassName("delete")[0];
                } else {
                    var deleteImg = global.document.getElementsByClassName("delete", this)[0];  
                }          
                deleteImg.style.opacity = 0;
            }
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

    function addNewTask() {
        if (global.isGetClass) {
            var liSelect = document.getElementsByClassName("li-select");
        } else {
            var liSelect = global.document.getElementsByClassName("li-select");
        }
        
        if (liSelect.length !== 0) {
            for (var i = 0; i < 4; i++) {    
                    document.getElementById(global.arrDescript[i]).style.display = "none";
            }

            document.getElementById(global.arrDescript[3]).style.display = "block";
            var taskNew = document.getElementById(global.arrDescript[3]);

            if (global.isGetClass) {
                var sureBtn = taskNew.getElementsByClassName("sure")[0];
                var quitBtn = taskNew.getElementsByClassName("quit")[0];
                var newTitle = taskNew.getElementsByClassName("task-title")[0];
                var newTime = taskNew.getElementsByClassName("time")[0];
                var newContent = taskNew.getElementsByClassName("task-content")[0];            
            } else {
                var sureBtn = global.document.getElementsByClassName("sure", taskNew)[0];
                var quitBtn = global.document.getElementsByClassName("quit", taskNew)[0];
                var newTitle = global.document.getElementsByClassName("task-title", taskNew)[0];
                var newTime = global.document.getElementsByClassName("time", taskNew)[0];
                var newContent = global.document.getElementsByClassName("task-content", taskNew)[0];            
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
                addevent.addEventToSureBtn(taskNew);
            }

            quitBtn.onclick = function() {
                taskcontent.changeTaskContent(0, "", "", "");
            }
        } else {
            alert("请选择一个任务分类或者新建一个任务分类！");
        }
    }  
});