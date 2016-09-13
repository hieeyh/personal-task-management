//定义displaytask模块，更新页面显示的内容
define(['global', 'handlearray', 'taskcontent'], function(global,  handlearray, taskcontent) {

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
        clearTaskList: function() {
            if (global.isGetClass) {
                var liTime = document.getElementsByClassName("li-time")[0];
            } else {
                var liTime = global.document.getElementsByClassName("li-time")[0];
            }
            
            liTime.innerHTML = "";            
        },
        loadAllSortTask: function() {
            if (global.isGetClass) {
                var selected = document.getElementsByClassName("selected")[0];
                var selectedLi = document.getElementsByClassName("li-select");
                document.getElementsByClassName("checked")[0].setAttribute("class", "");
                document.getElementById("all-task").setAttribute("class", "checked");
            } else {
                var selected = global.document.getElementsByClassName("selected")[0];
                var selectedLi = global.document.getElementsByClassName("li-select");
                global.document.getElementsByClassName("checked")[0].setAttribute("class", "");
                document.getElementById("all-task").setAttribute("class", "checked");
            }
            
            var len = global.enSortName.length;

            if (global.isGetClass) {
                for (var i = 0; i < len; i++) {
                    document.getElementById(global.enSortName[i]).getElementsByClassName("li-img")[0].setAttribute("src", "images/folder.png");
                }
    
                //设置按钮样式
                document.getElementById(selected.getAttribute("id")).getElementsByClassName("li-img")[0].setAttribute("src", "images/folder_white.png");       
            } else {
                for (var i = 0; i < len; i++) {
                    global.document.getElementsByClassName("li-img", document.getElementById(global.enSortName[i]))[0].setAttribute("src", "images/folder.png");
                }
    
                //设置按钮样式
                global.document.getElementsByClassName("li-img", document.getElementById(selected.getAttribute("id")))[0].setAttribute("src", "images/folder_white.png");        
            }

            if (selectedLi.length !== 0) {
                var liSelect = selectedLi[0];
                var selectedTask = liSelect.getAttribute("id");
                var taskData = global.oStorage.getItem(selected.getAttribute("id") + "content");
        
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

                        arrTime = handlearray.uniqArray(arrTime);

                        //给数组排序
                        arrTime = handlearray.squenceTime(arrTime);

                        for (var i = 0; i < arrTime.length; i++) {
                            resultArr[i] = arrTime[i];

                            for (var j = 0; j < arrTitle.length; j++) {
                                if (arrTime[i] === oldArrTime[j]) {
                                    resultArr[i] =  resultArr[i] + "^" + arrTask[j] + "^" + arrTitle[j];
                                }
                            }
                        }
                        
                        if (global.isGetClass) {
                            var ulTime = document.getElementsByClassName("li-time")[0];
                        } else {
                            var ulTime = global.document.getElementsByClassName("li-time")[0];
                        }
                        
                        var mytitle = "";

                        for (var i = 0; i < resultArr.length; i++) {                  
                            if　(resultArr[i].split("^")[1] === selectedTask) {

                                mytitle = resultArr[i].split("^")[2];
                                break;
                            }
                        }

                        if (mytitle !== "") {
                            taskcontent.displayTaskContent(selected, liSelect, global.arrDescript, mytitle);
                        } else {
                            taskcontent.changeTaskContent(0, "", "", "");      
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

                                    if (global.oStorage.getItem(arrTask[j + 1]) === "finish") {
                                        liCont.style.color = "#A2CD5A";
                                    }

                                    liCont.innerHTML = arrTask[j + 1];
                                    ulCont.appendChild(liCont);

                                    (function() {
                                        liCont.onclick = function() {                                   
                                            taskcontent.displayTaskContent(selected, liSelect, global.arrDescript, this.innerHTML);
                                        }
                                    })();                    
                                    liTime.appendChild(ulCont);     
                                    ulTime.appendChild(liTime);                 
                                }                       
                            }                    
                        }
                        if (global.isGetClass) {
                            document.getElementsByClassName("list")[0].appendChild(ulTime);
                        } else {
                            global.document.getElementsByClassName("list")[0].appendChild(ulTime);
                        }
                        
                    }
                } else {
                    taskcontent.changeTaskContent(0, "", "", "");  
                }
            } else {
                taskcontent.changeTaskContent(0, "", "", "");  
            }
        },
        loadHasOrNotFinishTask: function(isFinish) {
            if(global.isGetClass) {
                var selected = document.getElementsByClassName("selected")[0];
                var lilen = document.getElementsByClassName("li-select").length;
            } else {
                var selected = global.document.getElementsByClassName("selected")[0];
                var lilen = global.document.getElementsByClassName("li-select").length;
            }

            if (lilen !== 0) {
                if(global.isGetClass) {
                    var liSelect = document.getElementsByClassName("li-select")[0];
                } else {
                    var liSelect = global.document.getElementsByClassName("li-select")[0];
                }             
                var selectedTask = liSelect.getAttribute("id");
                var taskData = global.oStorage.getItem(selected.getAttribute("id") + "content");

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

                        arrTime = handlearray.uniqArray(arrTime);

                        arrTime = handlearray.squenceTime(arrTime);

                        for (var i = 0; i < arrTime.length; i++) {
                            resultArr[i] = arrTime[i];
                            for (var j = 0; j < arrTitle.length; j++) {
                                if (arrTime[i] === oldArrTime[j]) {
                                    resultArr[i] =  resultArr[i] + "^" + arrTask[j] + "^" + arrTitle[j];
                                }
                            }
                        }

                        if (global.isGetClass) {
                            var ulTime = document.getElementsByClassName("li-time")[0];
                        } else {
                            var ulTime = global.document.getElementsByClassName("li-time")[0];
                        }
                        
                        var mytitle = "";

                        for (var i = 0; i < resultArr.length; i++) {                
                            if　(resultArr[i].split("^")[1] === selectedTask) {
                                mytitle = resultArr[i].split("^")[2];
                                break;
                            }
                        }

                        if (mytitle !== "") {
                            taskcontent.displayTaskContent(selected, liSelect, global.arrDescript, mytitle);
                        } else {
                            taskcontent.changeTaskContent(1, "", "", "");    
                        }

                        var isDisplay = false;

                        for (var i = 0; i < arrTime.length; i++) {
                            var liTime = document.createElement("li"); 
                            var allTask = resultArr[i];
                            var arrTask = allTask.split("^");
                
                            if (isFinish === 0) {                        
                                for (var j = 1; j < arrTask.length; j+=2) {
                                    if (arrTask[j] === selectedTask && (global.oStorage.getItem(arrTask[j+1])==="finish")) {
                                        liTime.innerHTML = arrTime[i];
                                        var ulCont = document.createElement("ul");
                                        var liCont = document.createElement("li");

                                        ulCont.setAttribute("class", "li-cont");

                                        liCont.innerHTML = arrTask[j + 1];
                                        ulCont.appendChild(liCont);

                                        (function() {
                                            liCont.onclick = function() {

                                                taskcontent.displayTaskContent(selected, liSelect, global.arrDescript, this.innerHTML);
                                            }
                                        })();
                                        liTime.appendChild(ulCont);
                                        ulTime.appendChild(liTime);
                                        if (!isDisplay) {
                                            taskcontent.displayTaskContent(selected, liSelect, global.arrDescript, arrTask[j+1]);  
                                            isDisplay = true;                                  
                                        }                         
                                    }                              
                                }
                                if (!isDisplay) {
                                    taskcontent.changeTaskContent(0, "", "", "");
                                }
                            }
                    
                            if (isFinish === 1) {                        
                                for (var j = 1; j < arrTask.length; j+=2) {
                                    if (arrTask[j] === selectedTask && (global.oStorage.getItem(arrTask[j+1])===null || global.oStorage.getItem(arrTask[j+1])==="")) {
                                        liTime.innerHTML = arrTime[i];
                                        var ulCont = document.createElement("ul");
                                        var liCont = document.createElement("li");

                                        ulCont.setAttribute("class", "li-cont");
                                        liCont.innerHTML = arrTask[j + 1];
                                        ulCont.appendChild(liCont);

                                        (function() {
                                            liCont.onclick = function() {

                                                taskcontent.displayTaskContent(selected, liSelect, global.arrDescript, this.innerHTML);
                                            }
                                        })();
                                        liTime.appendChild(ulCont);
                                        ulTime.appendChild(liTime);
                                        if (!isDisplay) {
                                            taskcontent.displayTaskContent(selected, liSelect, global.arrDescript, arrTask[j+1]);  
                                            isDisplay = true;                                  
                                        }                         
                                    }                              
                                }
                                if (!isDisplay) {
                                    taskcontent.changeTaskContent(0, "", "", "");
                                }
                            }
                        }   
                        if(global.isGetClass) {
                            document.getElementsByClassName("list")[0].appendChild(ulTime);
                        } else {
                            global.document.getElementsByClassName("list")[0].appendChild(ulTime);
                        }                                      
                    }
                }
            }            
        }
    }
});

