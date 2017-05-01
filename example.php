<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Google Maps</title>
    <style>
        .map {
            width: 100%;
            height: 250px;
        }
    </style>
</head>
<body>

<h2>Map with a Single Marker</h2>

<div class="map" data-lat="51.251245" data-lng="4.497890"></div>

<h2>Map with Multiple Markers</h2>

<div class="map" data-markers="#map1-markers .marker"></div>

<ul id="map1-markers">
    <li class="marker" data-lat="51.251245" data-lng="4.497890">
        <a href="#">marker</a>
    </li>
    <li class="marker" data-lat="50.963258" data-lng="3.706874" data-center="true">
        <a href="#">marker</a>
    </li>
</ul>

<h2>Map with Options</h2>

<div class="map"
     data-markers="#map2-markers .marker"
     data-zoom="16"
     data-scrollwheel="true"
     data-center-lat="51.251245"
     data-center-lng="4.497890"
     data-icon="marker1.png"
     data-icon-size="40,40"
     data-icon-origin="0,0"
     data-icon-anchor="0,20">
</div>

<ul id="map2-markers">
    <li class="marker"
        data-lat="51.251245"
        data-lng="4.497890"
        data-icon="marker2.png"
        data-label="A"
        data-title="Hello World">
        <a href="#">marker</a>
    </li>
    <li class="marker"
        data-lat="51.172364"
        data-lng="4.336061"
        data-center="true"
        data-label="A"
        data-title="Hello World">
        <a href="#">marker</a>
    </li>
    <li class="marker"
        data-lat="50.421853"
        data-lng="4.445815"
        data-center="true"
        data-label="A"
        data-title="Hello World">
        <a href="#">marker</a>
    </li>
</ul>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="mapify.js"></script>

<script>
    function initMap() {
        $('.map').mapify({
            onMarkerClick: function (marker, map, event) {
                console.log('clicked', marker, map);
            }
        });
    }
</script>

<script src="markerclusterer.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=<?= GOOGLE_API_KEY ?>&callback=initMap" async defer></script>

</body>
</html>
