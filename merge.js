
var fs = require('fs'),
    util = require('util'),
    crypto = require('crypto'),
    _ = require('underscore');


var index = process.argv[0] === 'node' ? 2 : 1;
var bookmarks_files = _.rest(process.argv, index);

var res = {},
    merged = { bookmarks: [] };

_.each(bookmarks_files, function(b) {
    var bookmarks = JSON.parse(fs.readFileSync(b));
    _.each(bookmarks.bookmarks, function(b) {
        var sha1 = crypto.createHash('sha1');
        sha1.update(b.name);
        sha1.update(b.url.yelp);
        sha1.update(b.addr);
        var digest = sha1.digest('hex');
        if (!res[digest]) {
            res[digest] = b;
        }
        else if (!res[digest].hasOwnProperty('location')) {
            res[digest] = b;
        }
    });
});

var outfile = util.format('bookmarks-merged-%d.json', Date.now());
console.log('Saving progress to ' + outfile);
merged.bookmarks = _.values(res);
var buf = JSON.stringify(merged, null, 4);
fs.writeFile(outfile, buf, function(err_) {
    if (err_) throw err;
});
