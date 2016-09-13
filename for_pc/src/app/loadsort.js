//加载主分类相关数据的模块
define(['require', 'addevent', 'global', 'addeventsort'], 
    function(require, addevent, global, addeventsort) {
    
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

    function getTaskNum(sortId, taskId) {
        var taskContent = global.oStorage.getItem(sortId + "content");
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

    function displayTaskNum(sortId) {    
        var selectedSort = document.getElementById(sortId);
        var allnum = 0;

        if (global.oStorage.getItem(sortId) !== null && global.oStorage.getItem(sortId) !== "") {
            var sortContent = global.oStorage.getItem(sortId);
            var arrSort = sortContent.split("$");

            for (var i = 1; i < arrSort.length; i++) {            
                var num = getTaskNum(sortId, arrSort[i]);
                allnum += num;                                                          
            }

            if (global.isGetClass) {
                selectedSort.getElementsByClassName("all-num")[0].innerHTML = "("+ allnum + ")";
            } else {
                global.document.getElementsByClassName("all-num", selectedSort)[0].innerHTML = "("+ allnum + ")";
            }                
        } else {
            if (global.isGetClass) {
                selectedSort.getElementsByClassName("all-num")[0].innerHTML = "("+ 0 + ")";
            } else {
                global.document.getElementsByClassName("all-num", selectedSort)[0].innerHTML = "("+ 0 + ")";
            }       
        }
        return allnum;
    } 

    return {
        loadClassificationData: function(selectedId) {           
            if (global.oStorage.getItem(selectedId) !== null && global.oStorage.getItem(selectedId) !== "") {        
                var selectedVal = global.oStorage.getItem(selectedId);
                var arrSort = selectedVal.split("$");
                var selectedSort = document.getElementById(selectedId);
                var thisUl = selectedSort.getElementsByTagName("ul")[0];
                var allnum = 0;

                if (global.isGetClass) {
                    var selected = document.getElementsByClassName("selected");
                } else {
                    var selected = global.document.getElementsByClassName("selected");
                }
                

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
                            addeventsort.addEventToNewSort(newSortLi);
                        }

                        newSortLi.onmouseover = function() {
                            var that = this;
                            if (global.isGetClass) {
                                var deleteImg = this.getElementsByClassName("delete")[0]; 
                            } else {
                                var deleteImg = global.document.getElementsByClassName("delete", that)[0]; 
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
                                require("addevent").addEventToDeleteSort(that, selectedId, newSortLi);             
                            }       
                        }

                        newSortLi.onmouseout = function() {
                        var that = this;
                            if (global.isGetClass) {
                                var deleteImg = this.getElementsByClassName("delete")[0]; 
                            } else {
                                var deleteImg = global.document.getElementsByClassName("delete", that)[0]; 
                            }
                            deleteImg.style.opacity = 0;
                        }  
                    })(i);
                }

                if (global.isGetClass) {
                    selectedSort.getElementsByClassName("all-num")[0].innerHTML = "("+ allnum + ")";
                } else {
                    global.document.getElementsByClassName("all-num", selectedSort)[0].innerHTML = "("+ allnum + ")"; 
                }        
                return false;

            } else {
                return true;
            }              
        },
        deleteClassificationData: function(sortId) {    
            var sort = document.getElementById(sortId);
            var sortLi = sort.getElementsByTagName("li");
    
            while (sortLi.length !== 0) {
                sort.getElementsByTagName("ul")[0].removeChild(sortLi[0]);
            }
        },
        selectDefaultClass: function() {    
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

            if (global.isGetClass) {
                if(document.getElementsByClassName("selected").length == 0) {
                    document.getElementById("ife").setAttribute("class", "selected");
                }                    
            } else {
                if(global.document.getElementsByClassName("selected").length == 0) {
                    document.getElementById("ife").setAttribute("class", "selected");
                }                
            }
        },
        displayAllTaskNum: function() {
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
        },
        updateTaskNum: function(sortId, taskId) {
            var mainSort = document.getElementById(sortId);
            var subSort = document.getElementById(taskId);
            if (global.isGetClass) {
                var mainSpan = mainSort.getElementsByClassName("all-num")[0].innerHTML;
            } else {
                var mainSpan = global.document.getElementsByClassName("all-num", mainSort)[0].innerHTML;
            }
    
            var subSpan = subSort.getElementsByTagName("span")[0].innerHTML;
            var mainNum = parseInt(mainSpan.split("(")[1].split(")")[0]) + 1;
            var subNum = parseInt(subSpan.split("(")[1].split(")")[0]) + 1;

            if (global.isGetClass) {
                mainSort.getElementsByClassName("all-num")[0].innerHTML = "(" + mainNum + ")";
            } else {
                global.document.getElementsByClassName("all-num", mainSort)[0].innerHTML = "(" + mainNum + ")";
            }
    
            subSort.getElementsByTagName("span")[0].innerHTML = "(" + subNum + ")"            
        }
    }
});