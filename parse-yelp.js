

var cheerio = require('cheerio'),
    fs = require('fs'),
    util = require('util'),
    _ = require('underscore');


function parseBiz(infile)
{
    var $ = cheerio.load(fs.readFileSync(infile).toString());
    var biz_arr = [];
    $('.book_biz_info').each(function(i, v) {
        var biz = {};
        var a = $(v).find('a').first();
        biz.name = a.text();
        biz.url = {}; biz.url.yelp = 'http://www.yelp.com' + a.attr('href');
        var addr_phone = $(v).find('address').html().split('<br>');
        _.each(addr_phone, function(s) {
            // city, state zip
            if (s.indexOf(',') > -1) {
                var temp = s.split(',');
                var temp1 = _.compact(temp[1].split(/\s+/));
                biz.city = temp[0].trim();
                biz.state = temp1[0];
                biz.zip = temp1[1];
            }
            // addr or phone
            else {
                s = s.replace('\n', '').trim();
                var key = s.match(/(\(\d{3}\)\s*)?\d{3}-\d{4}/) ? 'phone' : 'addr';
                biz[key] = biz[key] ? biz[key] += " " + s : s;
            }
        });
        var tags;
        try {
            tags = $(v).find('p').next().first().text();
            tags = tags.split(/categor.*?:/i)[1].split(',');
            tags = _.compact(_.map(tags, function(c) { return c.trim(); }));
        }
        catch (e) {
            tags = [];
        }
        biz.tags = tags;
        biz_arr.push(biz);
    });

    return biz_arr;
}

var files = _.filter(fs.readdirSync('./data'), function(e) {
    return e.match(/^bookmark\d+.html$/);
});

var b = { bookmarks: [] };

_.each(files, function(f) {
    var file = './data/' + f;
    b.bookmarks = b.bookmarks.concat(parseBiz(file));
});

console.log(JSON.stringify(b, null, 4));
