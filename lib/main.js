var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;


var gamepadSupport = {}

gamepadSupport = {

	/**
	 * Starts a polling loop to check for gamepad state.
	 */
	startPolling: function() {
		console.log('here1')
	  // Don't accidentally start a second loop, man.
	  if (!gamepadSupport.ticking) { 
	  	console.log('here2')
	    gamepadSupport.ticking = true;
	    gamepadSupport.tick();
	  }
	},

	/**
	 * Stops a polling loop by setting a flag which will prevent the next
	 * requestAnimationFrame() from being scheduled.
	 */
	stopPolling: function() {
	  gamepadSupport.ticking = false;
	},

	/**
	 * A function called with each requestAnimationFrame(). Polls the gamepad
	 * status and schedules another poll.
	 */  
	tick: function() {
	  gamepadSupport.pollStatus();
	  gamepadSupport.scheduleNextTick();
	},

	scheduleNextTick: function() {
	  // Only schedule the next frame if we haven't decided to stop via
	  // stopPolling() before.
	  if (gamepadSupport.ticking) {
	    if (window.requestAnimationFrame) {
	      window.requestAnimationFrame(gamepadSupport.tick);
	    } else if (window.mozRequestAnimationFrame) {
	      window.mozRequestAnimationFrame(gamepadSupport.tick);
	    } else if (window.webkitRequestAnimationFrame) {
	      window.webkitRequestAnimationFrame(gamepadSupport.tick);
	    }
	    // Note lack of setTimeout since all the browsers that support
	    // Gamepad API are already supporting requestAnimationFrame().
	  }    
	},

	/**
	 * Checks for the gamepad status. Monitors the necessary data and notices
	 * the differences from previous state (buttons for Chrome/Firefox, 
	 * new connects/disconnects for Chrome). If differences are noticed, asks 
	 * to update the display accordingly. Should run as close to 60 frames per 
	 * second as possible.
	 */
	pollStatus: function() {
	  // (Code goes here.)
	  // 
	  	var gamepad = navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];
	  	console.log(gamepad)
	},

	/**
	 * React to the gamepad being connected. Today, this will only be executed 
	 * on Firefox.
	 */
	onGamepadConnect: function(event) {
	  // Add the new gamepad on the list of gamepads to look after.
	  gamepadSupport.gamepads.push(event.gamepad);

	  // Start the polling loop to monitor button changes.
	  gamepadSupport.startPolling();

	  // Ask the tester to update the screen to show more gamepads.
	  tester.updateGamepads(gamepadSupport.gamepads);
	},

	/**
	 * Initialize support for Gamepad API.
	 */
	init: function() {
	  // As of writing, it seems impossible to detect Gamepad API support
	  // in Firefox, hence we need to hardcode it in the third clause. 
	  // (The preceding two clauses are for Chrome.)
	  var gamepadSupportAvailable = !!navigator.webkitGetGamepads || 
	      !!navigator.webkitGamepads ||
	      (navigator.userAgent.indexOf('Firefox/') != -1);

	  if (!gamepadSupportAvailable) {
	    // It doesn't seem Gamepad API is available – show a message telling
	    // the visitor about it.
	    tester.showNotSupported();
	  } else {
	    // Firefox supports the connect/disconnect event, so we attach event
	    // handlers to those.
	    window.addEventListener('MozGamepadConnected', 
	                            gamepadSupport.onGamepadConnect, false);
	    window.addEventListener('MozGamepadDisconnected', 
	                            gamepadSupport.onGamepadDisconnect, false);

	    // Since Chrome only supports polling, we initiate polling loop straight
	    // away. For Firefox, we will only do it if we get a connect event.
	    if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
	      gamepadSupport.startPolling(); 
	      console.log('start polling')
	    }
	  }
	}

		
}

gamepadSupport.init();