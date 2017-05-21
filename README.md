# Mapify - Google Maps jQuery Plugin

[![npm](https://img.shields.io/npm/v/codezero-mapify.svg)](https://www.npmjs.com/package/codezero-mapify)
[![npm](https://img.shields.io/npm/dt/codezero-mapify.svg)](https://www.npmjs.com/package/codezero-mapify)
[![npm](https://img.shields.io/npm/l/codezero-mapify.svg)](https://www.npmjs.com/package/codezero-mapify)

## Contents

- [Third Party Libraries](#third-party-libraries)
- [Installation](#installation)
- [The Big Picture](#the-big-picture)
- [Creating a Map](#creating-a-map)
    - [Map with a Single Marker](#map-with-a-single-marker)
    - [Map with Multiple Markers](#map-with-multiple-markers)
- [Basic Options](#basic-options)
    - [Map Center Position](#map-center-position)
    - [Gesture Handling](#gesture-handling)
    - [Zoom Level](#zoom-level)
    - [Zoom on Scroll](#zoom-on-scroll)
    - [Map Background Color](#map-background-color)
    - [Map Types](#map-types)
    - [Map Controls](#map-controls)
    - [Map Control Positioning](#map-control-positioning)
    - [Custom Map Styles](#custom-map-styles)
    - [Custom Marker Icons](#custom-marker-icons)
        - [Custom Default Icon](#custom-default-icon)
        - [Custom Icon on Marker Hover](#custom-icon-on-marker-hover)
        - [Custom Icon when Info Window is Open](#custom-icon-when-info-window-is-open)
    - [Marker Label and Title](#marker-label-and-title)
- [Fit Markers on the Map](#fit-markers-on-the-map)
    - [Fit All Markers on the Map](#fit-all-markers-on-the-map)
    - [Fit Specific Markers on the Map](#fit-specific-markers-on-the-map)
    - [Fit Markers on the Map with Extra Padding](#fit-markers-on-the-map-with-extra-padding)
- [Marker Clustering](#marker-clustering)
- [Cluster Options](#cluster-options)
    - [Cluster Tooltip](#cluster-tooltip)
    - [Center Cluster Icon](#center-cluster-icon)
    - [Cluster Grid Size](#cluster-grid-size)
    - [Cluster Min Size](#cluster-min-size)
    - [Cluster Max Zoom](#cluster-max-zoom)
    - [Cluster Zoom on Click](#cluster-zoom-on-click)
    - [Cluster Retina Icons](#cluster-retina-icons)
    - [Cluster Icon](#cluster-icon)
    - [Cluster Icon Size](#cluster-icon-size)
    - [Cluster Icon Text Color](#cluster-icon-text-color)
    - [Cluster Icon Text Size](#cluster-icon-text-size)
    - [Multiple / Advanced Cluster Icons](#multiple-advanced-cluster-icons)
    - [Dynamic Cluster Text, Tooltip and Icon](#dynamic-cluster-text-tooltip-and-icon)
- [Marker Spiderfier](#marker-spiderfier)
- [Spiderfy Options](#spiderfy-options)
    - [Trigger Marker Click Event when Spiderfying](#trigger-marker-click-event-when-spiderfying)
    - [Spider Leg Colors](#spider-leg-colors)
    - [Advanced Spiderfier Options](#advanced-spiderfier-options)
- [Auto Pan to Marker with its HTML Element](#auto-pan-to-marker-with-its-html-element)
- [Add Class to Marker Element on Hover](#add-class-to-marker-element-on-hover)
- [Add Class to Marker Element when Info Window is Open](#add-class-to-marker-element-when-info-window-is-open)
- [Info Window](#info-window)
    - [Inline Info Window](#inline-info-window)
    - [Info Window via Selector](#info-window-via-selector)
    - [Automatically Detect Info Window](#automatically-detect-info-window)
    - [Single Info Window on the Map](#single-info-window-on-the-map)
- [Info Window Options](#info-window-options)
    - [Info Window Max Width](#info-window-max-width)
    - [Info Window Groups](#info-window-groups)
    - [Open Info Window on Load](#open-info-window-on-load)
    - [Open Info Window on Click or Hover (Marker Object)](#open-info-window-on-click-or-hover-marker-object)
    - [Open Info Window on Click or Hover (Marker Element)](#open-info-window-on-click-or-hover-marker-element)
    - [Close Info Windows on Map Click](#close-info-windows-on-map-click)
- [Events](#events)
- [Development](#development)
- [Changelog](#changelog)
- [License](#licemse)

## Third Party Libraries

This plugin requires a few 3rd party libraries to fully function.

- [jQuery](https://jquery.com/)
- [Google Maps API](https://developers.google.com/maps/)

The following packages are compiled into the main plugin version (`mapify.min.js`),
but if you want you can download the scripts manually and use the core plugin version (`mapify.core.min.js`) instead.

- [Google Maps MarkerClustererPlus](http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html)
- [OverlappingMarkerSpiderfier](https://github.com/jawj/OverlappingMarkerSpiderfier)

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

You probably want to [create an API key](https://developers.google.com/maps/documentation/javascript/get-api-key) to work with the Google Maps API. You can use the API without a key, but there will be a warning in the console window and I don't know what restrictions apply.

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

>   The `initMap` function will be called when the Google Maps script is loaded.

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

## Creating a Map

### Map with a Single Marker

If you only need to show one marker on a map, it couldn't be simpler:

```html
<div class="map"></div>

<script>
    $('.map').mapify({
        lat: 51.251245,
        lng: 4.497890
    });
</script>
```

This will add a default marker on the `lat` and `lng` coordinates and center the map there.

This is the equivalent of doing:

```html
<div class="map" data-lat="51.251245" data-lng="4.497890"></div>

<script>
    $('.map').mapify();
</script>
```

>   The values of the data attributes will always take precedence over the javascript options!

### Map with Multiple Markers

Creating a map with multiple markers is basically the same as the previous example, except that you omit the `lat` and `lng` options and instead use marker objects or elements.

You can add marker objects with a javascript array:

```html
<div class="map"></div>

<script>
    $('.map').mapify({
        markers: [
            { lat: 51.251245, lng: 4.497890 },
            { lat: 50.963258, lng: 3.706874 }
        ]
    });
</script>
```

Or you can refer to HTML elements using any selector you want:

```html
<div class="map"></div>

<script>
    $('.map').mapify({
        markers: '#map-markers .marker'
    });
</script>
```

You can also set the marker selector with a `data-markers` attribute:

```html
<div class="map" data-markers="#map-markers .marker"></div>

<script>
    $('.map').mapify();
</script>
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

## Basic Options

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

### Gesture Handling

**Default:** `'cooperative'`

Straight from the Google Maps documentation:

`'none'`: The map cannot be panned or zoomed by user gestures.

`'greedy'`: All touch gestures pan or zoom the map.

`'cooperative'`: Two-finger touch gestures pan and zoom the map. One-finger touch gestures are not handled by the map. In this mode, the map cooperates with the page, so that one-finger touch gestures can pan the page.

`'auto'`: Gesture handling is either cooperative or greedy, depending on whether the page is scrollable or not.

Set one of the above values with javascript:

```javascript
$('.map').mapify({
    gestures: 'cooperative'
});
```

Or with a data attribute:

```html
<div class="map" data-gestures="cooperative"></div>
```

### Zoom Level

**Default:** `15`

The initial zoom level can be set to a value between 1 and 20, where 1 is the most zoomed out.
This option has no effect while the `fitbounds` option is set to `true` (see: [Fit Markers on the Map](#fit-markers-on-the-map)).

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

### Map Background Color

**Default:** `'#ffffff'`

The background color of the map that is visible when map tiles are not yet loaded.

Set it via javascript:

```javascript
$('.map').mapify({
    backgroundColor: '#ffffff'
});
```

Or with a data attribute:

````html
<div class="map" data-background-color="#ffffff"></div>
````

### Map Types

**Default:** `'roadmap'`

The available map types you want the user to be able to switch between.
This can be a comma separated string or an array.
The first type is the initial map type to show.
If you only set one type, the UI control will be hidden.

Available map types:

- `'roadmap'`
- `'terrain'`
- `'satellite'`
- `'hybrid'`

Set it via javascript:

```javascript
$('.map').mapify({
    mapTypes: ['roadmap', 'satellite']
});
```

Or with a data attribute:

````html
<div class="map" data-map-types="roadmap,satellite"></div>
````

### Map Controls

**Default:** `'zoom'`

The UI controls you want to enable. This can be a comma separated string or an array.
If you want to disable all controls, set an empty string or array or just `'none'` as the value.

> **Note:** The `mapTypeControl` is enabled automatically if you set more than one value in the `mapTypes` option.

Available controls:

- `'zoom'`
- `'fullscreen'`
- `'streetview'`
- `'rotate'`
- `'scale'`

Set it via javascript:

```javascript
$('.map').mapify({
    controls: ['zoom', 'fullscreen']
});
```

Or with a data attribute:

````html
<div class="map" data-controls="zoom,fullscreen"></div>
````

### Map Control Positioning

You can change the default position of the following controls on the map. (the shown values are the defaults)

Possible values: (see [Google Maps reference](https://developers.google.com/maps/documentation/javascript/reference#ControlPosition)

- `'BOTTOM_CENTER'`
- `'BOTTOM_LEFT'`
- `'BOTTOM_RIGHT'`
- `'LEFT_BOTTOM'`
- `'LEFT_CENTER'`
- `'LEFT_TOP'`
- `'RIGHT_BOTTOM'`
- `'RIGHT_CENTER'`
- `'RIGHT_TOP'`
- `'TOP_CENTER'`
- `'TOP_LEFT'`
- `'TOP_RIGHT'`

Via javascript:

```javascript
$('.map').mapify({
    mapTypeControlPosition: 'TOP_LEFT',
    zoomControlPosition: 'RIGHT_BOTTOM',
    fullscreenControlPosition: 'TOP_RIGHT',
    streetviewControlPosition: 'RIGHT_BOTTOM',
    rotateControlPosition: 'RIGHT_BOTTOM'
});
```

Or with data attributes:

````html
<div class="map"
    data-map-type-control-positiom="TOP_LEFT"
    data-zoom-control-positiom="RIGHT_BOTTOM"
    data-fullscreen-control-positiom="TOP_RIGHT"
    data-streetview-control-positiom="RIGHT_BOTTOM"
    data-rotate-control-positiom="RIGHT_BOTTOM">
</div>
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

### Custom Marker Icons

**Default:** standard Google icons

#### Custom Default Icon

To use a custom image as a marker, set one or more of the following options:

```javascript
$('.map').mapify({
    icon: '/path/to/marker.png',
    iconSize: '40,40',
    iconOrigin: '0,0',
    iconAnchor: '0,40'
});
```

Or use the data attributes:

```html
<div class="map"
     data-icon="/path/to/marker.png"
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
            icon: '/path/to/marker.png',
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
        data-icon="/path/to/marker.png"
        data-icon-size="40,40"
        data-icon-origin="0,0"
        data-icon-anchor="0,40">
        Marker A
    </li>
</ul>
````

#### Custom Icon on Marker Hover

You can specify a different marker icon to show when you hover over a marker on the map, or over a marker HTML element.
The idea is identical to the the previous examples, but you use the following options instead.

If you don't specify the size, origin or anchor, the default (custom) icon settings will be used.

In javascript:

```
iconHover: '/path/to/marker.png',
iconHoverSize: '40,40',
iconHoverOrigin: '0,0',
iconHoverAnchor: '0,40'
```

Or use the data attributes:

```
data-icon-hover="/path/to/marker.png"
data-icon-hover-size="40,40"
data-icon-hover-origin="0,0"
data-icon-hover-anchor="0,40">
```

#### Custom Icon when Info Window is Open

And another icon can be used when a marker's info window is open.

If you don't specify the size, origin or anchor, the default (custom) icon settings will be used.

In javascript:

```
iconOpen: '/path/to/marker.png',
iconOpenSize: '40,40',
iconOpenOrigin: '0,0',
iconOpenAnchor: '0,40'
```

Or use the data attributes:

```
data-icon-open="/path/to/marker.png"
data-icon-open-size="40,40"
data-icon-open-origin="0,0"
data-icon-open-anchor="0,40">
```

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

>   Marker clustering will only work when [`markerclusterer.js`](https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/src/markerclusterer.js) is loaded. This script is already included in `mapify.min.js`.

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

By default, when marker clustering doesn't apply (beyond the maximum zoom level or when disabled), overlapping markers will be [spiderfied](#marker-spiderfier) instead. 

## Cluster Options

You can set a number of cluster options **on the map**, with javascript or HTML data attributes.

### Cluster Tooltip

**Default:** `''` (no tooltip)

Show a default browser tooltip when hovering over a cluster icon.

- `clusterTitle: 'Click to see markers!'` **(JavaScript)**
- `data-cluster-title="Click to see markers!"` **(HTML)**

### Center Cluster Icon

**Default:** `true`

Position the cluster icon in the center of its markers if set to `true`, or on top of the first marker if set to `false`.

- `clusterCenter: true` **(JavaScript)**
- `data-cluster-center="true"` **(HTML)**

### Cluster Grid Size

**Default:** `40`

How close markers need to be to eachother before being clustered. The lower the value, the closer the markers need to be.

- `clusterGridSize: 40` **(JavaScript)**
- `data-cluster-grid-size="40"` **(HTML)**

### Cluster Min Size

**Default:** `2`

The minimum number of markers that should be clustered.

- `clusterMinSize: 2` **(JavaScript)**
- `data-cluster-min-size="2"` **(HTML)**

### Cluster Max Zoom

**Default:** `15` (street level)

The maximum zoom level that markers will be clustered.

- `clusterMaxZoom: 15` **(JavaScript)**
- `data-cluster-max-zoom="15"` **(HTML)**

### Cluster Zoom on Click

**Default:** `true`

When you click on a cluster icon, zoom in to fit the cluster's markers on the map.

-   `clusterZoomOnClick: true` **(JavaScript)**

-   `data-cluster-zoom-on-click="true"` **(HTML)**

### Cluster Retina Icons

**Default:** `true`

Enable the use of retina images as a cluster icon.

- `clusterRetina: true` **(JavaScript)**
- `data-cluster-retina="true"` **(HTML)**

If this is `true`, sprites cannot be used as cluster icons (advanced).

### Cluster Icon

**Default:** `/images/cluster.png`

You can change the default cluster icon by setting a few basic options.

- `clusterIcon: '/path/to/icon.png'` **(JavaScript)**
- `data-cluster-icon="/path/to/icon.png"` **(HTML)**

### Cluster Icon Size

**Default:** `'50,50'`

The default width and height is `50` pixels. You must either save your image in that size, or specify the correct actual width and height of your image. The option expects a value of `'width,height'.

- `clusterIconSize: '50,50'` **(JavaScript)**
- `data-cluster-icon-size="50,50"` **(HTML)**

> **Important Note!** If the sizes don't match the actual image sizes, the text inside the cluster will not be positioned correctly.

### Cluster Icon Text Color

**Default:** `'#ffffff'`

- `clusterTextColor: '#ffffff'` **(JavaScript)**
- `data-cluster-text-color="#ffffff"` **(HTML)**

### Cluster Icon Text Size:

**Default:** `12`

- `clusterTextSize: 12` **(JavaScript)**
- `data-cluster-text-size="12"` **(HTML)**

### Multiple / Advanced Cluster Icons

If you set the `clusterIcons` option, you override the basic icon options with advanced settings. The option expects an array of [`ClusterIconStyle`](http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html) objects. This also allows you to define multiple cluster icons. This can only be set via javascript.

For example:

```javascript
$('.map').mapify({
    clusterIcons: [
        {
            // Required:
            width: 50, //=> actual image width !!!
            height: 50, //=> actual image height !!!
            url: '/path/to/icon.png',
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

### Dynamic Cluster Text, Tooltip and Icon

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

## Marker Spiderfier

**Default:** `true`

By default, when the map is zoomed in to street level (15), markers that are too close to each other will no longer be clustered.
Instead, the markers will be spiderfied. This will move the markers away from each other in a circular path so they can be clicked easily. 

>   The Marker Spiderfier will only work when [OverlappingMarkerSpiderfier](https://github.com/jawj/OverlappingMarkerSpiderfier) is loaded. This script is already included in `mapify.min.js`.

If you don't want to spiderfy markers, you can disable it.

With javascript:

```javascript
$('.map').mapify({
    spiderfy: false
});
```

With a data attribute:

```html
<div class="map" data-spiderfy="false"></div>
```

## Spiderfy Options

You can set a number of spiderfy options **on the map**, with javascript or HTML data attributes.

### Trigger Marker Click Event when Spiderfying

**Default:** `true`

Trigger the click event on a marker even when it (un)spiderfies nearby markers.

- `spiderClick: true` **(JavaScript)**
- `data-spider-click="true"` **(HTML)**

### Spider Leg Colors

These options can only be set via javascript, as it would get a bit ugly with data attributes.

Here are the default settings... You can also add custom map types.

```javascript
$('.map').mapify({
    spiderLegColors: {
        roadmap: '#444',
        terrain: '#444',
        satellite: '#fff',
        hybrid: '#fff'
    },
    spiderLegColorsHighlighted: {
        roadmap: '#f00',
        terrain: '#f00',
        satellite: '#f00',
        hybrid: '#f00'
    }
});
```

## Advanced Spiderfier Options

There are some advanced options for the Spiderfier that you can set via javascript.
This options accepts any constructor option from [OverlappingMarkerSpiderfier](https://github.com/jawj/OverlappingMarkerSpiderfier#construction).

Your options will be merged with these defaults:

```javascript
$('.map').mapify({
    spiderfierOptions: {
        markersWontMove: true, //=> set true for performance if markers will not be moved
        markersWontHide: false, //=> set true for performance if markers will not be hidden
        keepSpiderfied: true, //=> keep spider open when one of its markers is clicked
        ignoreMapClick: false, //=> keep spider open when the map is clicked
        nearbyDistance: 20,
        circleSpiralSwitchover: 9,
        legWeight: 2,
    
        // With the "onSpiderMarkerFormat" event handler you can manipulate
        // the marker based on its spider state (spiderfied/unspiderfied/...).
        //
        // Set this option to true if you only need to detect
        // the "SPIDERFIED" and (initial) "UNSPIDERFIED" state changes.
        // This will trigger the event on each affected marker when
        // it is spiderfied and unspiderfied.
        //
        // Set this option to false if you need to detect
        // the "SPIDERFIED", "SPIDERFIABLE" and "UNSPIDERFIABLE" states.
        // This will **additionally** trigger the event on every marker
        // when the map loads and zoom level changes.
        // So setting this option to true is a performance boost!
        basicFormatEvents: true
    }
});
```

## Auto Pan to Marker with its HTML Element

**Default:** `false`

If you create marker HTML elements, you can automatically pan and zoom to the related marker on the map when you click on or hover over the element.
When enabled, the marker will be centered on the map and if the marker is clustered, the map will zoom in until it is unclustered.

This behavior is disabled by default, but you can configure this on the map, using these possible values..

Pan to marker only if it is clustered or outside the map's boundaries:

- `click`
- `hover`

Pan to marker even if it's within the map's boundaries:

- `'hover-always'`
- `'click-always'`

Disable panning (default):

-  `false`

With javascript:

```javascript
$('.map').mapify({
    panToMarker: 'click'
});
```

With a data attribute:

```html
<div class="map" data-pan-to-marker="click"></div>
```

> This option can be used in combination with opening an info window.
> See: [Open Info Window on Click or Hover (Marker Element)](#open-info-window-on-click-or-hover-marker-element).

## Add Class to Marker Element on Hover

**Default:** `null`

When you create marker HTML elements, a class can be added whenever you hover over such an element or its related marker on the map.

You set this option on the map. This is disabled by default.

With javascript:

```javascript
$('.map').mapify({
    hoverClass: 'marker-hover'
});
```

With a data attribute:

```html
<div class="map" data-hover-class="marker-hover"></div>
```

## Add Class to Marker Element when Info Window is Open

**Default:** `null`

If you create marker HTML elements with info windows, a class can be added to the marker element when its info window is opened on the map.

You set this option on the map. This is disabled by default.

With javascript:

```javascript
$('.map').mapify({
    openClass: 'marker-open'
});
```

With a data attribute:

```html
<div class="map" data-open-class="marker-open"></div>
```

## Info Window

**Default:** none

You can display some text or HTML content in a dedicated info window, that pops open when you click on a marker.

### Inline Info Window

Probably the least attractive method is to write the HTML in a javascript string.
The entire HTML string will be the value of the info window.
An empty string will be ignored.

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890, infoWindow: '<p>INFO</p>' }
    ]
});
```

You can't really write HTML in a data attribute, but you could get away with some simple text...
Do note that strings starting with a `.` or `#` are handled as [selectors](#info-window-via-selector). 
As usual, the data attribute will override the javascript setting.

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-info-window="Very basic info...">
        Marker A
    </li>
</ul>
````

### Info Window via Selector

A slightly better approach is to create any `<div>` on your page and pass it with a selector.
If you don't want to show the info window on the page, simply hide it with CSS `display: none`.
The **contents** of the `<div>` will be used as the value for the info window.
A non-existent selector will be ignored, as long as it starts with a `.` or `#`.

````html
<div id="my-info-window">
    <p>INFO</p>
</div>
````

Via javascript:

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890, infoWindow: '#my-info-window' }
    ]
});
```

Or via a data attribute:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-info-window="#my-info-window">
        Marker A
    </li>
</ul>
````

### Automatically Detect Info Window

The easiest way to create your info window is to add an element inside of your `.marker` and give it the `info-window` class.
The **contents** of the `<div>` will be used as the value for the info window.
You can hide the element with CSS `display: none` if you don't want to show it on your page.

We only check for this element when the previous options fail.

````html
<ul id="map-markers">
    <li class="marker" data-lat="51.251245" data-lng="4.497890">
        Marker A
        <div class="info-window">
            <p>My info window!</p>
        </div>
    </li>
</ul>
````

You can change the default selector of the child info window element via javascript.
We will try to `.find()` this selector under the marker element.

```javascript
$('.map').mapify({
    infoWindowChildSelector: '.info-window'
});
```

### Single Info Window on the Map

If you have set only one `lat` and `lng` on the map and you are not using multiple markers, you can also add the `infoWindow` option to it.

With javascript:

```javascript
$('.map').mapify({
    lat: 51.251245,
    lng: 4.497890,
    infoWindow: '#my-info-window'
});
```

With a data attribute:

```html
<div class="map" data-lat="51.251245" data-lng="4.497890" data-info-window="#my-info-window"></div>
```

## Info Window Options

### Info Window Max Width

**Default:** `null` (Google Maps default)

You can set a default info window max width in pixels on the map.

With javascript:

```javascript
$('.map').mapify({
    infoWindowMaxWidth: 300
});
```

With a data attribute:

```html
<div class="map" data-info-window-max-width="300"></div>
```

Furthermore, you can set a max width on a specific marker. This will override the default.

Via javascript:

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890, infoWindowMaxWidth: 300 }
    ]
});
```

Or via a data attribute:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-info-window-max-width="300">
        Marker A
    </li>
</ul>
````

### Info Window Groups

**Default:** `'default'`

Creating a separate info window for many markers will degrade performance.
So by default we reuse a single info window instance.
This means you can only have one window open at the same time.

If you do need to open multiple info windows, you can assign each marker a unique info window group name.

Via javascript:

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890, infoWindowGroup: 'some-group' }
    ]
});
```

Or via a data attribute:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-info-window-group="some-group">
        Marker A
    </li>
</ul>
````

### Open Info Window on Load

**Default:** `false`

If you want to open an info window automatically when the page loads, you can add the `infoWindowOpen` option to its marker.
Note that only one info window can be open at the same time per info window group.

If you set this option on more than one info window in the same group, only the first one will be opened. 

If the marker is clustered and thus hidden, the info window will pop up when you uncluster the marker by clicking on the cluster icon.

```javascript
$('.map').mapify({
    markers: [
        { lat: 51.251245, lng: 4.497890, infoWindowOpen: true }
    ]
});
```

Or via a data attribute:

````html
<ul id="map-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-info-window-open="true">
        Marker A
    </li>
</ul>
````

### Open Info Window on Click or Hover (Marker Object)

**Default:** `'click'`

By default, when you click on a marker, its info window will pop up (if any).
Alternatively, you can choose to show the info window when you hover over a marker instead.

Possible values:

- `'click'`
- `'hover'`

With javascript:

```javascript
$('.map').mapify({
    triggerInfoWindowOnMarker: 'hover'
});
```

With a data attribute:

```html
<div class="map" data-trigger-info-window-on-marker="hover"></div>
```

### Open Info Window on Click or Hover (Marker Element)

**Default:** `false`

If you create marker HTML elements, you can choose to show an info window on the map when you click on the HTML element or hover over it.
If the targeted marker is outside of the map's boundaries, it will be centered on the map.
If it is clustered and thus not actually shown on the map, the map will zoom in until it is unclustered.

> This option ignores the `panToMarker` setting, but you can combine the two.
> For example: you can set `panToMarker` to `hover` and this option to `click`.
> But showing the info window on `hover` and setting `panToMarker` to `click` makes no sense at all.
> In that case you don't need to set the `panToMarker` option at all.

This option is disabled by default, but you can enable it with these possible values:

Pan to marker only if it is clustered or outside the map's boundaries and show the info window:

- `click`
- `hover`

Pan to marker even if it's within the map's boundaries and show the info window:

- `'hover-always'`
- `'click-always'`

Don't show the info window (default):

-  `false`

With javascript:

```javascript
$('.map').mapify({
    triggerInfoWindowOnElement: 'hover'
});
```

With a data attribute:

```html
<div class="map" data-trigger-info-window-on-element="hover"></div>
```

### Close Info Windows on Map Click

**Default:** `true`

By default, when you click anywhere on the map, all info windows will be closed.
You can disable this by setting this option to `false`.
There can still only be one info window open per info window group.

With javascript:

```javascript
$('.map').mapify({
    closeInfoWindowsOnMapClick: false
});
```

With a data attribute:

```html
<div class="map" data-close-info-windows-on-map-click="false"></div>
```

> I know... this data attribute is getting out of hand... :) But I can't shorten it AND keep it descriptive... Luckily the javascript version looks cleaner!

## Events

If you need to run some extra logic when certain events occur, you can add the following callback options...
Each callback receives a few variables with map and marker details, depending on the event.

#### An overview of all possible arguments:

Argument | Description
---------|------------
`map` | The Google Maps `Map` instance
`markers` | Array of all `Marker` instances on the map
`marker` | `Marker` instance (relevant to the event)
`clusterer` | `MarkerClusterer` instance
`cluster` | `Cluster` instance (relevant to the event)
`clusterMarkers` | Array of `Marker` instances in a cluster (relevant to the event)
`spiderfier` | `OverlappingMarkerSpiderfier` instance
`markerStatus` | Spiderfier marker status
`event` | Original event

#### You can also get to the map or marker HTML element (if any) very easily:

`map.$map`: the map div

`marker.$marker`: the marker HTML element, if you created it

#### These are the events you can interact with:

Event                     | Parameters
--------------------------|-----------
onInitialized             | function (map, markers, clusterer, spiderfier) { }
onMapClick                | function (map, markers, clusterer, spiderfier, event) { }
onMarkerClick             | function (marker, map, markers, clusterer, spiderfier, event) { }
onMarkerMouseEnter        | function (marker, map, markers, clusterer, spiderfier, event) { }
onMarkerMouseLeave        | function (marker, map, markers, clusterer, spiderfier, event) { }
onMarkerElementClick      | function (marker, map, markers, clusterer, spiderfier, event) { }
onMarkerElementMouseEnter | function (marker, map, markers, clusterer, spiderfier, event) { }
onMarkerElementMouseLeave | function (marker, map, markers, clusterer, spiderfier, event) { }
onClusterClick            | function (clusterMarkers, cluster, map, markers, clusterer, spiderfier) { }
onClusterMouseEnter       | function (clusterMarkers, cluster, map, markers, clusterer, spiderfier) { }
onClusterMouseLeave       | function (clusterMarkers, cluster, map, markers, clusterer, spiderfier) { }
onSpiderMarkerFormat      | function (marker, markerStatus, map, markers, clusterer, spiderfier) { } 

> The `onInitialized` callback is triggered when the map is fully loaded.
If you wish to manipulate the map, markers or anything else in a way that is not supported by the plugin, this might be the place to do it.

## Development
I am using a tool called [Laravel Mix](https://github.com/JeffreyWay/laravel-mix) to compile javascript and SCSS.
Make sure you have the latest version of [NodeJS](https://nodejs.org/en/) installed and then run `npm install`.

- To compile run `npm run dev`.
- To compile and watch for changes run `npm run watch`.
- To compile for production (minify/uglify) run `npm run production`.

## Changelog

View the [changelog](https://github.com/codezero-be/mapify/blob/master/CHANGELOG.md).

## License
The MIT License (MIT). Please see [License File](https://github.com/codezero-be/mapify/blob/master/LICENSE.md) for more information.

---
[![Analytics](https://ga-beacon.appspot.com/UA-58876018-1/codezero-be/mapify)](https://github.com/igrigorik/ga-beacon)
