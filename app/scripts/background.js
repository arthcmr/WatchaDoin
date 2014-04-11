chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

console.log('Browser Action');

//set the badge text that appears next to the icon
//type can be "play", "pause" or "stop"
function setBadge(type) {
	if(typeof type === 'undefined') return;
	switch(type) {
		case 'play':
			chrome.browserAction.setBadgeBackgroundColor({color:"#85B200"});
			chrome.browserAction.setBadgeText({text: '►'});
			break;
		case 'pause':
			chrome.browserAction.setBadgeBackgroundColor({color:"#FF9326"});
			chrome.browserAction.setBadgeText({text: '•'});
			break;
		case 'stop':
		default:
		chrome.browserAction.setBadgeText({text: ''});
			break;
	}
}

setBadge("pause");

setTimeout(function() {
	setBadge("play");
}, 10000);
setTimeout(function() {
	setBadge("stop");
}, 20000);