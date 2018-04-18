var Highchart = require('../highchart');


function HostMonitorController($scope, $http) {
	var timer, refreshInterval = 10000, resetCache = false;
	var chartData = initChartData(refreshInterval);
	// 保存 chart 的引用
	var chartsCache = {};
	var netDataCache = {};
	var diskDataCache = {};
    var controller_ip;

	// $scope.current_netcard
	$scope.onNetcardChange = function(k){
		var netcardData = netDataCache[k];
		var chart = chartsCache.net;
		// 算法说明：
		// 记每个 series 的数据总长度为 L (即 <series>.data.length)
		// 假设第 k 块网卡已经缓存了 N 条数据，那么循环第 k 块网卡的缓存数据时
		// 每次循环对应的 series.data 索引为：L - N + i (i 为循环自增变量)
		// 
		//                            L - N + 0   <- 此处索引
		//                                          \
		// | | | | | | | | | | | | | | | | | | | | |x|x|x|x|x|x|x|x|x|    缓存的数据，总长为 N
		// |x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|x|    series 数据，总长为 L
		var start = chart.series[0].data.length - netcardData.length;
		angular.forEach(netcardData, function(data, i){
			chart.series[0].data[start + i].y = data.write;
			chart.series[1].data[start + i].y = data.read;
		});
		chart.redraw();
	};
	// 没有合并上下两个方法的原因是它们的上行、下行对应的 series 索引刚好相反
	// $scope.current_disk
	$scope.onDiskChange = function(k){
		var diskData = diskDataCache[k];
		var chart = chartsCache.disk;
		// 参照上方说明
		var start = chart.series[0].data.length - diskData.length;
		angular.forEach(diskData, function(data, i){
			chart.series[0].data[start + i].y = data.read;
			chart.series[1].data[start + i].y = data.write;
		});
		chart.redraw();
	};

	$scope.cpu_chart_options = {
		chart: {
			type: 'area',   
			height: 250,
			animation: Highchart.svg
		},
		title: {
			text: '',
			margin: 0
		},
        credits: {
        	enabled: false
        },
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			lineWidth: 1,
			tickWidth: 1,
			title: {
				text: '%',
				align: 'high',
				ffset: 0,
				rotation: 0,
				y: -20,
				x: 26
			},
			plotLines: [
				{
					value: 0,
					width: 1,
					color: '#808080'
				}
			]
		},
		tooltip: {
			pointFormat: '<span">{series.name}</span>: <b>{point.y:.1f}%</b><br/>',
			//pointFormat: '<span">{series.name}</span>: <b>{point.y:.1f} GB</b><br/>',
			crosshairs: true,
			shared: true,
			xDateFormat: '%Y-%m-%d %H:%M:%S'
		},
		// plotOptions: {
		//     area: {
		//         stacking: 'percent',
		//         // lineColor: '#ffffff',
		//         lineWidth: 1,
		//         marker: {   
		//             lineWidth: 1,
		//             lineColor: '#ffffff'
		//         }
		//     }
		// },
		legend: {
			align: 'right',
			verticalAlign: 'top',
			y: -15
		},
		series: [
			// {
			//     name: '空闲', color: "transparent",
			//     marker: {
			//         enabled: false
			//     }
			// },
			// {name: '正在使用', marker: {
			//     enabled: false
			// }},
			// {name: '系统', color: '#f86161', marker: {
			//     enabled: false
			// }},
			// {name: '等待使用', color: '#88de67', marker: {
			//     enabled: false
			// }}
			{
				name: "占用率",
				marker: {
					enabled: false
				},
				data: angular.copy(chartData)
			}
		],
		onLoad: function(chart) {
			chartsCache.cpu = chart;
		}
	};

	$scope.mem_chart_options = {
		chart: {
			type: 'area',
			height: 250,
			animation: Highchart.svg
		},
		title: {
			text: '',
			margin: 0
		},
        credits: {
        	enabled: false
        },
		xAxis: {
			type: 'datetime',
		},
		yAxis: {
			lineWidth: 1,
			tickWidth: 1,
			title: {
				text: 'GB',
				align: 'high',
				ffset: 0,
				rotation: 0,
				y: -20,
				x: 26
			},
			plotLines: [
				{
					value: 0,
					width: 1,
					color: '#808080'
				}
			]
		},
		tooltip: {
			pointFormat: '<span">{series.name}</span>: <b>{point.y:.1f} GB</b><br/>',
			crosshairs: true,
			shared: true,
			xDateFormat: '%Y-%m-%d %H:%M:%S'
		},
		legend: {
			align: 'right',
			verticalAlign: 'top',
			y: -15
		},
		series: [
			{
				name: "己用内存",
				color: '#88de67',
				marker: {
					enabled: false
				},
				data: angular.copy(chartData)
			}
		],
		onLoad: function(chart) {
			chartsCache.mem = chart;
		}
	};

	$scope.net_chart_options = {
		chart: {
			type: 'spline',
			height: 250,
			animation: Highchart.svg
		},
		title: {
			text: '',
			margin: 0
		},
        credits: {
        	enabled: false
        },
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			lineWidth: 1,
			tickWidth: 1,
			labels:{
				format:"{value}"
			},
			title: {
				text: 'KB/s',
				align: 'high',
				offset: 0,
				rotation: 0,
				y: -20,
				x: 40
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			pointFormat: '<span">{series.name}</span>: <b>{point.y:.1f}KB/s</b><br/>',
			crosshairs: true,
			shared: true,
			xDateFormat: '%Y-%m-%d %H:%M:%S'
		},
		legend: {
			align: 'right',
			verticalAlign: 'top',
			y: -15
		},
		series: [{
			name:  "上行",
			data: angular.copy(chartData),
			marker: {
				enabled: false
			}
		},{
			name:  "下行",
			color: '#88de67',
			data: angular.copy(chartData),
			marker: {
				enabled: false
			}
		}],
		onLoad: function(chart) {
			chartsCache.net = chart;
		}
	};

	$scope.disk_chart_options = {
		chart: {
			type: 'spline',
			height: 250,
			animation: Highchart.svg
		},
		title: {
			text: '',
			margin: 0
		},
        credits: {
        	enabled: false
        },
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			lineWidth: 1,
			tickWidth: 1,
			labels:{
				format:"{value}"
			},
			title: {
				text: 'KB/s',
				align: 'high',
				offset: 0,
				rotation: 0,
				y: -20,
				x: 40
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			pointFormat: '<span">{series.name}</span>: <b>{point.y:.1f}KB/s</b><br/>',
			crosshairs: true,
			shared: true,
			xDateFormat: '%Y-%m-%d %H:%M:%S'
		},
		legend: {
			align: 'right',
			verticalAlign: 'top',
			y: -15
		},
		series: [{
			name:  "读取",
			data: angular.copy(chartData),
			marker: {
				enabled: false
			}
		},{
			name:  "写入",
			color: '#88de67',
			data: angular.copy(chartData),
			marker: {
				enabled: false
			}
		}],
		onLoad: function(chart) {
			chartsCache.disk = chart;
		}
	};

	$scope.$on('node:change', function(e, node){
		// 每当 node:change 发生变化后，清掉上次的计时器
		// 确保之前的 current_host 不会再请求
		clearInterval(timer);
		$scope.group_breadcrumb = node.node_name;
		loadHosts(node.controller_ip);
        controller_ip = node.controller_ip;
	});

	$scope.$on('$destroy', function(){
		var k;
		clearInterval(timer);
		for(k in chartsCache) {
			try {
				chartsCache[k].destroy()
			} catch(e) {}
		}
		chartsCache = null;
	});

	$scope.$watch('current_host', function(host){
		if(!host) { return; }
		// current_host 变化之后，清除之前 current_host 的缓存数据
		resetCache = true;
		loadData({host: controller_ip, id: host.id});
		if(chartsCache) {
			// 重新启动定时器
			clearInterval(timer);
			timer = setInterval(loadData, refreshInterval);
		}
	});

	$scope.reloadByIP = function(ip){
		loadData({ip: ip});
	};

	function loadData(options) {
		options = options ? options : (loadData.lastOptions || {});
		$http.get('/dashboard/monitor', {params: options}).then(function(resp){
			var data = resp.data.data;
			$scope.disks = Object.keys(data.disk);
			$scope.netcards = Object.keys(data.net);
			$scope.process_list = data.processs_list;
			redrawCharts(format(data));
		});
		loadData.lastOptions = options;
	}

	function loadHosts(ip){
		$http.get('/dashboard/hostinfo', {params: {host: ip}}).then(function(resp){
			$scope.hosts = resp.data.hosts_list;
			if($scope.hosts) {
				$scope.current_host = $scope.hosts[0];
			}
		});
	}

	function redrawCharts(data) {
		var now = Date.now();
		if(resetCache) {
			angular.forEach(chartsCache, function(chart, k){
				angular.forEach(chart.series, function(s, i){
					angular.forEach(s.data, function(p){
						p.y = 0;
					});
				});
			});
			resetCache = false;
		}
		chartsCache.cpu.series[0].addPoint([now, data.cpu], true, true, true);
		chartsCache.mem.series[0].addPoint([now, data.mem], true, true, true);
		chartsCache.net.series[0].addPoint([now, data.net.write], false, true, true);
		chartsCache.net.series[1].addPoint([now, data.net.read], false, true, true);
		chartsCache.net.redraw();
		chartsCache.disk.series[0].addPoint([now, data.disk.read], false, true, true);
		chartsCache.disk.series[1].addPoint([now, data.disk.write], false, true, true);
		chartsCache.disk.redraw();
	}

	function format(data) {
		var newdata = {};
		// format cpu data, copied from vdi
		if(data.cpu.iowait) {
			newdata.cpu = (data.cpu.system + data.cpu.user + data.cpu.iowait);
		}
		else {
			newdata.cpu = (data.cpu.system + data.cpu.user);
		}

		// format memory data, copied from vdi
		newdata.mem = (data.mem.total - data.mem.free) / 1024 / 1024 / 1024;
		// current_host 改变后重置缓存数据
		if(resetCache) {
			netDataCache = {};
			diskDataCache = {};
		}
		newdata.net = pushData(netDataCache, data.net, 'current_netcard');
		newdata.disk = pushData(diskDataCache, data.disk, 'current_disk');
        return newdata;
	}

	function pushData(cache, data, prop) {
		var keys = Object.keys(data), ret;
		if(!$scope[prop]) {
			prop = $scope[prop] = keys[0];
		} else {
			prop = $scope[prop];
		}
		angular.forEach(keys, function(k){
			var v = data[k], item;
			if(!cache.hasOwnProperty(k)) {
				cache[k] = [];
			}
			if(v.hasOwnProperty('recv_rate')) {
				item = {read: v.recv_rate / 1024, write: v.sent_rate / 1024};
			} else {
				item = {read: v.read_rate / 1024, write: v.write_rate / 1024};
			}
			
			cache[k].push(item);
			// 初始化的时候，x 轴数据有 41 个
			if(cache[k].length > 41) {
				cache[k].shift();
			}
			if(k === prop) {
				ret = item;
			}
		});
		return ret;
	}
}

HostMonitorController.$inject = ['$scope', '$http'];

module.exports = HostMonitorController;

function initChartData(interval) {
	var data = [], time = Date.now(), i;

	for (i = -40; i <= 0; i += 1) {
		data.push({
			x: time + i * interval,
			y: 0
		});
	}
	return data;
}
