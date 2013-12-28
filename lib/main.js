$(document).ready(function() {
        	var faye = new Faye.Client("/faye", {timeout: 120});
        	var gamepad = new Gamepad();

       	 gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
               	 console.log('Connected', device);

                	$('#gamepads').append('<li id="gamepad-' + device.index + '"><h1>Gamepad #' + device.index + ': &quot;' + device.id + '&quot;</h1></li>');
                
               	
		var mainWrap = $('#gamepad-' + device.index),
			statesWrap,
			control,
			value,
			i;
		
		mainWrap.append('<strong>State</strong><ul id="states-' + device.index + '"></ul>');

		statesWrap = $('#states-' + device.index)

		for (control in device.state) {
			value = device.state[control];
			
			statesWrap.append('<li>' + control + ': <span id="state-' + device.index + '-' + control + '">' + value + '</span></li>');
		}
		for (i = 0; i < device.buttons.length; i++) {
			value = device.buttons[i];
			statesWrap.append('<li>Raw Button ' + i + ': <span id="button-' + device.index + '-' + i + '">' + value + '</span></li>');
		}
		for (i = 0; i < device.axes.length; i++) {
			value = device.axes[i];
			statesWrap.append('<li>Raw Axis ' + i + ': <span id="axis-' + device.index + '-' + i + '">' + value + '</span></li>');
		}
		
		$('#connect-notice').hide();
	});

	gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
		console.log('Disconnected', device);
		
		$('#gamepad-' + device.index).remove();
		
		if (gamepad.count() == 0) {
			$('#connect-notice').show();
		}
	});

	gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
		var gamepad,
			wrap,
			control,
			value,
			i,
			j;
		
		for (i = 0; i < gamepads.length; i++) {
			gamepad = gamepads[i];
			wrap = $('#gamepad-' + i);

			if (gamepad) {
				for (control in gamepad.state) {
					value = gamepad.state[control];

					$('#state-' + gamepad.index + '-' + control + '').html(value);
				}
				for (j = 0; j < gamepad.buttons.length; j++) {
					value = gamepad.buttons[j];

					$('#button-' + gamepad.index + '-' + j + '').html(value);
				}
				for (j = 0; j < gamepad.axes.length; j++) {
					value = gamepad.axes[j];

					$('#axis-' + gamepad.index + '-' + j + '').html(value);
				}
			}
		}
	});

	gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
		
		// FACE_3 takeoff
		// FACE_1 land
		// RIGHT_STICK clockwise
		// LEFT_STICK counterClockwise
		// START_FORWARD down
		// SELECT_BACK up

		if(e.control === 'FACE_3') {
			faye.publish("/drone/drone", {action: "takeoff", speed: 0.3, duration: 1000})
		}else if (e.control === 'FACE_1') {
			faye.publish("/drone/drone", {action: "land", speed: 0.3, duration: 1000})
		}else if (e.control === 'RIGHT_STICK') {
			faye.publish("/drone/move", {action: "clockwise", speed: 0.3, duration: 1000})
		}else if (e.control === 'LEFT_STICK') {
			faye.publish("/drone/move", {action: "counterClockwise", speed: 0.3, duration: 1000}) 
		}else if (e.control === 'START_FORWARD') {
			faye.publish("/drone/move", {action: "up", speed: 0.3, duration: 1000})
		}else if (e.control === 'SELECT_BACK') {
			faye.publish("/drone/move", {action: "down", speed: 0.3, duration: 1000})
		}else {
			// loging message
			console.log('button down: ')
			console.log('e.control')
		}


	});
	
	gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {

		// loging message
		console.log('button up: ')
		console.log(e.control + ' up')
		faye.publish("/drone/drone", {action: "stop"})
	});

	gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {

		// LEFT_STICK_X = -1 go right
		// LEFT_STICK_X = 1 go left
		// LEFT_STICK_Y = 1 go front
		// LEFT_STICK_Y = -1 go back

		console.log('axis change: ')
		console.log(e.axis + ' change to ' + e.value)

		if(e.axis === 'LEFT_STICK_X' && e.value < 0) {
			// left
			faye.publish("/drone/move", {action: "left", speed: 0.1, duration: 1000})
		} else if (e.axis === 'LEFT_STICK_X' && e.value > 0) {
			// right
			faye.publish("/drone/move", {action: "right", speed: 0.1, duration: 1000})
		} else if (e.axis === 'LEFT_STICK_Y' && e.value < 0) {
			// front
			faye.publish("/drone/move", {action: "front", speed: 0.1, duration: 1000})
		} else if (e.axis === 'LEFT_STICK_Y' && e.value > 0) {
			// back
			faye.publish("/drone/move", {action: "back", speed: 0.1, duration: 1000})
		} else if(e.value === 0) {
			// stop
			faye.publish("/drone/drone", {action: "stop"})
		}
	});

	if (!gamepad.init()) {
		alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
	}
});
