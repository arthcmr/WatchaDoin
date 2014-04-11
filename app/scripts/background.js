chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

console.log('Browser Action');

var $, clock;
var state = {
	status: "idle",
	text: "",
	start: undefined,
	stop: undefined
}
var badge = {
	color: '',
	text: ''
}

var history = [];

function setJQuery(jQuery) {
	$ = jQuery;
}

function setState(prop, value) {
	state[prop] = value;
}

function getState() {
	return state;
}

function stop() {
	setState("status", "idle");
	setBadge('stop');
	if(clock) clock.stop();

	addToHistory(state.text, state.start, state.end);
	state = {
		status: "idle",
		text: "",
		start: undefined,
		stop: undefined
	}
}

function run(element) {
	setState("status", "running");
	elapsedTime(element);
}

function addToHistory(text, start, stop) {
	history.push({
		text: text,
		start: start,
		stop: stop
	});
}

//set the badge text that appears next to the icon
//type can be "play", "pause" or "stop"
function setBadge(type, value) {
	if(typeof type === 'undefined') return;
	var color, text;
	switch(type) {
		case 'play':
			color = "#85B200";
			text = '►';
			break;
		case 'stop':
		default:
			color = "#999999";
			text = '';
			break;
	}
	if(typeof value !== 'undefined') {
		text = value;
	}
	//store value so we only change when necessary
	if(color !== badge.color) {
		badge.color = color;
		chrome.browserAction.setBadgeBackgroundColor({color: badge.color});
	}
	if(text !== badge.text) {
		badge.text = text;
		chrome.browserAction.setBadgeText({text: badge.text});
	}

};

function elapsedTime(placeholder) {
	if(clock) clock.stop();
	var timeString, badgeString;

	clock = countUp({
		start: state.start,
		onTick: function(days, hours, minutes, seconds) {
			days_s = ("0" + days).slice(-2);
			hours_s = ("0" + hours).slice(-2);
			minutes_s = ("0" + minutes).slice(-2);
			seconds_s = ("0" + seconds).slice(-2);

			if(days_s!="00") {
				timeString = days_s+":"+hours_s+":"+minutes_s+":"+seconds_s;
			}
			else if(hours_s!="00") {
				timeString = hours_s+":"+minutes_s+":"+seconds_s;
			}
			else {
				timeString = minutes_s+":"+seconds_s;
			}
			if(days > 0) {
				badgeString = days+"d";
			}
			else if(hours > 0) {
				badgeString = hours+"h";
			}
			else if(minutes > 0) {
				badgeString = minutes+"m";
			}
			else {
				badgeString = seconds+"s";
			}
			placeholder.text(timeString);
			setBadge('play', badgeString);
		},
		onStart: function(time) {
			setState('start', time);
			setState('stop', undefined);
		},
		onStop: function(time) {
			setState('stop', time);
		}
	});
	clock.run();

};

//countup
function countUp (prop) {

	prop = prop || {};

	var days	= 24*60*60,
		hours	= 60*60,
		minutes	= 60
		now = new Date();

	var options = {};
	options.start = prop.start || new Date();
	options.onTick = prop.onTick || function(){};
	options.onStart = prop.onStart || function(){};
	options.onStop = prop.onStop || function(){};

	var passed = 0, elapsed, d, h, m, s, clock;

	//do this every second		
	function tick(){
		now = new Date();
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
		options.onTick(d, h, m, s);
	}
	function run() {
		options.onStart(options.start);
		tick();
		clock = setInterval(tick, 1000);
	}
	function stop() {
		options.onStop(now);
		clearInterval(clock);
	}

	return {
		run: run,
		stop: stop
	}
};

// setBadge("pause");

// setTimeout(function() {
// 	setBadge("play");
// }, 10000);
// setTimeout(function() {
// 	setBadge("stop");
// }, 20000);


// var storeList = Array();
// var ambiente = 'www';
// var instalacao = '000';

// function S4() {
//    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
// }
// function guid() {
//    return (instalacao+"-"+S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
// }

// if (localStorage["localid"]){
// 	var localid = localStorage["localid"];
// }else{
// 	localStorage["localid"] = guid();
// 	var localid = localStorage["localid"];
// }

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
//     if (changeInfo.status === 'complete') {
//     	if (storeList.length > 0){
// 			chrome.tabs.getSelected(null, function(tab) {
// 			  chrome.tabs.sendMessage(tabId, {mensagem: "executar", sL: storeList, aB: ambiente, lId: localid}, function() {});
// 			});    		
//     	}else{
//     		atualizaLista(tabId);
//     	}
// 	}
// });

// function atualizaLista(tabId){
// 	var xhr = new XMLHttpRequest();
// 	xhr.onreadystatechange = function(e){
// 	    if (xhr.readyState == 4) {
// 	    	if (xhr.responseText != ''){
// 				storeList= JSON.parse(xhr.responseText);
// 				if (tabId){
// 					chrome.tabs.getSelected(null, function(tab) {
// 					  chrome.tabs.sendMessage(tabId, {mensagem: "executar", sL: storeList, aB: ambiente, lId: localid}, function() {});
// 					});    							
// 				}	    		
// 	    	}
// 		}		
// 	}; // Implemented elsewhere.
// 	xhr.open("GET", 'http://'+ambiente+'.baixou.com.br/extensions/storeList/', true);
// 	xhr.send(null);	
// }

// atualizaLista();