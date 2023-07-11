#!/bin/bash

echo "changing ownership of data volume"
chown -R appuser:appuser /.stader

echo "starting supervisord"
supervisord --nodaemon --configuration /etc/supervisord.conf

# if this exits - wait a few seconds before restarting
sleep 10
