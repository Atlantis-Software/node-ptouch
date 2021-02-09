var CONSTANTS = require('./constants');

var ptouch = function(template, options) {
  this.template = template;
  this.options = options || {};
  this.objects = [];
};

ptouch.prototype.insertData = function(objectName, value) {
  this.objects.push({objectName, value});
};

ptouch.prototype.generate = function() {
  var data = [];
  data.push(CONSTANTS.PTOUCH_MODE);
  data.push(CONSTANTS.INITIALIZE);
  // select template
  var digit2 = this.template % 10;
  var digit1 = (this.template - digit2) / 10;
  var t1 = Buffer.from([digit1.toString().charCodeAt(0)]);
  var t2 = Buffer.from([digit2.toString().charCodeAt(0)]);
  data.push(Buffer.concat([Buffer.from([0x5e, 0x54, 0x53, 0x30]), t1, t2]));
  // insert data
  this.objects.forEach(function(obj) {
    // select object
    data.push(Buffer.concat([Buffer.from([0x5e, 0x4f, 0x4e]), Buffer.from(obj.objectName), Buffer.from([0x00])]));
    // insert value
    var num1 = obj.value.length % 256;
    var num2 = (obj.value.length - num1) / 256;
    data.push(Buffer.concat([Buffer.from([0x5e, 0x44, 0x49]), Buffer.from([num1]), Buffer.from([num2]), Buffer.from(obj.value)]));
  });
  if (this.options.copies > 1) {
    var copies3 = this.options.copies % 10;
    var copies2 = ((this.options.copies - copies3) / 10) % 10;
    var copies1 = ((this.options.copies - copies3 - 10 * copies2) / 100) % 10;
    var c1 = Buffer.from([copies1.toString().charCodeAt(0)]);
    var c2 = Buffer.from([copies2.toString().charCodeAt(0)]);
    var c3 = Buffer.from([copies3.toString().charCodeAt(0)]);
    data.push(Buffer.concat([Buffer.from([0x5e, 0x43, 0x4E]), c1, c2, c3]));
  }
  data.push(CONSTANTS.FF);
  return Buffer.concat(data);
};

module.exports = ptouch;
