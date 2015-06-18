(function() {
	var WIN_WIDTH = $(window).width()
	DIV_WIDTH = WIN_WIDTH / 2 - 100;
})();

var time0 = -1;

var parse_line = function() {
	var line = arguments[0],
	factor = arguments[1],
	day = line.time.split('-')[0],
	month = line.time.split('-')[1].split(' ')[0],
	time = line.time.split(' ')[1],
	arr = [];
	time_str = "2015-" + month + '-' + day + ' ' + time;
	// console.log(time_str);
	time_ms = Date.parse(time_str);
	if (time0 == -1) {
		time0 = time_ms;
	}
	arr.push((time_ms - time0) / 1000);

	for (var i = 2; i < arguments.length; i++) {
		arr.push(factor * line[arguments[i]]);
	}
	return arr
}

function load_summary() {
	//Read summary data and create charts
	$.ajax({
		type: "GET",
		url: csv_fn,
		dataType: "text",
		success: function(data) {
			var i = 0,
			flag = true,
			lines = data.split('\n');

			while (flag) {
				if (lines[i].indexOf("system") != -1) {
					flag = false;
				}
				i += 1;
			}
			var labels = lines[i],
			header = lines.slice(0, i),
			body = lines.slice(i, lines.length);


			// console.log("Header:\n" + header);	
			// console.log("Body:\n" + body);
			var csv_data = $.csv.toObjects(body.join([separator = '\n']));
			// console.log(csv_data);
			net_data = csv_data.map(
				function(x) {
					return parse_line(x, 1e-6, "recv", "send");
				}
			);
			io_data = csv_data.map(
				function(x) {
					return parse_line(x, 1e-6, "read", "writ");
				}
			);
			cpu_data = csv_data.map(
				function(x) {
					return parse_line(x, 1, "usr","sys","idl","wai");
				}
			);
			mem_data = csv_data.map(
				function(x) {
					return parse_line(x, 1e-9, "used", "buff", "cach", "free");
				}
			);
				
			csv_chart(net_data, "id_net", ["time", "recv", "send"], "Usage [ MB/s ]")
			csv_chart(io_data, "id_io", ["time", "read", "write"], "Usage [ MB/s ]")
			csv_chart(cpu_data, "id_cpu", ["time", "user", "system", "idle", "wait"], "Usage [ % ]")
			csv_chart(mem_data, "id_mem", ["time", "used", "buff", "cache", "free"], "Usage [ GB ]")
		},
		error: function(request, status, error) {
			console.log(error);
		}
	});
};

function csv_chart(data, id, labels, ylabel) {
	// console.log(DIV_WIDTH);
	chart = new Dygraph(
		document.getElementById(id),
		data, 
		{
			labels: labels,
			//http://colorbrewer2.org/
			colors: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)'],
			width: DIV_WIDTH,
			height: 400,
			xlabel: "Elapsed time [ sec ]",
			ylabel: ylabel,
			strokeWidth: 2,
			legend: 'always',
			labelsDivWidth: 300
		}
	)
	return chart
}

load_summary();
