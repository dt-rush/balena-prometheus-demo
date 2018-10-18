#!/bin/bash

docker build -t balena-api-mock ./modules/balena-api-mock
docker build -t balena-prometheus ./modules/balena-prometheus
docker build -t balena-grafana ./modules/balena-grafana
