# node-ptouch
A node.js library to print ptouch label on brother label printer.

## Description

a node.js library to print ptouch label on brother label printer.

now tested on:

* QL-820NWB

## Installation

Installation uses the [npm](http://npmjs.org/) package manager.  Just type the following command after installing npm.

    npm install node-ptouch


## Example

```javascript
var Ptouch = require('node-ptouch');
var net = require('net');

// generate ptouch code
var ptouch = new Ptouch(1, {copies: 2}); // select template 1 for two copies
ptouch.insertData('myObjectName', 'hello world'); // insert 'hello world' in myObjectName
var data = ptouch.generate();

// send data to printer
var socket = new net.Socket();
socket.on('close', function() {
  console.log('Connection closed');
});

socket.connect(9100, '192.168.1.200', function(err) {
  if (err) {
    return console.log(err);
  }
  socket.write(data, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('data sent');
    socket.destroy();
  });
});
```

## Documentation


## License

node-ptouch is available under the MIT license.
