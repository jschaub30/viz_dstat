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
echo Working directory is $HTML_DIR
if [ $# -lt 1 ]
then
  # Launch dstat measurement
  kill_dstat() {
    echo "Stopping dstat"
    kill $DSTAT_PID > /dev/null
  }
  trap 'kill_dstat' SIGTERM SIGINT # Kill dstat when webserver is killed
  cp index.html $HTML_DIR/.
  echo Starting dstat using this command:
  echo "dstat --time -v --net --output dstat.csv"
  dstat --time -v --net --output $HTML_DIR/dstat.csv > /dev/null &
  DSTAT_PID=$!
  ARG="and dstat measurement"
else
  echo Visualizing file $1
  cp $1 $HTML_DIR/.
  cat index.html | sed "s/dstat.csv/$1/g" > $HTML_DIR/index.html
fi
  
cd $HTML_DIR

echo Starting web server--point your browser to http://localhost:12121
echo use CTRL-C to stop web server $ARG
python -m SimpleHTTPServer 12121
