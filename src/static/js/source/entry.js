import "babel-polyfill";

require('./constant.js');
require('./tools.js');

var directive = require('./directive.js');
var template = require('./template.js');
var gComponent = require('./global_component.js');
var component = require('./component.js');
var fragment = require('./fragment.js');
var routeConfig = require('./router_config.js');
var globalEvent = require('./global_event.js');

directive();
template();
gComponent();
component();
fragment();
routeConfig();
globalEvent();