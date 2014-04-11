//popup script

var background = chrome.extension.getBackgroundPage();

$(function() {

	//TO DO: remove this workaround
	background.setJQuery($);

	var buttons_area = $("#buttons");
	var text_field = $("#activity");
	var state = background.getState();

	function init () {

		text_field.val(state.text);
		//removeError class
		text_field.bind('keyup', function(e) {
			var text = text_field.val();
			background.setState('text', text);

			if(text != '') {
				text_field.parent().removeClass("has-error");
			}

			var code = e.keyCode || e.which;
			if(code == 13) { //Enter keycode
			   switchState();
			}
		});

		if(state.status === "running") {
			run();
		}
		else {
			start();
		}
	}

	function start() {
		//text should be empty
		text_field.val('');
		text_field.focus();

		background.setBadge("");
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

		//buttons should be pause and stop buttons
		buttons_area.html('<span class="btn btn-default" disabled><span class="glyphicon glyphicon-time"></span> <span id="elapsedTime"></span></span> <button type="button" id="done" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span> Done</button>');

		background.run($("#elapsedTime"));

		var button_done = buttons_area.find("#done");
		button_done.click(function() {
			background.stop();
			text_field.focus();
			start();
		});
	}

	function switchState() {
		state = background.getState();
		if(state.status === "idle") {
			run();
		}
		else {
			start();
		}
		return false;
	}

	init();

});