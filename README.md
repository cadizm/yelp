
Save Yelp bookmarks to disk and parse/geocode addresses
=======================================================

For whatever reason, yelp doesn't provide users a way (or developers an api)
for downloading their saved bookmarks.

This repo contains an exceedingly simple ruby mechanize script to save the
html source of all the bookmark pages for a given user.

It also contains helper node scripts to parse and geocode addresses.

Prerequisites
=============

[Ruby Mechanize](http://mechanize.rubyforge.org)
[Node.js](http://nodejs.org)
