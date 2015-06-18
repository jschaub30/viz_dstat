# viz_dstat
Visualize dstat results on a web page.  Can optionally launch dstat and monitor results in real time.

#Requires
- [dstat](http://dag.wiee.rs/home-made/dstat/)
- [python](https://www.python.org/)

Also uses [Dygraphs](http://dygraphs.com/) for javascript charts (included)

##Visualize existing file
```
$ $ dstat --time -v --net --output example.csv 1 10
$ ./viz_dstat.sh example.csv
```

##Measure and visualize
```
$ ./viz_dstat.sh
```

Then point your browser to http://localhost:12121
