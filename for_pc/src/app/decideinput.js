//包含判断输入格式是否正确的函数的模块
define(['global'], function(global) {

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
        isInputTaskRight: function(title, content) {
            var titleContain = (title.indexOf("^") !== -1) || (title.indexOf("$") !== -1) || (title.indexOf("$") !== -1);
            var contentContain = (content.indexOf("^") !== -1) || (content.indexOf("$") !== -1) || (content.indexOf("$") !== -1);
            var titleLegal = title.indexOf("<script") !== -1 || title.indexOf("<iframe") !== -1 || title.indexOf("<img") !== -1 || title.indexOf("<video") !== -1 || title.indexOf("<audio") !== -1 || title.indexOf("<base") !== -1 || title.indexOf("<form") !== -1;
            var contentLegal = content.indexOf("<script") !== -1 || content.indexOf("<iframe") !== -1 || content.indexOf("<img") !== -1 || content.indexOf("<video") !== -1 || content.indexOf("<audio") !== -1 || content.indexOf("<base") !== -1 || content.indexOf("<form") !== -1;
    
            if (title.length > 15) {
                alert("标题字数不能超过15个字！");
            }

            if (titleContain || contentContain) {
                alert("标题或者内容中不能包括$、&、^字符！");
            } 

            if (titleLegal || contentLegal) {
                alert("请输入合法的标题或内容！");
            } 

            if (content.length > 500) {
                alert("内容字数不能超过500个字！");
            }

            if ((title.length <=15) && (content.length <= 500) && !(titleContain || contentContain) && !titleLegal && !contentLegal) {
                return true;
            } else {
                return false;
            } 
        },
        isRightDate: function(time) {
            var reg = /^(\d{4})-(\d{2})-(\d{2})$/;  
            var arr = reg.exec(time);

            if (!reg.test(time) || RegExp.$2 > 12 || RegExp.$3 > 31){  
                alert("请保证输入的日期格式为yyyy-mm-dd且日期正确!");  
                return false;
            } else {
                return true;
            }
        },
        isRepeat: function(title) {
            var ifeContent = global.oStorage.getItem("ifecontent");
            var graduationContent = global.oStorage.getItem("graduationcontent");
            var associationContent = global.oStorage.getItem("associationcontent");
            var familyContent = global.oStorage.getItem("familycontent");
            var otherContent = global.oStorage.getItem("othercontent");

            if (ifeContent !== null) {
                var isrepeat1 = (ifeContent.indexOf(title) !==-1);
            } 
            if (graduationContent !== null) {
                var isrepeat2 = (graduationContent.indexOf(title) !==-1);
            } 
            if (associationContent !== null) {
                var isrepeat3 = (associationContent.indexOf(title) !==-1);
            } 
            if (familyContent !== null) {
                var isrepeat4 = (familyContent.indexOf(title) !==-1);
            } 
            if (otherContent !== null) {
                var isrepeat5 = (otherContent.indexOf(title) !==-1);
            }   

            if (isrepeat1 || isrepeat2 || isrepeat3 || isrepeat4 || isrepeat5) {
                return true;
            } else {
                return false;
            }
        }
    }
});