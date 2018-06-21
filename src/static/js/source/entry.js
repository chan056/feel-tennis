// <script src="../js/constant.js"></script>
// <script src="../js/tools.js"></script>

// <script src="../js/template.js"></script>
// <script src="../js/global_component.js"></script>
// <script src="../js/component.js"></script>
// <script src="../js/fragment.js"></script>
// <script src="../js/router_config.js"></script>
// <script src="../js/global_hide.js"></script>

import "babel-polyfill";

require('./constant.js');
require('./tools.js');

var template = require('./template.js');
var gComponent = require('./global_component.js');
var component = require('./component.js');
var fragment = require('./fragment.js');
var routeConfig = require('./router_config.js');
var globalEvent = require('./global_event.js');


template();
gComponent();
component();
fragment();
routeConfig();
globalEvent();