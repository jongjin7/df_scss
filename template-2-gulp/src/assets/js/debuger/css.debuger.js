'use strict';

/*=========================================================== [ CSS debugging ] =======================================================================*/
// 1. Grid/Box
var CssDebugging = function () {
    var _init = function _init() {
        console.log('cssDebugMode Start!!');
        _createGrid();
        _addEvent();
    };

    var _createGrid = function _createGrid(gridNum) {
        var gridColumns = gridNum === undefined ? 12 : gridNum; //Grid Length
        var gridCell = '';

        for (var i = 0; i < gridColumns; i++) {
            gridCell += '<span class="col"></span>';
        }

        var grid = '\n            <div class="grid-wrap">\n               <div class="container">\n               <div class="row grid">' + gridCell + '  </div>\n               </div>\n            </div>\n            ';

        //append to Body
        _appendDebugHtml(grid);
    };

    var _logBox = function _logBox() {
        var logStr = '<div class="debug-log-box">\n                        <p class="title">로그 내용</p>\n                        <div class="desc">' + 'CSS 컴포넌트 디버깅중...' + '</div>\n                     </div>';
        return logStr;
    };

    var _appendDebugHtml = function _appendDebugHtml(grid) {
        var debugHtml = '\n                <div class="debug-html-wrap">' + _logBox() + '<div class="btns-group">\n                        <button class="btn-grid">그리드 토글</button>\n                        <button class="btn-debug-box">박스영역 토글</button>\n                    </div>' + grid + '</div>';

        $('body').append(debugHtml);
    };

    var _addEvent = function _addEvent() {
        setTimeout(function () {
            var btnDebug = $('.btn-debug-box');
            var grid = $('.grid-wrap');
            var btnGrid = $('.btn-grid');

            btnDebug.on('click', function (e) {
                $('body').toggleClass('box-debug');
            });

            btnGrid.on('click', function (e) {
                grid.toggleClass('d-block');
            });
        }, 300);
    };

    return {
        init: _init,
        change_grid: _createGrid
    };
}();

$(function () {
    if (window.GlobalVars.isDevModeCss && (/^(127|192|localhost)/g.test(location.hostname) || location.protocol === 'file:')) CssDebugging.init();
});