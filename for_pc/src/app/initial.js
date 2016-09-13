//定义模块,用于初始化大分类下的数据
define(['global'], function(global) {

    //显示总分类
    var sortList = document.getElementById("sortlist");
    var length = global.enSortName.length;

    for (var i = 0; i < length; i++) {
        sortList.innerHTML += '<li id="' + global.enSortName[i] + '"><img class="li-img" src="images/folder.png">' +
                            global.chSortName[i] + '<span class="all-num">(0)</span>' + '<ul></ul>';
    }
});