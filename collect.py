import sys
import math
import random
from time import sleep

import requests

page_size = 30
base_url = 'https://www.yelp.com/collection/user/rendered_items'

def sleep_random():
  sleep(random.randint(15, 30))


def numbered_filename(prefix, num):
  return f'./output/{prefix}-{str(num).zfill(4)}.json'


def get_rendered_items(colleciton_id, offset=0, count=30):
  params = {
    'collection_id': collection_id,
    'sort_by': 'date',
    'offset': offset,
  }

  for i in range(math.ceil(count // page_size) + 1):
    offset += page_size
    params.update(offset=offset)

    try:
      print(f'Retrieving url with params: {params}')
      res = requests.get(base_url, params=params)

      filename = numbered_filename('rendered_items', i)
      with open(filename, 'w') as f:
        f.write(res.text)

    except Exception as e:
      with open('errors.txt', 'a') as f:
        print(e)
        f.write(f'Error retrieving url with params {params}: {e}\n')

    sleep_random()


if __name__ == '__main__':
  # https://www.yelp.com/collection/user/rendered_items?collection_id=c5OeENjpDIH-gxU8dsaEVg&sort_by=date&offset=0
  collection_id = 'c5OeENjpDIH-gxU8dsaEVg'
  count = 3669  # number of items in collection
  get_rendered_items(collection_id, count=count)
