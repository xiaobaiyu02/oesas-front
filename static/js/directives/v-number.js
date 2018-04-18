var numberRe = /^[0-9]+$/;

/*
 * 数字指令
 */
function VNumberDirective() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      ctrl.$validators.number = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || numberRe.test(viewValue);
      };
    }
  };
}

VNumberDirective.$inject = [];
module.exports = VNumberDirective;