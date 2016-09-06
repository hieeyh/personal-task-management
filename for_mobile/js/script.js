window.onload = function() {

    //获取所有分类标签
    var sortLi = document.getElementsByClassName("sort-li");
    //获取所有任务标签
    var taskLi = document.getElementsByClassName("task-li");
    //获取所有左边竖条
    var clickBar = document.getElementsByClassName("click-bar");

    //给分类标签添加事件
    addEventListenerToLi(sortLi);
    //给任务标签添加事件
    addEventListenerToLi(taskLi);
    //给左边竖条添加事件
    addEventListenerToClickBar(clickBar);
}

var screenWidth = screen.width;

function addEventListenerToLi(sortLi) {
    
    for (var i = 0; i < sortLi.length; i++) {
        
        (function(j) {

            sortLi[j].addEventListener('touchend', function() {

                var thisId = this.getAttribute("id");
                var taskElement = document.getElementById("for-" + thisId);

                var k = 9;
                var interval = setInterval(function() {
                   
                    if (k !== -1) {
                        var myleft = screenWidth * k * 0.1;
                        taskElement.style.left = myleft + 'px';
                        k--;
                    } else {
                        clearInterval(interval);
                    }                
                }, 25);              
            }, false)
        })(i);
    }
}

function addEventListenerToClickBar(clickBar) {

    for (var i = 0; i < clickBar.length; i++) {

        (function(j) {

            clickBar[j].addEventListener('touchend', function() {

                var barParent =  clickBar[j].parentNode;
                var k = 1;
                var interval = setInterval(function() {
                   
                    if (k !== 11) {
                        var myleft = screenWidth * k * 0.1;
                        barParent.style.left = myleft + 'px';
                        k++;
                    } else {
                        clearInterval(interval);
                    }                
                }, 25);                     
            }, false);
        })(i);
    }
}
