import sys
import json
import re
import csv
import time

fieldnames = ['key', 'name', 'url']

def get_data(filename):
  with open(filename) as f:
    return json.loads(f.read())


def parse_markup(markup):
  """
  Example markup
  <a class="biz-name js-analytics-click" data-analytics-label="biz-name" href="/biz/cassells-hamburgers-dtla-los-angeles"><span >Cassell’s Hamburgers Dtla</span></a>
  """
  pattern = re.compile('.*?href.*?=.*"(?P<path>.*?)".*<.*span.*>(?P<name>.*?)<.*/.*span.*>')
  matches = pattern.search(markup)
  d = matches.groupdict()

  return (d['name'], f"https://www.yelp.com{d['path']}")


def process_marker(marker):
  key, markup = marker['key'], marker['hovercardMarkup']
  name, url = parse_markup(markup)

  return dict(key=key, name=name, url=url)


def process(filename):
  data =get_data(filename)
  map_state = json.loads(data['map_state'])
  markers = map_state['markers']

  return [
    process_marker(marker)
    for marker in markers
  ]


def process_files(filenames):
  with open(f'items-{int(time.time())}.csv', 'w') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for file in filenames:
      rows = process(file)
      for row in rows:
        writer.writerow(row)


if __name__ == '__main__':
  process_files(sys.argv[1:])
