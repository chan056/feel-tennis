import "babel-polyfill";

window.doT = require('../../lib/dot.min.js')
window.axios = require('../../lib/axios.min.js');
require('./axios.config.js');
require('../../lib/zepto.js');

require('./constant.js');
require('./tools.js');

require('./fragment.js')();