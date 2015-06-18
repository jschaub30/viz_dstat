#!/bin/bash

usage() {
  echo Create dstat file using this format
	echo "   dstat --time -v --net --output [DSTAT_CSV] [DELAY_SEC]"
	echo Example:
	echo "   dstat --time -v --net --output example.csv 1 10"
	echo "   $0 example.csv"
}

kill_procs() {
    echo "Stopping dstat"
    kill $DSTAT_PID > /dev/null
}
trap 'kill_procs' SIGTERM SIGINT # Kill process monitors if killed early

#[ $1 -lt 1 ] && usage && exit 1

CSV_FN=$1
HTML_DIR=html.$(date +"%Y%m%d-%H%M%S")
mkdir -p $HTML_DIR
cp -r js $HTML_DIR/.
cd $HTML_DIR
echo Starting dstat--use CTRL-C to stop
dstat --time -v --net --output dstat.csv &
DSTAT_PID=$!
echo Now starting http server--point your browser to localhost:12121
python -m SimpleHTTPServer 12121
