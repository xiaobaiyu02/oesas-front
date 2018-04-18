var Highchart = require('../highchart');

function highchartDirective() {
	return {
		restrict: 'A',
		scope: {options: '='},
		link: function(scope, element, attrs){
			var options = scope.options, onLoad;
			if(typeof options.onLoad === "function") {
				onLoad = options.onLoad;
				delete options.onLoad;
			}
			new Highchart.Chart(element[0], options, onLoad);
		}
	};
}

highchartDirective.$inject = [];

module.exports = highchartDirective;