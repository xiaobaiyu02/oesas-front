require('../../libs/bootstrap-datepicker');
!function(a){a.fn.datepicker.dates["zh-CN"]={days:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],daysShort:["周日","周一","周二","周三","周四","周五","周六"],daysMin:["日","一","二","三","四","五","六"],months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],monthsShort:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],today:"今日",clear:"清除",format:"yyyy年mm月dd日",titleFormat:"yyyy年mm月",weekStart:1}}(jQuery);
/**
 * 选择日期组件
 * 
 */
function datePickerDirective() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
            var picker = $(element[0]).datepicker({showOnFocus: false});
            // 根据 ngModel 自动设置相邻 picker 日期上/下限
            var limitMethod = ({
                timeend: 'setStartDate',
                timebegin: 'setEndDate'
            })[attrs.ngModel];
			scope[attrs.ngModel + 'Picker'] = picker;
            var addon = element.next('.input-group-addon');
            if(addon.length > 0) {
                addon.on('click', function(e){
                    picker.datepicker('show');
                });
            }
            // 根据 ngModel 设置当前控件日期上下限
            // 默认日期为当天，这里和 controller 分开设置
            if(attrs.ngModel === "timeend") {
                picker.data('datepicker').setStartDate(new Date);
            } else {
                picker.data('datepicker').setEndDate(new Date);
            }
            // 绑定日期变化事件
            picker.on('changeDate', function(e){
                var name = attrs.ngModel === 'timebegin' ? 'timeend' : 'timebegin';
                var method = attrs.ngModel === 'timebegin' ? 'setStartDate' : 'setEndDate'; 
                var partner = picker.closest('.view-toolbar').find('input[ng-model=' + name + ']');
                partner.data('datepicker')[method](e.date);
            });
		}
	};
}

datePickerDirective.$inject = [];

module.exports = datePickerDirective;
