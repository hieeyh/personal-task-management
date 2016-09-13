//配置各模块路径
require.config({
    paths: {
        "global": "app/global",
        "initial": "app/initial",
        "displaytask": "app/displaytask",
        "addnew": "app/addnew",
        "addevent": "app/addevent",
        "decideinput": "app/decideinput",
        "handlearray": "app/handlearray",
        "loadsort": "app/loadsort",
        "taskcontent": "app/taskcontent",
        "addeventsort": "app/addeventsort"
    }
});

//初始化
require(['global', 'initial', 'addnew', 'loadsort', 'addevent', 'displaytask'], 
    function(global, initial, addnew, loadsort, addevent, displaytask){
    
    //防御触屏攻击
    if (top.location != location) {
        top.location = self.location;
    }

    if (loadsort.loadClassificationData("ife")) {
        if (loadsort.loadClassificationData("graduation")) {
            if (loadsort.loadClassificationData("association")) {
                if (loadsort.loadClassificationData("family")) {
                    loadsort.loadClassificationData("other");
                }
            }
        }
    }
    //显示主分类的任务数量
    loadsort.displayAllTaskNum();
    //选中一个默认分类
    loadsort.selectDefaultClass();
    //加载中间列的相关数据
    displaytask.loadAllSortTask();
    //给中间列的标签添加事件
    addevent.addEventListenerToSort();
    //给中间列的按钮添加事件
    addevent.addEventListenerToButton();
});