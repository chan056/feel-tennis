var pathToRegexp = require('path-to-regexp');

var keys = []
var re = pathToRegexp('/foo/:bar', keys)
console.log(re, keys)

var re = pathToRegexp('/:foo/:bar')
// keys = [{ name: 'foo', prefix: '/', ... }, { name: 'bar', prefix: '/', ... }]

var r = re.exec('/test/route')
console.log(r)