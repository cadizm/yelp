
var fs = require('fs'),
    util = require('util'),
    https = require('https'),
    async = require('async'),
    sleep = require('sleep'),
    config = require('./config'),
    secret = require('./secret');


function formatPath(b) {
    var address = encodeURIComponent(util.format('%s %s %s, %s',
            b.addr, b.city, b.state, b.zip));
    var path = util.format('%s?address=%s&key=%s', config.path, address,
            secret.key);
    return path;
}

function save(b)
{
    var outfile = util.format('bookmarks-geocoded.json');
    console.log('Saving progress to ' + outfile);
    var buf = JSON.stringify(b, null, 4);
    fs.writeFile(outfile, buf, function(err_) {
        if (err_) throw err;
    });
}

var index = process.argv[0] === 'node' ? 2 : 1;
var bookmarks = JSON.parse(fs.readFileSync(process.argv[index]));
var counter = 0;

async.eachSeries(bookmarks.bookmarks, function(b, callback) {
    if (b.hasOwnProperty('location')) {
        callback();
    }
    var options = {
        hostname: config.hostname,
        path: formatPath(b),
    };
    var buf = [];
    var request = https.request(options, function(response) {
        response.on('data', function(chunk) {
            buf.push(chunk)
        });
        response.on('end', function() {
            buf = Buffer.concat(buf);
            var res = JSON.parse(buf);
            if (res.status === 'OK') {
                var r = res.results.pop();  // assume 1 result
                b.location = r.geometry.location;
                counter += 1;
                if (counter > 9 && counter % 10 == 0) {
                    sleep.sleep(1);
                    save(bookmarks);
                }
            }
            else if (res.status === 'OVER_QUERY_LIMIT') {
                callback('Request quota exceeded, bailing');
            }
            else {
                var message = util.format("Error occurred in geocoding "
                    + "address for %s", b.name);
                console.log(message);
            }
            callback();
        });
    });
    request.end();
    request.on('error', function(e) {
        console.log(e);
    });
}, function(err) {
    if (err) {
        console.log(err);
    }
    save(bookmarks);
});
