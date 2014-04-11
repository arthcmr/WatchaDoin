//popup script

$(function() {

	var buttons_area = $("#buttons");
	var text_field = $("#activity");
	var state;

	start();

	//removeError class
	text_field.bind('keyup', function(e) {
		var text = text_field.val();
		if(text != '') {
			text_field.parent().removeClass("has-error");
		}

		var code = e.keyCode || e.which;
		if(code == 13) { //Enter keycode
		   switchState();
		}
	});

	function start() {
		//text should be empty
		state = "start";
		text_field.val('');
		text_field.focus();
		//button should be start button
		buttons_area.html('<button type="button" id="start" class="btn btn-primary"><span class="glyphicon glyphicon-play"></span> Start activity</button>');

		//change it when start button is clicked
		var button_start = buttons_area.find("#start");
		button_start.click(function() {
			run();
		});
	}

	function run() {
		//get text value and store it
		var text = text_field.val();

		if(text == '') {
			text_field.parent().addClass("has-error");
			text_field.focus();
			return;
		}

		state = "running";

		//buttons should be pause and stop buttons
		buttons_area.html('<span class="btn btn-default" disabled><span class="glyphicon glyphicon-time"></span> <span id="elapsedTime"></span></span> <button type="button" id="done" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span> Done</button>');

		elapsedTime();
		var button_done = buttons_area.find("#done");
		button_done.click(function() {
			text_field.focus();
			start();
		});
	}

	function elapsedTime() {
		var elapsedTimePlaceholder = $("#elapsedTime"),
			timeString = "00:00";
		elapsedTimePlaceholder.text(timeString);

		var clock = countUp({
			callback: function(days, hours, minutes, seconds) {
				days = ("0" + days).slice(-2);
				hours = ("0" + hours).slice(-2);
				minutes = ("0" + minutes).slice(-2);
				seconds = ("0" + seconds).slice(-2);

				if(days!="00") {
					timeString = days+":"+hours+":"+minutes+":"+seconds;
				}
				else if(hours!="00") {
					timeString = hours+":"+minutes+":"+seconds;
				}
				else {
					timeString = minutes+":"+seconds;
				}
				elapsedTimePlaceholder.text(timeString);
			}
		});

	}

	function switchState() {
		if(state === "start") {
			run();
		}
		else {
			start();
		}
		return false;
	}

	//countup
	function countUp(prop) {

		var days	= 24*60*60,
			hours	= 60*60,
			minutes	= 60;

		var options = $.extend({
				callback	: function(){},
				start		: new Date()
			},prop);

		var passed = 0, elapsed, d, h, m, s, clock;

		//do this every second		
		function tick(){
			var now = new Date();
			passed = Math.floor((now - options.start) / 1000);
			// Number of days passed
			d = Math.floor(passed / days);
			passed -= d*days;
			// Number of hours
			h = Math.floor(passed / hours);
			passed -= h*hours;
			// Number of minutes 
			m = Math.floor(passed / minutes);
			passed -= m*minutes;
			// Number of seconds
			s = passed;
			// Calling an optional user supplied callback
			if($.isFunction(options.callback)) {
				options.callback(d, h, m, s);
			}
		}
		function run() {
			tick();
			clock = setInterval(tick, 1000);
		}
		function pause() {
			clearInterval(clock);
		}
		run();

		return {
			run: run,
			pause: pause
		}
	}

});