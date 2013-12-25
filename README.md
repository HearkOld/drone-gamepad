# Drone gamepad

Controlling drone via HTML5 gamepad API.

I'm using `Logitech Logitech Extreme 3D (Vendor: 046d Product: c215)"` for gamepad.

![extreme 3d pro](https://raw.github.com/chilijung/drone-gamepad/master/image/extreme.jpeg "extreme 3d pro")


## Prerequisite

- node
- npm

## Support command

- FACE_3: takeoff
- FACE_1: land
- RIGHT_STICK: clockwise
- LEFT_STICK: counterClockwise
- START_FORWARD: down
- SELECT_BACK: up
- LEFT_STICK_X < 0: right
- LEFT_STICK_X > 0: left
- LEFT_STICK_Y > 0: front
- LEFT_STICK_Y < 0: back

## Develop

enter the command below

```
npm install
coffee app.coffee
```

## Flow chart

![flow chart](https://raw.github.com/chilijung/drone-gamepad/master/image/flow.png "chart")

## License

MIT [@chilijung](chilijung@gmail.com)

## Reference

- http://www.html5rocks.com/en/tutorials/doodles/gamepad/
