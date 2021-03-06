import 'vue';
import elInfiniteScroll from 'element-ui/lib/infinite-scroll';

var elInserted = elInfiniteScroll.inserted;
var elUnbind = elInfiniteScroll.unbind;
var elScope = 'ElInfiniteScroll';
var elTableInfiniteScroll = {
  inserted: function inserted(el, binding) {
    for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }
    var scrollElem = el.querySelector('.el-table__body-wrapper');

    if (!scrollElem) {
      throw 'table-infinite-scroll: 找不到 .el-table__body-wrapper 容器';
    }

    scrollElem.style.overflowY = 'auto';
    setTimeout(function () {
      elInserted.apply(void 0, [scrollElem, binding].concat(params));
      el[elScope] = scrollElem[elScope];
    });
  },
  unbind: elUnbind
};

elTableInfiniteScroll.install = function (Vue) {
  Vue.directive('el-table-infinite-scroll', elTableInfiniteScroll);
};

export default elTableInfiniteScroll;