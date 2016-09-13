//定义处理数组的模块
define([], function() {
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
        uniqArray: function(arr) {
            var newArr = [];

            for(var i = 0; i < arr.length; i++) {
                if(newArr.indexOf(arr[i])== -1) {
            newArr.push(arr[i]);
                }
            }
            return newArr;
        },
        squenceTime: function(arrTime) {
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
    }
});