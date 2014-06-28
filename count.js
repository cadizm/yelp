
var fs = require('fs'),
    _ = require('underscore');


var index = process.argv[0] === 'node' ? 2 : 1;
var bookmarks_files = _.rest(process.argv, index);

_.each(bookmarks_files, function(b) {
    var bookmarks = JSON.parse(fs.readFileSync(b));
    console.log(b, bookmarks.bookmarks.length);
});
