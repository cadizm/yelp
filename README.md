
Save Yelp bookmarks to disk
===========================

For whatever reason, yelp doesn't provide users a way (or developers an api)
for downloading their saved bookmarks.

This exceedingly simple script saves the html source of all the bookmark pages
for a given user.

Users can then parse the source to retrieve their bookmarks.

Prerequisites
=============

[Ruby Mechanize](http://mechanize.rubyforge.org)
