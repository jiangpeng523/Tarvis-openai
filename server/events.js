const EventEmitter = require('events');

class MyEmiter extends EventEmitter{};

const Emitter = new MyEmiter();

module.exports = Emitter;