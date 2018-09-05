import "babel-polyfill";

window.axios = require('../../lib/axios.min.js');
require('../../lib/zepto.js');

require('./constant.js');
require('./tools.js');

require('./fragment.js')();