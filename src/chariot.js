import Cart from 'cartActions';
import ajax from 'ajax';

'use strict';

let Chariot = window.Chariot || {};

Chariot = (function(Chariot){

	let settings = {};
	
	const defaultSettings = {
		queueWaitTime = 180, // in milliseconds
		useViewAttributes = false,
	}
	
	function revealSettings(print) {
		if (print === true){
			console.info(settings);
		}
	
		return settings;
	}
	
	function updateSettings(userSettings, printSettings){
		Object.assign(settings, defaultSettings, userSettings)
	
		if (printSettings === true){
			revealSettings(true);
		}
	}
	
	function init(newSettings) {
		// @TODO: Add verbose/debug mode
		updateSettings(newSettings);
	}
	
	return {
		init: init,
		start: init,
		settings: returnSettings,
		changeSettings: updateSettings
	}

})(Chariot);
