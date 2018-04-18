/*
 * 密码和确认密码
 */
function VPasswordMatchDirective() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      var pwd = attr.vPwdmatch;
      if (!ctrl) return;
      ctrl.$validators.pwdmatch = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || viewValue === scope[pwd];
      };
    }
  };
}

VPasswordMatchDirective.$inject = [];
module.exports = VPasswordMatchDirective;