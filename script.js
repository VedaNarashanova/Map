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




let view;//global promenliva
//load the map ---------------------------------------------------------------------
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",// a layer added to the map that holds points.lines
    "esri/Graphic",
    "esri/widgets/Bookmarks",
    "esri/widgets/Expand",
    "esri/widgets/Compass",
    "esri/widgets/Home",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "esri/widgets/CoordinateConversion",
], function(Map, MapView,GraphicsLayer,Graphic,Bookmarks, Expand,Compass, Home, LayerList,BasemapGallery,CoordinateConversion) {

    // Create the map
    const map = new Map({
        basemap: "streets-navigation-vector" // choose a basemap
    });

    // Create the view
    view = new MapView({
        container: "map",      // Div ID
        map: map,
        center: [21.43, 41.998], // Skopje coordinates [longitude, latitude]
        zoom: 12,
        constraints:{
            rotationEnable:true
        }
    });

    //creating a graphics layer
    const graphicsLayer=new GraphicsLayer();
    const bookmarks=new Bookmarks({
        view:view,
        visibleElements:{
            addBookmarkButton: true,
            editBookmarkButton:true
        },
        draggable: true,
        // whenever a new bookmark is created, a 100x100 px
        // screenshot of the view will be taken and the rotation, scale, and extent
        // of the view will not be set as the viewpoint of the new bookmark
        defaultCreateOptions: {
            takeScreenshot: true,
            captureViewpoint: false,
            captureTimeExtent: false, // the time extent of the view will not be saved in the bookmark
            screenshotSettings: {
                width: 100,
                height: 100
            }}
    })
    const bookmarksExpand=new Expand({
        view:view,
        content:bookmarks,
        expandTooltip:"Bookmarks"
    })
    view.ui.add(bookmarksExpand,"top-left")
    bookmarks.on("bookmark-select", function(event){
        bookmarksExpand.expanded=false
    })

    const compass=new Compass({
        view:view
    })
    view.ui.add(compass,"top-left")

    const home=new Home({
        view:view
    })
    view.ui.add(home,"top-left")

    const layerList=new LayerList({
        view,
        listItemCreatedFunction: function(event) {
            // Only modify your graphics layer
            if (event.item.layer === graphicsLayer) {
                // Remove the title so only the eye is shown
                event.item.title = "Kladilnici";
                // Optionally remove the layer actions if you want to keep it minimal
                event.item.actionsSections = [];
            }
        }
    })
    const layerExpand=new Expand({
        view:view,
        content:layerList,
        expandTooltip:"Visibility"
    })
    view.ui.add(layerExpand,"top-left")
    layerList.on("layer-select", function(event){
        layerExpand.expanded=false
    })

    let basemapGallery = new BasemapGallery({
        view: view
    });
    const baseMapExpand=new Expand({
        view:view,
        content:basemapGallery,
        expandTooltip:"BaseMap"
    })
    view.ui.add(baseMapExpand,"top-left")
    basemapGallery.on("baseMap-select", function(event){
        baseMapExpand.expanded=false
    })

    let ccWidget = new CoordinateConversion({
        view: view
    });
    view.ui.add(ccWidget, "bottom-left");




    map.add(graphicsLayer);

    async function loadAndDrawKladilnici(){
        const response=await fetch(LAYER_URL);
        const data=await response.json();

        data.features.forEach(feature =>{
            // const geometry=feature.geometry;
            // console.log(geometry);

            const { x, y } = feature.geometry;
            const { lat, lon } = mercatorToLatLon(x, y);

            const pointGraphic=new Graphic({
                geometry:{
                    type:"point",
                    longitude: lon,
                    latitude: lat
                },
                symbol:{
                    type:"simple-marker",
                    color:"red",
                    size:"10px"
                },
                attributes:feature.attributes,
                popupTemplate:{
                    title:"{ime}",
                    content: `
                        <b>Address:</b> {adresa}<br>
                        <b>ID:</b> {objectid}
                    `
                }
            });
            graphicsLayer.add(pointGraphic)
        });
    }
    loadAndDrawKladilnici();
});





//load the JSON data ------------------------------------------------------------------------------------------
const LAYER_URL="https://app.gdi.mk/arcgis/rest/services/Studenti/Kladilnici_Kazina/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=objectid%2Cime%2Cadresa&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson"

// fetch(LAYER_URL)
//     .then(response => response.json())
//     .then(data => {
//         console.log("DATA from JSON:", data);
//         data.features.forEach(feature => {
//             const id = feature.attributes.objectid;
//             const name = feature.attributes.ime;
//             const adress = feature.attributes.adresa;
//
//             console.log(id, name, adress);
//         });
//     })
//     .catch(error => console.error("ERROR FETCHING DATA: ", error));

let kladilnici = [];  // store all features
let currentPage = 1;
const pageSize = 10;  // 10 items per page

async function loadKladilnici(){
    try{
        const response=await fetch(LAYER_URL);
        const data=await response.json();
        kladilnici = data.features.map(feature =>{
            const {x,y}=feature.geometry;
            const {lat,lon} = mercatorToLatLon(x,y)

            return{
                id:  feature.attributes.objectid,
                name : feature.attributes.ime,
                adress:  feature.attributes.adresa,
                lat,
                lon
            }
        })
        // kladilnici=data.features.map(feature=>({
        //     id:  feature.attributes.objectid,
        //     name : feature.attributes.ime,
        //     adress:  feature.attributes.adresa,
        // }));

        renderPage();
    }
    catch (error){
        console.log("ERROR",error)
    }
}

//render page of kladilnica in the table --------------------------------------------------------------
function renderPage(){
    const tableBody=document.querySelector("#kladilnici-table tbody");
    tableBody.innerHTML=""//clear previous table rows

    const start=(currentPage-1) * pageSize;
    const end=start+ pageSize;
    const pageItems=kladilnici.slice(start,end);

    pageItems.forEach(item=>{
        const row=document.createElement("tr");
        row.innerHTML=`
            <td>${item.id}</td>
            <td>${item.name}</td> 
            <td>${item.adress}</td>
<!--        <td><button class="bookmark-btn">Bookmark</td>-->`;

        //click listener for the locating the kladilnica
        row.addEventListener("click", () => {
            view.goTo({
                center:[item.lon,item.lat],
                zoom: 17
            })
        })
        // row.querySelector(".bookmark-btn").addEventListener("clicl", (event) =>{
        //     event.stopPropagation() //prevent row click zoom
        //     bookmarks.addBookmark({
        //         name:item.name,
        //         extent:view.extent.clone()
        //     })
        //     alert(`${item.name} added to bookmarks!`);
        // })

        tableBody.appendChild(row)
    });

    //update page info
    const pageInfo = document.getElementById("page-info");
    const totalPages=Math.ceil(kladilnici.length/pageSize);
    pageInfo.textContent=`Page ${currentPage} of ${totalPages}`;
    document.getElementById("prev").disabled=currentPage===1;
    document.getElementById("next").disabled=currentPage===totalPages;
}
document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
});
document.getElementById("next").addEventListener("click", () => {
    const totalPages=Math.ceil(kladilnici.length/pageSize);
    if(currentPage<totalPages){
        currentPage++;
        renderPage()
    }
});

loadKladilnici();





//math for converting coordinates into longtitude and latitude  ------------------------------------------------------------------
function mercatorToLatLon(x, y) {
    const R = 6378137; // radius of Earth in meters
    const lon = x / R * (180 / Math.PI);
    const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI/2) * (180 / Math.PI);
    return { lat, lon };
}
