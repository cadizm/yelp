from datetime import datetime
from time import sleep
import csv
import random
import sys

import requests

"""
Example API call to remove a saved item from collection. Note required cookies and csrf token.

  curl --location --request POST 'https://www.yelp.com/collection/user/item/remove' \
    --header 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
    --header 'Cookie: zss=<REDACTED>; bse=<REDACTED>' \
    --data-urlencode 'csrftok=<REDACTED>' \
    --data-urlencode 'collection_id=<REDACTED>' \
    --data-urlencode 'item_id=<REDACTED>'
"""

base_url = 'https://www.yelp.com/collection/user/item/remove'
collection_id = 'SET-ME'
csrftok = 'SET-ME'

"""
Extract necessary cookie keys:
  cookie = 'very=long; cookie=string'
  {k.strip(): v for k, v in dict([tuple(kv.split('=', 1)) for kv in cookie.split(';')]).items() if k.strip() in ('zss', 'bse')}
"""
headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  'Cookie': 'zss=SET-ME; bse=SET-ME',
}

params = {
  'csrftok': csrftok,
  'collection_id': collection_id,
}

def sleep_random(lower=20, upper=40, multiplier=1):
  sleep(random.randint(lower, upper) * multiplier)


def remove_item(item_id, retries=1):
  params.update(item_id=item_id)
  payload = '&'.join([f'{k}={v}' for k, v in params.items()])

  try:
    return requests.post(base_url, headers=headers, data=payload, timeout=5)

  except Exception as e:
    print(e)
    if retries > 0:
      print(f'{datetime.now()} - Sleeping before retry')
      sleep_random(30, 60, 1 + (1 / retries))
      print(f'{datetime.now()} - Retrying now')

      return remove_item(item_id, retries - 1)


def remove_items(filename):
  with open(filename) as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
      print(f"Removing {row['name']} with key {row['key']}")
      response = remove_item(row['key'])

      if response and response.ok:
        print(f"Count remaining: {response.json()['updated_count']}")
        sleep_random()
        continue

      with open('remove-errors.txt', 'a') as f:
        message = response.text if response \
          else f'Exception encountered, aborting at row {row}\n'
        f.write(message)
      break


if __name__ == '__main__':
  remove_items(sys.argv[1])
