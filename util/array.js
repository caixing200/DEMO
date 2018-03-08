/**
 * @param ele 要判断的元素
 * @param array 数组
 */
var _contain = function (ele, array) {
  if (ele && array) {
    for (var i = 0; i < array.length; i++) {
      if (ele == array[i]) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}

var _remove = function(ele,array){
  
}

module.exports = {
  contain: _contain,
  remove:_remove
};