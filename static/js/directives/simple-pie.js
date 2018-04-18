var Highchart = require('../highchart');

function simplePieDirective() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var chart;
			var options = {
		        chart: {
		            type: 'pie',
		            options3d: {
		                enabled: true,
		                alpha: 45,
		                beta: 0
		            }
		        },
		        title: {
		        	text: '',
		        	margin: 0
		        },
		        credits: {
		        	enabled: false
		        },
		        tooltip: {
		            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: false,
		                cursor: 'pointer',
		                depth: 35,
		                dataLabels: {
		                    enabled: false,
		                    format: '{point.name}'
		                }
		            }
		        },
		        series: [{
		            type: 'pie',
		            name: attrs.title
		        }]
		    }
			
			attrs.$observe('items', function(v){
				var data = getData(attrs), s;
				if(!data) { return; }
				if(chart) {
					s = chart.series[0];
					s.setData(data, true, true, false);
				} else {
					options.series[0].data = data;
					chart = new Highchart.Chart(element[0], options);
				}
			});
			element.on('$destroy', function(){
				chart && chart.destroy();
				chart = null;
			});
		}
	};
}

simplePieDirective.$inject = [];

module.exports = simplePieDirective;

var attrre = /^item\d$/;

function getData($attrs) {
	var data = [], items = $attrs.items.split(',');
	angular.forEach(items, function(item){
		var parts = item.split(':');
		if(parts[1]) {
			parts[1] = parts[1] * 1;
			data.push(parts);
		}
	});
	return data.length < items.length ? null : data;
}