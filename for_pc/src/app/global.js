//高模块定义一些全局变量
define(function() {

    function getFuncParameters(func) {
        if (typeof func == 'function') {
            var mathes = /[^(]+\(([^)]*)?\)/gm.exec(Function.prototype.toString.call(func));
            if (mathes[1]) {
                var args = mathes[1].replace(/[^,\w]*/g, '').split(',');
                return args;
            } 
        }
    }

    return {
        oStorage: window.localStorage,
        arrDescript: ["task-finish", "task-display", "task-edit", "task-new"],
        chSortName: ["百度IFE项目", "毕业设计", "社团活动", "家庭生活", "其它分类"],
        enSortName: ["ife", "graduation", "association", "family", "other"],
        isGetClass: getFuncParameters(document.getElementsByClassName) === undefined ? true : false
    }
});