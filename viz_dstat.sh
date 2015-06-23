#!/bin/bash
# Launch webserver and visualize dstat measurement in a browser
# Create dstat file using this format
#  $ dstat --time -v --net --output [DSTAT_CSV] [DELAY_SEC]
#  Example:
#  $ dstat --time -v --net --output example.csv 1 10
#  $ ./viz_dstat.sh example.csv
# If called with no arguments, will launch dstat measurement
#  $ ./viz_dstat.sh

CSV_FN=$1
HTML_DIR=html.$(date +"%Y%m%d-%H%M%S")
mkdir -p $HTML_DIR
cp -r js $HTML_DIR/.
cp style.css $HTML_DIR/.
echo Working directory is $HTML_DIR

kill_server() {
	echo 
  [ $DSTAT_PID ] && echo "Stopping dstat measurement" && kill $DSTAT_PID > /dev/null
  echo "Stopping web server"
	kill $SRV_PID 2> /dev/null
}
trap 'kill_server' SIGTERM SIGINT # Kill measurement when webserver is killed

if [ $# -lt 1 ]
then
  # Launch dstat measurement
  echo Starting dstat for 10 minutes using this command:
  echo "dstat --time -v --net --output dstat.csv 1 600"
  dstat --time -v --net --output $HTML_DIR/dstat.csv 1 600 > /dev/null &
  DSTAT_PID=$!
  ARG="and dstat measurement"
  cat index.html | sed "s/refresh_page = false/refresh_page = true/" | \
     sed "s/Visualize dstat measurement/Visualize dstat measurement on $(hostname)/" \
     > $HTML_DIR/index.html
else
  echo Visualizing file $1
  cp $1 $HTML_DIR/.
  cat index.html | sed "s/dstat.csv/$1/g" > $HTML_DIR/index.html
fi
  
cd $HTML_DIR

echo Starting web server--point your browser to http://localhost:12121
echo 
python -m SimpleHTTPServer 12121 2> http_log&
SRV_PID=$!
sleep 0.5
read -p "Press return to stop web server $ARG"
kill_server
