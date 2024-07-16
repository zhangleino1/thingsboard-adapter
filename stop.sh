#!/bin/bash

PID_FILE="/root/bigscreen/thingsboard-adapter/proxy-server.pid"

if [ -f $PID_FILE ]; then
    PID=$(cat $PID_FILE)
    echo "Stopping proxy server (PID: $PID)..."
    kill $PID
    rm $PID_FILE
    echo "Proxy server stopped."
else
    echo "Proxy server is not running."
fi