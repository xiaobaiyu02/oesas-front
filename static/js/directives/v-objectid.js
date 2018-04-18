/*
 * 用于 select 验证，选中的值必须要有 id 属性
 */
function VObjectidDirective() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      ctrl.$validators.objectid = function(modelValue, viewValue) {
        return modelValue && modelValue.id;
      };
    }
  };
}

VObjectidDirective.$inject = [];
module.exports = VObjectidDirective;
