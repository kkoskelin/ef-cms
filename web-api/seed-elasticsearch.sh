#!/bin/bash

curl -s -X DELETE "localhost:9200/efcms-case" > /dev/null
curl -s -X DELETE "localhost:9200/efcms-document" > /dev/null
curl -s -X DELETE "localhost:9200/efcms-user" > /dev/null
ELASTICSEARCH_PORT=9200 ELASTICSEARCH_PROTOCOL="http" node ./web-api/elasticsearch/elasticsearch-index-settings.js
