# viz_dstat
Visualize dstat results on a web page.  Can optionally launch dstat and monitor results in real time.

#Uses these tools
- [dstat](http://dag.wiee.rs/home-made/dstat/)
- python SimpleHTTPServer for web server
- [Dygraphs](http://dygraphs.com/) for javascript charts

##Visualize existing file
```$ $ dstat --time -v --net --output example.csv 1 10
$ ./viz_dstat.sh example.csv```

##Measure and visualize
```$ ./viz_dstat.sh```

Then point your browser to http://localhost:12121
