# Geo Quiz Game

A game that I am working on to learn [leaflet.js](http://leafletjs.com). The only dataset at the moment is [UK administrative areas](http://en.wikipedia.org/wiki/Administrative_geography_of_the_United_Kingdom).

# Creating datasets

With much help from [Mike Bostock](http://bost.ocks.org/mike/)'s [Let's Make a Map](http://bost.ocks.org/mike/map/).

Install GDAL and topojson:

     # (Ubuntu)
     sudo npm install -g topojson
     sudo apt-get install gdal-bin 

We use [topojson](https://github.com/mbostock/topojson) to reduce the size of geographic datasets. For example, the UK counties dataset is reduced from 3mb (geojson) to 107kb (topojson).

## UK administrative regions data (complex!)
The UK's administrative geography is complex.

    wget http://biogeo.ucdavis.edu/data/gadm2/shp/GBR_adm.zip
    unzip GBR_adm.zip 
    ogr2ogr -f GEOJSON -t_srs "EPSG:4326" uk.json GBR_adm2.shp
		topojson -o uk.topo.json uk.json --properties --simplify-proportion 0.2
    cp counties.topo.json $PROJECT_DIR/data/.
    
## UK historical counties data (too historical!)

    wget "http://www.county-borders.co.uk/Historic_Counties_of_England&Wales_longlat.zip"
    unzip "Historic_Counties_of_England&Wales_longlat.zip"
		ogr2ogr -f GEOJSON uk-counties.json "Historic_Counties_of_England&Wales_longlat.shp"
    topojson -o uk-counties.topo.json uk-counties.json --properties --simplify-proportion 0.2   
 
## UK ceremonial counties data (what I really want)
Can't find at the moment - I probably need to start with administrative areas and manually combine into ceremonial counties (provided the licence lets me do that). 