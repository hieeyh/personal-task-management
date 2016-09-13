//定义一些事件处理函数的模块
define(['global', 'taskcontent', 'displaytask', 'decideinput', 'loadsort'], 
    function(global, taskcontent, displaytask, decideinput, loadsort) {
   
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
        addEventToDeleteSort: function(that, selectedId, newSortLi) {   
            var confi = confirm("确认删除该类别？");
    
            if (confi) {           
                var deleteLi = that.parentNode;
                var deleteSort = deleteLi.parentNode.parentNode;
                var strSort = global.oStorage.getItem(deleteSort.getAttribute("id"));
              
                strSort = strSort.replace("$"+ deleteLi.getAttribute("id"), "");
                global.oStorage.setItem(deleteSort.getAttribute("id"), strSort);
                deleteLi.parentNode.removeChild(deleteLi);  
       
                taskcontent.deleteTaskContent(selectedId, newSortLi.getAttribute("id"));

                document.getElementById(selectedId).getElementsByTagName("ul")[0].innerHTML = "";

                var len = global.enSortName.length;
                
                if (loadsort.loadClassificationData("ife")) {
                    if (loadsort.loadClassificationData("graduation")) {
                        if (loadsort.loadClassificationData("association")) {
                            if (loadsort.loadClassificationData("family")) {
                                loadsort.loadClassificationData("other");
                            }
                        }
                    }
                }

                loadsort.selectDefaultClass(); 
                displaytask.clearTaskList();
                displaytask.loadAllSortTask();      
                loadsort.displayAllTaskNum();  
            }  
        },
        addEventListenerToSort: function() {
            var arrSort = [];
            var len = global.enSortName.length;

            for (var i = 0; i < len; i++) {
                arrSort[i] = document.getElementById(global.enSortName[i]);
            }

            for (var i = 0; i < 5; i++) {
                (function(x) {
                    arrSort[x].onclick = function() {
                        
                        var len = global.enSortName.length;
                        var that = this;
                        if (global.isGetClass) {
                            for (var j = 0; j < len; j++) {
                                document.getElementById(global.enSortName[j]).getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
                            }

                            this.getElementsByClassName("li-img")[0].setAttribute("src", "images/folder_white.png");                    
                        } else {
                            for (var j = 0; j < len; j++) {
                                global.document.getElementsByClassName("li-img", document.getElementById(global.enSortName[j]))[0].setAttribute("src", "images/folder.png");
                            }
                            global.document.getElementsByClassName("li-img", that)[0].setAttribute("src", "images/folder_white.png");
                        }

                        //删除其他分类li
                        for (var j = 0; j < len; j++) {
                            if (document.getElementById(global.enSortName[j]).getElementsByTagName("li").length !== 0) {
                                loadsort.deleteClassificationData(global.enSortName[j]);
                                break;
                            }
                        }
                
                        //加载数据
                        if(this.getElementsByTagName("li").length === 0) {
                            loadsort.loadClassificationData(arrSort[x].getAttribute("id"));
                        }
                        
                        if (global.isGetClass) {
                            var selected = document.getElementsByClassName("selected");
                        } else {
                            var selected = global.document.getElementsByClassName("selected");
                        }
                        

                        if (selected.length !== 0) {
                            var selectedSort = selected[0];

                            if (global.isGetClass) {
                                var selectedLi = document.getElementsByClassName("li-select");
                            } else {
                                var selectedLi = global.document.getElementsByClassName("li-select");
                            }
                            

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
                        displaytask.clearTaskList();
                        displaytask.loadAllSortTask();              
                    }
                })(i);
            }   
        },
        addEventListenerToButton: function() {
            var allTask = document.getElementById("all-task");
            var notFinish = document.getElementById("not-finish");
            var hasFinish = document.getElementById("has-finish");

            allTask.onclick = function() {
                if(global.isGetClass) {
                    var checked = document.getElementsByClassName("checked")[0];
                } else {
                    var checked = global.document.getElementsByClassName("checked")[0];
                }
                
                checked.setAttribute("class", "");
                this.setAttribute("class", "checked");
                displaytask.clearTaskList();
                displaytask.loadAllSortTask();
            }

            notFinish.onclick = function() {
                if(global.isGetClass) {
                    var checked = document.getElementsByClassName("checked")[0];
                } else {
                    var checked = global.document.getElementsByClassName("checked")[0];
                }

                checked.setAttribute("class", "");
                this.setAttribute("class", "checked");
                displaytask.clearTaskList();
                displaytask.loadHasOrNotFinishTask(1);        
            }

            hasFinish.onclick = function() {
                if(global.isGetClass) {
                    var checked = document.getElementsByClassName("checked")[0];
                } else {
                    var checked = global.document.getElementsByClassName("checked")[0];
                }

                checked.setAttribute("class", "");
                this.setAttribute("class", "checked");
                displaytask.clearTaskList();
                displaytask.loadHasOrNotFinishTask(0);        
            }
        },
        addEventToSureBtn: function(taskNew) {
            if (global.isGetClass) {
                var title = taskNew.getElementsByClassName("task-title")[0].value;
                var time = taskNew.getElementsByClassName("time")[0].value;
                var content = taskNew.getElementsByClassName("task-content")[0].value;        
            } else {
                var title = global.document.getElementsByClassName("task-title", taskNew)[0].value;
                var time = global.document.getElementsByClassName("time", taskNew)[0].value;
                var content = global.document.getElementsByClassName("task-content", taskNew)[0].value;        
            }

            var isRight = decideinput.isInputTaskRight(title, content);

            if (decideinput.isRepeat(title)) {
                alert("标题不能重复，请重新输入！");
            }

            if (decideinput.isRightDate(time) && isRight && !decideinput.isRepeat(title)) {                
                if(global.isGetClass) {
                    var belongMainSort = document.getElementsByClassName("selected")[0];
                    var belongSubSort = document.getElementsByClassName("li-select")[0];
                } else {
                    var belongMainSort = global.document.getElementsByClassName("selected")[0];
                    var belongSubSort = global.document.getElementsByClassName("li-select")[0];
                }
                
                var oldContent = global.oStorage.getItem(belongMainSort.getAttribute("id")+"content");
                var selectedId = belongMainSort.getAttribute("id");
        
                if (oldContent === null) {
                    oldContent = "";
                }

                var setContent = oldContent+"&"+belongSubSort.getAttribute("id")+"^"+title+"^"+time+"^"+content;

                global.oStorage.setItem(belongMainSort.getAttribute("id")+"content", setContent);

                displaytask.clearTaskList();
                displaytask.loadAllSortTask();
                taskcontent.displayTaskContent(belongMainSort, belongSubSort, global.arrDescript, title);
                loadsort.updateTaskNum(selectedId, belongSubSort.getAttribute("id"));
                loadsort.displayAllTaskNum();
            }
        }
    }
})