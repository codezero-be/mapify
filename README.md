# Mapify - Google Maps jQuery Plugin

## Installation

### Install via Bower

```
bower install codezero-mapify --save
```

### Install via NPM

```
npm install codezero-mapify --save
```

### Include Scripts

You probably want to [create an API key](https://developers.google.com/maps/documentation/javascript/get-api-key) to work with the Google Maps API. You can use the API without a key, but there will be a warning in the console window.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="mapify.min.js"></script>

<script>
    function initMap() {
        $('.map').mapify();
    }
</script>

<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=initMap" async defer></script>
```

>   The `initMap` function will be called when the Google Maps script is loaded asynchronously.

### Apply Basic Styling

Make sure your map has a width and a height.

```html
<style>
    .map {
        width: 100%;
        height: 500px;
    }
</style>
```

## The Big Picture

My goal with this plugin is to make it as easy and as powerful as you need it to be.

The map is configurable via javascript options when you invoke the plugin. These are considered your default settings for every map on your page (that falls under your `.map` selector of course).

```javascript
$('.map').mapify({
    zoom: 8
});
```

Alternatively you can apply the same options with data attributes on the `.map` element. These will override their javascript equivalent if both exist.

```html
<div class="map" data-zoom="10"></div>
```

What configuration strategy you choose is personal preference. However, in more advanced scenarios, using multiple maps, it could be handy to set javascript defaults and apply per map overrides with data attributes.

>   In any case you will need a map element and run `.mapify()` on it with jQuery. Where you put the options is up to you.

## Usage

### Map with a Single Marker

If you only need to show one marker on a map, it couldn't be simpler:

```javascript
$('.map').mapify({
    lat: 51.251245,
    lng: 4.497890
});
```

This will add a default marker on the `lat` and `lng` coordinates and center the map there.

This is the equivalent of doing:

```html
<div class="map" data-lat="51.251245" data-lng="4.497890"></div>
```

>   The values of the data attributes will always take precedence over the javascript options!

### Map with Multiple Markers

Creating a map with multiple markers is basically the same as the previous example, except that you omit the `lat` and `lng` options and instead use marker objects or elements.

You can add marker objects with a javascript array:

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890 },
        { lat: 50.963258, lng: 3.706874 }
    ]
});
```

Or you can refer to HTML elements using any selector you want:

```javascript
$('.map').mapify({
    markers: '#map-markers .marker'
});
```

You can also set the marker selector with a `data-markers` attribute:

```html
<div class="map" data-markers="#map-markers .marker"></div>
```

>   If you set a `data-markers` attribute, but also an array in javascript, the array will be ignored.

The HTML marker elements could look like this minimal setup:

```html
<ul id="map-markers">
    <li class="marker" data-lat="51.251245" data-lng="4.497890">Marker A</li>
    <li class="marker" data-lat="50.963258" data-lng="3.706874">Marker B</li>
</ul>
```

>   You can use any HTML structure, it doesn't have to be a `ul`. Just make sure the selector matches and your markers have the necessary data attributes.

## Fit Markers on the Map

### Fit All Markers on the Map

**Default:** `false` if only 1 marker, `true` if more than 1 marker

Most likely you will want all of your markers to show up on the map initially. So if you add more than one marker, the `fitbounds` option is set to `true` by default. This will override any zoom level and center position you have set. If you do want to take control over this yourself, you can set `fitbounds` to `false`.

With javascript:

```javascript
$('.map').mapify({
    fitbounds: false
});
```

With a data attribute:

```html
<div class="map" data-fitbounds="false"></div>
```

If you only have one marker, the map will be zoomed and centered on that marker. See below for more information about those settings.

### Fit Specific Markers on the Map

**Default:** `true` for all markers

If you only want to zoom in on a few important markers initially, you can add a `fitbounds` option only to those markers. You don't have to disable `fitbounds` on the map, this is done automatically when the option is detected on a marker.

With javascript:

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890, fitbounds: true },
        { lat: 50.963258, lng: 3.706874, fitbounds: true }
    ]
});
```

With a data attribute:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-fitbounds="true">
        Marker A
    </li>
    <li class="marker"
        data-lat="50.963258"
        data-lng="3.706874"
        data-fitbounds="true">
        Marker B
    </li>
</ul>
````

>   **Note from Google Maps Reference:** When the map is set to `display: none`, the `fitBounds` function reads the map's size as 0x0, and therefore does not do anything. To change the viewport while the map is hidden, set the map to `visibility: hidden`, thereby ensuring the map div has an actual size.

### Fit Markers on the Map with Extra Padding

**Default:** `50`

The `fitboundsPadding` option is not well documented by Google, but after some experimenting it seems to work as follows… You set a pixel value that adds a "padding zone" to the map's boundaries. Google Maps will keep zooming in until one of your markers gets within the padding zone. This option can only be set on the map, as it doesn't make sense to set in on multiple markers.

With javascript:

```javascript
$('.map').mapify({
    fitbounds: true,
    fitboundsPadding: 50
});
```

With a data attribute:

```html
<div class="map" data-fitbounds="true" data-fitbounds-padding="50"></div>
```

## Marker Clustering

**Default:** `true` up to a zoom level of `15`

When 2 or more markers are too close and would overlap, those markers will be replaced by a new cluster icon, showing how many markers there are in that area. Clicking the cluster will zoom in and fit its markers on the map.

>   Marker clustering will only work when [`markerclusterer.js`](https://github.com/googlemaps/v3-utility-library/blob/master/markerclusterer/src/markerclusterer.js) is loaded. This script is already included in `mapify.min.js`.

If you don't want marker clustering, you can disable it.

With javascript:

```javascript
$('.map').mapify({
    clusters: false
});
```

With a data attribute:

```html
<div class="map" data-clusters="false"></div>
```

### Cluster Options

You can set a number of cluster options **on the map**, with javascript or HTML data attributes.

#### Browser Tooltip

**Default:** `''` (no tooltip)

Show a default browser tooltip when hovering over a cluster icon.

- `clusterTitle: 'Click to see markers!'` **(JavaScript)**
- `data-cluster-title="Click to see markers!"` **(HTML)**

#### Center Cluster Icon

**Default:** `true`

Position the cluster icon in the center of its markers if set to `true`, or on top of the first marker if set to `false`.

- `clusterCenter: true` **(JavaScript)**
- `data-cluster-center="true"` **(HTML)**

#### Cluster Grid Size

**Default:** `40`

How close markers need to be to eachother before being clustered. The lower the value, the closer the markers need to be.

- `clusterGridSize: 40` **(JavaScript)**
- `data-cluster-grid-size="40"` **(HTML)**

#### Cluster Min Size

**Default:** `2`

The minimum number of markers that should be clustered.

- `clusterMinSize: 2` **(JavaScript)**
- `data-cluster-min-size="2"` **(HTML)**

#### Cluster Max Zoom

**Default:** `15` (street level)

The maximum zoom level that markers will be clustered.

- `clusterMaxZoom: 15` **(JavaScript)**
- `data-cluster-max-zoom="15"` **(HTML)**

#### Cluster Zoom on Click

**Default:** `true`

When you click on a cluster icon, zoom in to fit the cluster's markers on the map.

-   `clusterZoomOnClick: true` **(JavaScript)**

-   `data-cluster-zoom-on-click="true"` **(HTML)**

#### Enable Cluster Retina Icons

**Default:** `true`

Enable the use of retina images as a cluster icon.

- `clusterRetina: true` **(JavaScript)**
- `data-cluster-retina="true"` **(HTML)**

If this is `true`, sprites cannot be used as cluster icons (advanced).

### Cluster Icons

#### Change Icon

**Default:** `/images/cluster.png`

You can change the default cluster icon by setting a few basic options.

- `clusterIcon: 'path/to/icon.png'` **(JavaScript)**
- `data-cluster-icon="path/to/icon.png"` **(HTML)**

#### Set Correct Icon Size

**Default:** `'50,50'`

The default width and height is `50` pixels. You must either save your image in that size, or specify the correct actual width and height of your image. If the sizes don't match, the text inside the cluster will not be positioned correctly. The option expects a value of `'width,height'.

- `clusterIconSize: '50,50'` **(JavaScript)**
- `data-cluster-icon-size="50,50"` **(HTML)**

#### Icon Text Color

**Default:** `'#ffffff'`

- `clusterTextColor: '#ffffff'` **(JavaScript)**
- `data-cluster-text-color="#ffffff"` **(HTML)**

#### Icon Text Size:

**Default:** `12`

- `clusterTextSize: 12` **(JavaScript)**
- `data-cluster-text-size="12"` **(HTML)**

#### Multiple / Advanced Cluster Icons

If you set the `clusterIcons` option, you override the basic icon options with advanced settings. The option expects an array of [`ClusterIconStyle`](http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html) objects. This also allows you to define multiple cluster icons. This can only be set via javascript.

For example:

```javascript
$('.map').mapify({
    clusterIcons: [
        {
            // Required:
            width: 50, //=> actual image width !!!
            height: 50, //=> actual image height !!!
            url: 'path/to/icon.png',
            // Optional:
            backgroundPosition: '0, 0', //=> 'X, Y' (mind the space!)
            anchorIcon: [25, 25], //=> [Y,X] (defauls to center of the icon)
            anchorText: [0, 0], //=> [Y,X] (from the center of the icon)
            textColor: '#000000',
            textSize: 11,
            textDecoration: 'none',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'normal',
            fontWeight: 'bold'
        },
        {
          	...
        }
    ]
});
```

With the `clusterCalculator` function (see below) you can choose to show specific icons based on the markers and the number of available icons.

#### Dynamic Cluster Text, Tooltip and Icon

Using the `clusterCalculator` function, you can choose what text to display inside of the icon, what tooltip (title) to show on hover and which icon from the `clusterIcons` array to show, based on the cluster's markers and the number of available icons.

```javascript
$('.map').mapify({
    clusterCalculator: function (markers, totalAvailableIcons) {
        var index = 0,
            title = '',
            count = markers.length.toString();

        // Your logic here...
        
        return {
            text: count,
            index: index,
            title: title
    	};
    }
});
```

This is the default function, taken from [markerclusterer.js](https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/src/markerclusterer.js), which will show the next icon in the array for every ten markers in the cluster:

```javascript
function (markers, totalAvailableIcons) {
    var index = 0,
        title = '',
        count = markers.length.toString(),
        dv = count;

    while (dv !== 0) {
        dv = parseInt(dv / 10, 10);
        index++;
    }

    index = Math.min(index, totalAvailableIcons);

    return {
        text: count,
        index: index,
        title: title
    };
}
```

## Other Options

### Map Center Position

**Default:** first marker's position

When the `fitbounds` option is set to `false`, the map will be centered on on the first (or only) marker's `lat` and `lng` coordinates by default.

You can override the default center point in a few ways.

#### By defining an explicit center position...

With javascript options:

```javascript
$('.map').mapify({
    lat: 51.251245,
    lng: 4.497890,
    centerLat: 50.963258,
    centerLng: 3.706874
});
```

Or with data attributes to the map

```html
<div class="map"
     data-lat="51.251245"
     data-lng="4.497890"
     data-center-lat="50.963258"
     data-center-lng="3.706874">
</div>
```

>   If you don't have any markers on your map, you **need** to define a center position for the map to load.
>   The data attributes will take precedence over the javascript options.

#### By using a marker as the center position...

Once again you can do this with javascript:

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890 },
        { lat: 50.963258, lng: 3.706874, center: true }
    ]
});
```

Or by adding a `data-center` attribute to a marker element:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890">
        Marker A
    </li>
    <li class="marker"
        data-lat="50.963258"
        data-lng="3.706874"
        data-center="true">
        Marker B
    </li>
</ul>
````

>   If you set a marker as the center point, this will take precedence over any other configuration.
>   If you set multiple markers as center, the last one will be used.

### Zoom Level

**Default:** `15`

The initial zoom level can be set to a value between 1 and 20, where 1 is the most zoomed out. This option has no effect while the `fitbounds` option is set to `true`.

- 1: World
- 5: Landmass/continent
- 10: City
- 15: Streets
- 20: Buildings

With javascript:

```javascript
$('.map').mapify({
    zoom: 8
});
```

With a data attribute:

```html
<div class="map" data-zoom="8"></div>
```

### Zoom on Scroll

**Default:** `false`

To enable zooming with the scrollwheel of the mouse, set the `scrollwheel` option to `true`.

With javascript:

```javascript
$('.map').mapify({
    scrollwheel: true
});
```

With a data attribute:

```html
<div class="map" data-scrollwheel="true"></div>
```

### Custom Marker Icons

**Default:** standard Google icons

To use a custom image as a marker, set one or more of the following options:

```javascript
$('.map').mapify({
    icon: 'path/to/marker.png',
    iconSize: '40,40',
    iconOrigin: '0,0',
    iconAnchor: '0,40'
});
```

Or use the data attributes:

```html
<div class="map"
     data-icon="path/to/marker.png"
     data-icon-size="40,40"
     data-icon-origin="0,0"
     data-icon-anchor="0,40">
</div>
```

The `size`, `origin` and `anchor` are optional. All three expect two numbers, separated by a comma, representing `x` and `y` coordinates relative to the icon. An origin of `0,0` means the top left corner of the icon. An anchor (where it "points") of `0,40` means the bottom left corner in the example.

You can further override the icon settings per marker by defining the same options on a marker.

On a marker object:

```javascript
$('.map').mapify({
    markers: [
        {
        	lat: 51.251245,
            lng: 4.497890,
            icon: 'path/to/marker.png',
            iconSize: '40,40',
            iconOrigin: '0,0',
            iconAnchor: '0,40'
        }
    ]
});
```

On a marker element:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-icon="path/to/marker.png"
        data-icon-size="40,40"
        data-icon-origin="0,0"
        data-icon-anchor="0,40">
        Marker A
    </li>
</ul>
````

### Marker Label and Title

**Default:** none

The label is some text that is shown on a marker image. The title is a small tooltip that appears when you hover over a marker and is basically the same as a normal `title` HTML attribute.

You can set it on the marker object:

```javascript
$('.map').mapify({
    markers: [
        {
        	lat: 51.251245,
            lng: 4.497890,
            label: 'A',
            title: 'Some more information...'
        }
    ]
});
```

Or on the marker element:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-label="A"
        data-titla="Some more information...">
        Marker A
    </li>
</ul>
````

### Custom Map Styles

An easy way to make a map blend in with the rest of your website is to create or find a theme or custom styles. One great resource for premade Google Maps themes is [SnazzyMaps](https://snazzymaps.com/). Applying one is also easy: open a theme, copy its "javascript style array" and set it as the value of the `styles` option.

Note that for satellite/hybrid and terrain modes, these styles will only apply to labels and geometry.

This option can only be set via javascript.

```javascript
$('.map').mapify({
    styles: /* styles array here */
});
```
