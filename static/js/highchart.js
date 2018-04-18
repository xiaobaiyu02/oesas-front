var Highchart = require('../libs/highcharts.src');
Highchart.setOptions({
	global: {
		useUTC: false
	}
});
require('../libs/highcharts-3d.src')(Highchart);

module.exports = Highchart;