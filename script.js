function loadHTML(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}

// Load header and footer
loadHTML('header', 'header.html');
loadHTML('footer', 'footer.html');


//load the map
require([
    "esri/Map",
    "esri/views/MapView"
], function(Map, MapView) {

    // Create the map
    const map = new Map({
        basemap: "streets-navigation-vector" // choose a basemap
    });

    // Create the view
    const view = new MapView({
        container: "map",      // Div ID
        map: map,
        center: [21.43, 41.998], // Skopje coordinates [longitude, latitude]
        zoom: 12
    });

});

