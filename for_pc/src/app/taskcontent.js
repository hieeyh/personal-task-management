//定义处理最右边显示内容的模块
define(['global', 'addeventsort'], function(global, addeventsort) {

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

    return {
        displayTaskContent: function(belongMainSort, belongSubSort, arrDescript, mytitle) {    
            var displayTask = document.getElementById(arrDescript[1]);
            var finishTask = document.getElementById(arrDescript[0]);
            var mainSortId = belongMainSort.getAttribute("id");
            var subSortId = belongSubSort.getAttribute("id");
            var allContent = global.oStorage.getItem(mainSortId + "content");
            var arrTaskContent = allContent.split("&");
    
            if (global.oStorage.getItem(mytitle) !== "finish") {
                for (var i = 0; i < 4; i++) {             
                        document.getElementById(arrDescript[i]).style.display = "none";
                }
                document.getElementById(arrDescript[1]).style.display = "block";

                for (var i = 0; i < arrTaskContent.length; i++) {
                    if ((arrTaskContent[i].indexOf(subSortId) !== -1) && (arrTaskContent[i].indexOf(mytitle) !== -1)) {
                        var arr = arrTaskContent[i].split("^");

                        if (global.isGetClass) {
                            displayTask.getElementsByClassName("task-title")[0].innerHTML = arr[1];
                            displayTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                            displayTask.getElementsByClassName("task-content")[0].innerHTML = arr[3];                    
                        } else {
                            global.document.getElementsByClassName("task-title", displayTask)[0].innerHTML = arr[1];
                            displayTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                            global.document.getElementsByClassName("task-content", displayTask)[0].innerHTML = arr[3];
                        }
                    }
                }
                //给display页面的上的按钮增加监听事件
                addeventsort.addEventListenerToDisplay();        
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
                        if (global.isGetClass) {
                            finishTask.getElementsByClassName("task-title")[0].innerHTML = arr[1];
                            finishTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                            finishTask.getElementsByClassName("task-content")[0].innerHTML = arr[3];                    
                        } else {
                            global.document.getElementsByClassName("task-title", finishTask)[0].innerHTML = arr[1];
                            finishTask.getElementsByTagName("time")[0].innerHTML = arr[2];
                            global.document.getElementsByClassName("task-content", finishTask)[0].innerHTML = arr[3];
                        }
                    }
                }
            }
        },
        deleteTaskContent: function(mainId, subId) {
            if (global.oStorage.getItem(mainId + "content") !== null && global.oStorage.getItem(mainId + "content") !== "") {        
                var mainTask = global.oStorage.getItem(mainId + "content");
                var arrMain = mainTask.split("&");
                var newMain = "";

                for (var i = 1; i < arrMain.length; i++) {
                    var arrSub = arrMain[i].split("^");

                    if (arrSub[0] !== subId) {
                        newMain = newMain + "&" + arrMain[i];
                    }
                }
                global.oStorage.setItem(mainId + "content", newMain);      
            }   
        },
        changeTaskContent: function(index, title, time, content) {
            for (var i = 0; i < 4; i++) {
                    document.getElementById(global.arrDescript[i]).style.display = "none";
            }
            document.getElementById(global.arrDescript[index]).style.display = "block";
            
            var taskSort = document.getElementById(global.arrDescript[index]);
            if( index < 2) {
                if (global.isGetClass) {

                    taskSort.getElementsByClassName("task-title")[0].innerHTML = title;
                    taskSort.getElementsByTagName("time")[0].innerHTML = time;
                    taskSort.getElementsByClassName("task-content")[0].innerHTML = content;                          
                } else {

                    global.document.getElementsByClassName("task-title", taskSort)[0].innerHTML = title;
                    taskSort.getElementsByTagName("time")[0].innerHTML = time;
                    global.document.getElementsByClassName("task-content", taskSort)[0].innerHTML = content;  
                }  
            } else {
                if (global.isGetClass) {

                    taskSort.getElementsByClassName("task-title")[0].value = title;
                    taskSort.getElementsByClassName("time")[0].value = time;
                    taskSort.getElementsByClassName("task-content")[0].value = content;                          
                } else {

                    global.document.getElementsByClassName("task-title", taskSort)[0].value = title;
                    global.document.getElementsByClassName("time", taskSort)[0].value = time;
                    global.document.getElementsByClassName("task-content", taskSort)[0].value = content;  
                }  
            }
                        
        } 
    }
});