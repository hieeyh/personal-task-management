//因为循环依赖将该事件单独拿出
define(['global', 'displaytask', 'taskcontent', 'decideinput'], 
    function(global, displaytask, taskcontent, decideinput) {

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

    return {
        addEventListenerToDisplay: function() {
            var displayTask = document.getElementById("task-display");
            var arrImg = displayTask.getElementsByTagName("img");

            if (global.isGetClass) {
                var oldTitle = displayTask.getElementsByClassName("task-title")[0].innerHTML;
                var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
                var oldContent = displayTask.getElementsByClassName("task-content")[0].innerHTML;        
            } else {
                var oldTitle = global.document.getElementsByClassName("task-title", displayTask)[0].innerHTML;
                var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
                var oldContent = global.document.getElementsByClassName("task-content", displayTask)[0].innerHTML;
            }

            arrImg[0].onclick = function() {
                if (global.isGetClass) {
                    var title = displayTask.getElementsByClassName("task-title")[0].innerHTML;
                    var time = displayTask.getElementsByTagName("time")[0].innerHTML;
                    var content = displayTask.getElementsByClassName("task-content")[0].innerHTML;        
                } else {
                    var title = global.document.getElementsByClassName("task-title", displayTask)[0].innerHTML;
                    var time = displayTask.getElementsByTagName("time")[0].innerHTML;
                    var content = global.document.getElementsByClassName("task-content", displayTask)[0].innerHTML;
                }

                var confi = confirm("是否确认完成？");

                if (confi) {
                    global.oStorage.setItem(title, "finish");
                    //跳到finish页面
                    require("taskcontent").changeTaskContent(0, title, time, content);            
                    require("displaytask").clearTaskList();
                    require("displaytask").loadAllSortTask();

                    for (var i = 0; i < 4; i++) {
                            document.getElementById(global.arrDescript[i]).style.display = "none";
                    }
                    document.getElementById(global.arrDescript[0]).style.display = "block";    
                }
            }

            arrImg[1].onclick = function() {
                if (global.isGetClass) {
                    var belongMainSort = document.getElementsByClassName("selected")[0];
                    var belongSubSort = document.getElementsByClassName("li-select")[0];
                    var oldTitle = displayTask.getElementsByClassName("task-title")[0].innerHTML;
                    var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
                    var oldContent = displayTask.getElementsByClassName("task-content")[0].innerHTML;
                } else {
                    var belongMainSort = global.document.getElementsByClassName("selected")[0];
                    var belongSubSort = global.document.getElementsByClassName("li-select")[0];
                    var oldTitle = document.getElementsByClassName("task-title", displayTask)[0].innerHTML;
                    var oldTime = displayTask.getElementsByTagName("time")[0].innerHTML;
                    var oldContent = document.getElementsByClassName("task-content", displayTask)[0].innerHTML;
                }
                
                var mainSortId = belongMainSort.getAttribute("id");
                var subSortId = belongSubSort.getAttribute("id");   
                var taskEdit = document.getElementById("task-edit");

                //跳到edit页面
                require("taskcontent").changeTaskContent(2, oldTitle, oldTime, oldContent);
                if (global.isGetClass) {
                    var sureBtn = taskEdit.getElementsByClassName("sure")[0];
                    var quitBtn = taskEdit.getElementsByClassName("quit")[0];              
                } else {
                    var sureBtn = global.document.getElementsByClassName("sure", taskEdit)[0];
                    var quitBtn = global.document.getElementsByClassName("quit", taskEdit)[0];
                }
          
                sureBtn.onclick = function() {
                    if (global.isGetClass) {
                        var title = taskEdit.getElementsByClassName("task-title")[0].value;
                        var time = taskEdit.getElementsByClassName("time")[0].value;
                        var content = taskEdit.getElementsByClassName("task-content")[0].value;                
                    } else {
                        var title = global.document.getElementsByClassName("task-title", taskEdit)[0].value;
                        var time = global.document.getElementsByClassName("time", taskEdit)[0].value;
                        var content = global.document.getElementsByClassName("task-content", taskEdit)[0].value; 
                    }

                    var isRight = decideinput.isInputTaskRight(title, content);

                    if (decideinput.isRightDate(time) && isRight) {
                        if (global.isGetClass) {
                            var belongMainSort = document.getElementsByClassName("selected")[0];
                            var belongSubSort = document.getElementsByClassName("li-select")[0];
                        } else {
                            var belongMainSort = global.document.getElementsByClassName("selected")[0];
                            var belongSubSort = global.document.getElementsByClassName("li-select")[0];
                        }
                        
                        var oldContent = global.oStorage.getItem(belongMainSort.getAttribute("id")+"content");

                        if (oldContent === null) {
                            oldContent = "";
                        }

                        var arrAll =  global.oStorage.getItem(belongMainSort.getAttribute("id")+"content").split("&");
                        var setContent = "";

                        for (var i = 1; i < arrAll.length; i++) {
                            if (arrAll[i].split("^")[1] === oldTitle) {                        
                                arrAll[i] = belongSubSort.getAttribute("id")+"^"+title+"^"+time+"^"+content; 
                                setContent = setContent + "&" + arrAll[i];
                            } else {
                                setContent = setContent + "&" + arrAll[i];
                            }
                        }

                        global.oStorage.setItem(belongMainSort.getAttribute("id")+"content", setContent);

                        require("taskcontent").changeTaskContent(1, title, time, content);
                        
                        if (global.isGetClass) {
                            var liCont = document.getElementsByClassName("li-cont");
                        } else {
                            var liCont = global.document.getElementsByClassName("li-cont");
                        }
                        
               
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
                            document.getElementById(global.arrDescript[i]).style.display = "none";
                    }

                    document.getElementById(global.arrDescript[2]).style.display = "block";
                    if (global.isGetClass) {
                        taskEdit.getElementsByClassName("task-title")[0].value = oldTitle;
                        taskEdit.getElementsByClassName("time")[0].value = oldTime;
                        taskEdit.getElementsByClassName("task-content")[0].content = "";                  
                    } else {
                        global.document.getElementsByClassName("task-title", taskEdit)[0].value = oldTitle;
                        global.document.getElementsByClassName("time", taskEdit)[0].value = oldTime;
                        global.document.getElementsByClassName("task-content", taskEdit)[0].content = "";   
                    }   

                    for (var i = 0; i < 4; i++) {    
                        document.getElementById(global.arrDescript[i]).style.display = "none";
                    }   
                    document.getElementById(global.arrDescript[1]).style.display = "block";    
                }       
            }
        },
        addEventToNewSort: function(newSortLi) {
            if (global.isGetClass) {
                var selectedLi = document.getElementsByClassName("li-select");
            } else {
                var selectedLi = global.document.getElementsByClassName("li-select");
            }
                        
            if (selectedLi.length === 0) {                
                newSortLi.setAttribute("class", "li-select");
                newSortLi.parentNode.parentNode.setAttribute("class", "selected");
            } else {                
                selectedLi[0].setAttribute("class", "");
                newSortLi.setAttribute("class", 'li-select');

                selectedLi[0].parentNode.parentNode.setAttribute("class", "");
                newSortLi.parentNode.parentNode.setAttribute("class", "selected");
            }
            require("displaytask").clearTaskList();
            require("displaytask").loadAllSortTask();              
        }        
    }
})