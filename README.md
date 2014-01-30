# Geo Quiz Game

A basic map quiz game that I built to learn [Leaflet.js](http://leafletjs.com) and [Backbone.js](http://backbonejs.org/).

# Creating datasets

With much help from [Mike Bostock](http://bost.ocks.org/mike/)'s [Let's Make a Map](http://bost.ocks.org/mike/map/).

Install GDAL and topojson:

     # (Ubuntu)
     sudo npm install -g topojson
     sudo apt-get install gdal-bin 

We use [topojson](https://github.com/mbostock/topojson) to reduce the size of geographic datasets. For example, the UK counties dataset is reduced from 3mb (geojson) to 107kb (topojson).

## UK administrative regions data (complex!)
Data: GADM

The UK's administrative geography is complex.

    wget http://biogeo.ucdavis.edu/data/gadm2/shp/GBR_adm.zip
    unzip GBR_adm.zip 
    ogr2ogr -f GEOJSON -t_srs "EPSG:4326" uk.json GBR_adm2.shp
	topojson -o uk.topo.json uk.json --properties --simplify-proportion 0.2
    cp counties.topo.json $PROJECT_DIR/data/.
    
## UK historical counties data (too historical!)
Data: county-borders.co.uk    

    wget "http://www.county-borders.co.uk/Historic_Counties_of_England&Wales_longlat.zip"
    unzip "Historic_Counties_of_England&Wales_longlat.zip"
		ogr2ogr -f GEOJSON uk-counties.json "Historic_Counties_of_England&Wales_longlat.shp"
    topojson -o uk-counties.topo.json uk-counties.json --properties --simplify-proportion 0.2   
 
## US States
Data: Mike Bostock

    wget http://bl.ocks.org/mbostock/raw/2206489/7110de3d8412433d3222c9b7e3ac6593593162b2/us-states.json
    toposjon -p -o us-states.topo.json us-states.json

# Ideas for future development

 * More types of question
 * Better responsive design for map - make it bigger where possible
 * "Explore" view 
 * Review answers at the end of a quiz
 * Improve visual design
 * Don't draw map outlines until map zoom animations are finished

# Key things I learned

 * Design from routing inwards - retrofitting is hard and will probably need design changes
 * Always tell old models to stop listening to events
 * Make sure Leaflet zoom levels are valid before setting