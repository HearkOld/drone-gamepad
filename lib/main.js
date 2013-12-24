$(document).ready(function() {
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
		console.log('button down: ')
		console.log(e.control + 'down')
	});
	
	gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
		console.log('button up: ')
		console.log(e.control + 'up')
	});

	gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
		console.log('axis change: ')
		console.log(e.axis + ' change to ' + e.value)
	});

	if (!gamepad.init()) {
		alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
	}
});