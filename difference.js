
var fs = require('fs'),
    util = require('util'),
    _ = require('underscore');


var index = process.argv[0] === 'node' ? 2 : 1;
var bookmarks_files = _.rest(process.argv, index);

var lhs = [],
    rhs = [],
    counter = 0;

_.each(bookmarks_files, function(b) {
    var arr = counter == 0 ? lhs : rhs;
    var bookmarks = JSON.parse(fs.readFileSync(b));
    _.each(bookmarks.bookmarks, function(b) {
        arr.push(util.format('%s %s %s', b.name, b.addr, b.url.yelp));
    });
    counter += 1;
});

var difference = _.difference(lhs, rhs);
_.each(difference, function(d) {
    console.log(d);
});
