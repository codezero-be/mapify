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

You will need to [create an API key](https://developers.google.com/maps/documentation/javascript/get-api-key) to work with the Google Maps API.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="mapify.js"></script>

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

## Options

### Map Center Position

By default the map will be centered on on the first (or only) marker's `lat` and `lng` coordinates.

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

The zoom level can be set to a value between 1 and 20, where 1 is the most zoomed out.

- 1: World
- 5: Landmass/continent
- 10: City **( = default)**
- 15: Streets
- 20: Buildings

To enable zooming with the scrollwheel of the mouse, set the `scrollwheel` option to `true`.

With javascript:

```javascript
$('.map').mapify({
    zoom: 8,
    scrollwheel: true
});
```

With a data attribute:

```html
<div class="map" data-zoom="8" data-scrollwheel="true"></div>
```

### Fit Markers in Map

You can automatically zoom the map to bring all or some markers within the map's boundaries.

#### Fit all markers in the map

The `fitboundsPadding` option is not well documented by Google, but after some experimenting with it seems to work as follows… You set a pixel value that adds a "padding zone" to the map's boundaries. Google Maps will keep zooming in until one of your markers gets within the padding zone. The default value is `50`. This option can only be set on the map, as it doesn't make sense to set in on multiple markers.

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

#### Fit specific markers in the map

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

>   By using `fitbounds` you are overriding the `zoom` level and `center` poisition. Those settings will be ignored by Google Maps.

>   **Note from Google Maps Reference:** When the map is set to `display: none`, the `fitBounds` function reads the map's size as 0x0, and therefore does not do anything. To change the viewport while the map is hidden, set the map to `visibility: hidden`, thereby ensuring the map div has an actual size.

### Custom Marker Icons

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
