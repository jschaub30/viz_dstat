(function() {
	var WIN_WIDTH = $(window).width()
	DIV_WIDTH = WIN_WIDTH / 2 - 100;
})();

var time0 = -1,
    header_lines; // Used in error message in parse_line()

var parse_line = function() {
	var line = arguments[0],
	i = arguments[1],
	factor = arguments[2],
	day,
	month,
	time,
	arr;
	
	try {
		day = line.time.split('-')[0];
		month = line.time.split('-')[1].split(' ')[0];
		time = line.time.split(' ')[1];
		arr = [];
		time_ms = Date.parse("2015-" + month + '-' + day + ' ' + time);
		if (time0 == -1) {
			time0 = time_ms;
		}
		arr.push((time_ms - time0) / 1000);

		for (var i = 3; i < arguments.length; i++) {
			arr.push(factor * line[arguments[i]]);
		}
	}
	catch(err) {
		var err_str = "Problem reading CSV file near line " + (i + header_lines) + '<br>'
		err_str += JSON.stringify(line) + "<br>" + err.message;
	  $("#id_error").html(err_str);
	}
	return arr
}

function load_csv() {
	//Read csv data 
  // console.log('load_csv');
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
			header = lines.slice(0, i-2),
			body = lines.slice(i, lines.length);
			
      header = header.join([separator = '<br>']);
      $("#id_header").html(header);
			header_lines = i;  // Used in error message in parse_line()

			var csv_data = $.csv.toObjects(body.join([separator = '\n']));
			// console.log(csv_data);
			cpu_data = csv_data.map(
				function(x, i) {
					return parse_line(x, i, 1, "usr","sys","idl","wai");
				}
			);
			mem_data = csv_data.map(
				function(x, i) {
					return parse_line(x, i, 1e-9, "used", "buff", "cach", "free");
				}
			);
			io_data = csv_data.map(
				function(x, i) {
					return parse_line(x, i, 1e-6, "read", "writ");
				}
			);
			net_data = csv_data.map(
				function(x, i) {
					return parse_line(x, i, 1e-6, "recv", "send");
				}
			);
				
			csv_chart(cpu_data, "id_cpu", "CPU", ["time", "user", "system", "idle", "wait"], "Usage [ % ]")
			csv_chart(mem_data, "id_mem", "Memory", ["time", "used", "buff", "cache", "free"], "Usage [ GB ]")
			csv_chart(io_data, "id_io", "IO", ["time", "read", "write"], "Usage [ MB/s ]")
			csv_chart(net_data, "id_net", "Network", ["time", "recv", "send"], "Usage [ MB/s ]")
		},
		error: function(request, status, error) {
			console.log(error);
		}
	});
};

function csv_chart(data, id, title, labels, ylabel) {
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
			labelsDivWidth: 350,
      title: title
		}
	)
	return chart
}

load_csv();
if (refresh_page) {
	$("#id_refresh").text("Page will refresh every 5 seconds. ")
	var refresh=setInterval(function () {load_csv()}, 5000);  //Refresh page every 5 sec
}