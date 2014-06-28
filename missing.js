
var fs = require('fs'),
    util = require('util'),
    _ = require('underscore');


var index = process.argv[0] === 'node' ? 2 : 1;
var bookmarks_files = _.rest(process.argv, index);

var missing = {
    bookmarks: []
};

_.each(bookmarks_files, function(b) {
    var bookmarks = JSON.parse(fs.readFileSync(b));
    _.each(bookmarks.bookmarks, function(b) {
        if (!b.hasOwnProperty('location')) {
            missing.bookmarks.push(b);
        }
    });
});

var outfile = util.format('bookmarks-missing-%d.json', Date.now());
console.log('Saving progress to ' + outfile);
var buf = JSON.stringify(missing, null, 4);
fs.writeFile(outfile, buf, function(err_) {
    if (err_) throw err;
});
