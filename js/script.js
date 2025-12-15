let view;
let widgets={};
let SymbolDrawing;
let graphicsLayer
const SYMBOL="https://app.gdi.mk/arcgis/rest/services/Studenti/Kladilnici_Kazina/MapServer/1?f=pjson"//get the first layer and turn it into json
//load the symbols ----------------------------------------------------------------
async function loadSymbol(){
    const response2=await fetch(SYMBOL);
    const symboldata=await response2.json();
    SymbolDrawing=symboldata.drawingInfo.renderer.symbol
    console.log(SymbolDrawing)
}

let savedLang = sessionStorage.getItem("selectedLanguage") || "en";

//load the map ---------------------------------------------------------------------
loadSymbol().then(() =>{require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",// a layer added to the map that holds the points of the kladilnici
    "esri/Graphic",
    "esri/widgets/Bookmarks",
    "esri/widgets/Expand",
    "esri/widgets/Compass",
    "esri/widgets/Home",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "esri/widgets/CoordinateConversion",
    "esri/widgets/Print",
    "esri/widgets/Sketch",
    "esri/widgets/TimeZoneLabel",
    "esri/widgets/ElevationProfile",
    "esri/widgets/Locate",
    "esri/widgets/Fullscreen",
    "esri/widgets/DistanceMeasurement2D",
        "esri/layers/FeatureLayer",
    "esri/widgets/Legend"
],
function(Map, MapView,GraphicsLayer,Graphic,Bookmarks, Expand,Compass, Home, LayerList,BasemapGallery,CoordinateConversion,Print,Sketch,TimeZoneLabel,ElevationProfile, Locate, Fullscreen, DistanceMeasurement2D, FeatureLayer, Legend) {

// Create the map
    const map = new Map({
        basemap: "streets-navigation-vector", // choose a basemap
        ground: "world-elevation"
    });

// Create the view
    view = new MapView({
        container: "map",      // Div ID
        map: map,
        center: [21.43, 41.998], // Skopje coordinates [longitude, latitude]
        zoom: 13,
        constraints: {
            rotationEnable: true
        }
    });


    const featureLayer = new FeatureLayer({
        url: "https://app.gdi.mk/arcgis/rest/services/Studenti/Kladilnici_Kazina/MapServer/1",
        outFields: ["*"],
        popupEnabled: true
    });

    map.add(featureLayer);

    view.when(() => {
        // Run translation after map and all widgets fully render
        const lang = sessionStorage.getItem("selectedLanguage") || "en";
        setTimeout(() => translateWidgets(lang), 400);
    });

//creating a graphics layer
    graphicsLayer = new GraphicsLayer();
    graphicsLayer.renderer = {
        type: "simple",
        label: "Kladilnici under 400m near a school",
        symbol: {
            type: "picture-marker",
            url: "data:image/png;base64," + SymbolDrawing.imageData,
            width: SymbolDrawing.width,
            height: SymbolDrawing.height
        }
    };
    graphicsLayer.title = "Kladilnici under 400m near a school";
    map.add(graphicsLayer);


//bookmarks
    const bookmarks = new Bookmarks({
        view: view,
        visibleElements: {
            addBookmarkButton: true,
            editBookmarkButton: true
        },
    })
    const bookmarksExpand = new Expand({
        view: view,
        content: bookmarks,
        expandTooltip: "Bookmarks",
    })
    view.ui.add(bookmarksExpand, "top-left")
    bookmarks.on("bookmark-select", function (event) {
        bookmarksExpand.expanded = false
    })

//compass
    const compass = new Compass({
        view: view,
    })
    view.ui.add(compass, "top-left")
    widgets.compass = compass

//home
    const home = new Home({
        view: view
    })
    view.ui.add(home, "top-left")
    widgets.home = home;

//layerList
    const layerList = new LayerList({
        view,
        listItemCreatedFunction: function (event) {
            // Only modify your graphics layer
            if (event.item.layer === graphicsLayer) {
                // Remove the title so only the eye is shown
                event.item.title = "Kladilnici";
                // Optionally remove the layer actions if you want to keep it minimal
                event.item.actionsSections = [];
            }
        }
    })
    const layerExpand = new Expand({
        view: view,
        content: layerList,
        expandTooltip: "Visibility"
    })
    view.ui.add(layerExpand, "top-left")
    layerList.on("layer-select", function (event) {
        layerExpand.expanded = false
    })
    widgets.LayerList = layerExpand

//baseMap
    let basemapGallery = new BasemapGallery({
        view: view
    });
    const baseMapExpand = new Expand({
        view: view,
        content: basemapGallery,
        expandTooltip: "BaseMap"
    })
    view.ui.add(baseMapExpand, "top-left")
    basemapGallery.on("baseMap-select", function (event) {
        baseMapExpand.expanded = false
    })
    widgets.baseMapExpand = baseMapExpand




//my location
    const locateWidget = new Locate({
        view: view
    });
    view.ui.add(locateWidget, "top-left");


// Measurement widget (distance + area)
    let measurementWidget = new DistanceMeasurement2D({
        view: view
    });

// Wrap it in an Expand widget
    const MeasurementExpand = new Expand({
        view: view,
        content: measurementWidget,
        expandTooltip: "Measurement"
    })
    view.ui.add(MeasurementExpand, "top-left")
    measurementWidget.on("measurement-select", function (event) {
        MeasurementExpand.expanded = false
    })

    widgets.MeasurementExpand = MeasurementExpand


//print
    const print = new Print({
        view: view,
        // specify your own print service
        printServiceUrl:
            "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });
    const printExpand = new Expand({
        view: view,
        content: print,
        expandTooltip: "Print",
    })
    view.ui.add(printExpand, "top-left")
    print.on("print", function (event) {
        printExpand.expanded = false
    })

//full screen
    const fullscreen = new Fullscreen({
        view: view
    });
    view.ui.add(fullscreen, "top-left");


//legenda
    let legend = new Legend({
        view: view
    });

    view.ui.add(legend, "bottom-right");

    //elevation
    const elevationProfile = new ElevationProfile({
        view: view,
        profiles: [
            {
                type: "ground",   // Ground elevation
                color: "blue"
            },
            {
                type: "view",     // Elevation along view line (or another surface)
                color: "green"
            }
        ]
    });
    measurementWidget.viewModel.activeTool = "distance";

//Elevation
    const elevationExpand = new Expand({
        view: view,
        content: elevationProfile,
        expandTooltip: "Elevation",
    })
    view.ui.add(elevationExpand, "bottom-left")
    elevationProfile.on("elevation-select", function (event) {
        elevationExpand.expanded = false
    })


//ccWidget
    let ccWidget = new CoordinateConversion({
        view: view
    });
    view.ui.add(ccWidget, "top-right");
    widgets.ccWidget = ccWidget


//sketch
    let sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        availableCreateTools: ["point", "polyline", "polygon", "rectangle", "circle"], // which shapes users can draw
        visibleElements: {
            selectionTools: {
                "rectangle-selection": true,
                "lasso-selection": true
            },
        },
    });
    view.ui.add(sketch, "top-right");




// Listen for clicks on the map view
    view.on("click", event => {
        // Perform a hit test to see if the click hits any graphics
        view.hitTest(event).then(response => {
            // Find the first graphic in our graphicsLayer that was clicked
            const graphic = response.results
                .find(r => r.graphic?.layer === graphicsLayer)  // check if the result has a graphic in our layer
                ?.graphic;                                      // get the actual Graphic object

            // If a graphic was clicked
            if (graphic) {
                // Open a popup at the clicked location using the graphic's popupTemplate
                view.openPopup({
                    features: [graphic],      // the clicked graphic to show info for
                    location: event.mapPoint  // where on the map to open the popup
                });
            }
        });
    });

    // console.log(graphicsLayer.renderer);
    // map.add(graphicsLayer);





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
                symbol: {
                    type: "picture-marker",       //  important
                    url: "data:image/png;base64," + SymbolDrawing.imageData, //  important
                    width: SymbolDrawing.width,
                    height: SymbolDrawing.height,
                    angle: SymbolDrawing.angle || 0,
                    xoffset: SymbolDrawing.xoffset || 0,
                    yoffset: SymbolDrawing.yoffset || 0
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
            // console.log(pointGraphic.popupTemplate)
        });

    }
    loadAndDrawKladilnici();

    // console.log(graphicsLayer.graphics.items[0].symbol);
    view.when(() => {
        const legendVM = view.ui.find("legend")?.viewModel;
        console.log(legendVM?.activeLayerInfos);
    });

});
});



//load the JSON data ------------------------------------------------------------------------------------------
const LAYER_URL="https://app.gdi.mk/arcgis/rest/services/Studenti/Kladilnici_Kazina/MapServer/1/query?where=1=1&outFields=objectid,ime,adresa&returnGeometry=true&f=pjson"
let kladilnici = [];
let currentPage = 1;
const pageSize = 10;  // 10 items per page
let filteredKladilnici=[];

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
                lon,
            }
        })
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

    const source=filteredKladilnici.length>0 ? filteredKladilnici : kladilnici;
    const pageItems=source.slice(start,end);

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
    // const totalPages=Math.ceil(kladilnici.length/pageSize);
    const totalPages=Math.ceil(source.length/pageSize);
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




//search kladilnici --------------------------------------
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");


function performSearch() {
    const input = searchInput.value.trim().toLowerCase();

    // If input is empty, clear the filtered list and render first page
    if (!input) {
        filteredKladilnici = [];
        currentPage = 1;
        renderPage();
        return;
    }

    filteredKladilnici = kladilnici.filter(k =>
        k.name.toLowerCase().includes(input)
    );

    currentPage = 1;
    renderPage();
}


searchBtn.addEventListener("click", performSearch);


searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});

//sorting the table ---------------------------------------------------------------------------------
const sortOrder={
    id:"asc", //column:value
    name:"asc",
    adress:"asc"
}

function sortTable(column) {
    const source = filteredKladilnici.length > 0 ? filteredKladilnici : kladilnici;
    const order = sortOrder[column]; //we get the value of that column
//sortOrder[column] = direction, a[column] = data value.
//a is one row of the table (an object like {id:1, name:"Alpha", adress:"Street A"})
// column is a variable that can be "id", "name", or "adress".
// a[column] dynamically gets the value of that property aka id,name or adress.
    source.sort((a, b) => {
        let valA = a[column];//will give the value stored in that column, this is like a[name] or a[id]
        let valB = b[column];

        if (typeof valA === "string") {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (order === "asc") return valA > valB ? 1 : valA < valB ? -1 : 0;
        else return valA < valB ? 1 : valA > valB ? -1 : 0;
    });

    // Toggle order for next click
    sortOrder[column] = order === "asc" ? "desc" : "asc";

    currentPage = 1;
    renderPage();
}

// Add click event to headers
document.querySelectorAll("#kladilnici-table th").forEach(th => {
    th.addEventListener("click", () => {
        sortTable(th.getAttribute("data-column"));
    });
});







//math for converting coordinates into longtitude and latitude  ------------------------------------------------------------------
function mercatorToLatLon(x, y) {
    const R = 6378137; // radius of Earth in meters
    const lon = x / R * (180 / Math.PI);
    const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI/2) * (180 / Math.PI);
    return { lat, lon };
}


//for images slider -------------------------------------------------------------------------------------------------------------
const slides=document.querySelectorAll(".slides img")
let slideIndex=0;
const slider=document.querySelector(".slider");
const galleryBtn=document.getElementById("gallery-btn")
const overlay=document.getElementById("overlay")


galleryBtn.addEventListener("click", ()=>{
    slider.style.display="flex";
    initializeSlider();
})

function initializeSlider(){
    slides[slideIndex].classList.add("displaySlide");
}

function showSlide(index){
    if(index >= slides.length){
        slideIndex=0;
    }else if(index<0){
        slideIndex=slides.length-1;
    }
    slides.forEach(slide =>{
        slide.classList.remove("displaySlide")
    })
    slides[slideIndex].classList.add("displaySlide");
}
function prevSlide(){
    slideIndex--;
    showSlide(slideIndex)
}
function nextSlide(){
    slideIndex++;
    showSlide((slideIndex))
}
function closeGallery() {
    slider.style.display = "none";
    // document.body.style.overflow = "auto"; // <--- RESTORE SCROLL
}

//Exporting in PDF---------------------------------------------------------------------------------------
//Exporting in PDF (updated to export all rows, not just current page)
document.getElementById("exportPDF-btn").addEventListener("click", () => {
    // 1. Use filtered data if search is active, otherwise use full dataset
    const source = filteredKladilnici.length > 0 ? filteredKladilnici : kladilnici;

    // 2. Build the table HTML dynamically from all data
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
    `;

    source.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.adress}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;

    // 3. Open a new window and write the table HTML into it
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
        <html>
            <head>
                <title>Kladilnici PDF</title>
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #000; padding: 5px; text-align: left; }
                    th { background-color: #eaeaf6; }
                    /* Optional: Add page breaks for long tables */
                    @media print {
                        table { page-break-after: auto; }
                        tr    { page-break-inside: avoid; page-break-after: auto; }
                        td    { page-break-inside: avoid; page-break-after: auto; }
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                    }
                </style>
            </head>
            <body>
                <h2>Kladilnici</h2>
                ${tableHTML}
            </body>
        </html>
    `);

    // 4. Close document, focus window, and open print dialog
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});
//Export in Excel --------------------------------------------------------------------
// Export in Excel (updated to export all rows, not just current page)
document.getElementById("exportEXCEL-btn").addEventListener("click", () => {
    // 1. Use filtered data if a search is active, otherwise use full dataset
    const source = filteredKladilnici.length > 0 ? filteredKladilnici : kladilnici;

    // 2. Build the table HTML dynamically from all data
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
    `;

    source.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.adress}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;

    // 3. Create a Blob and download as Excel
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kladilnici.xls";
    a.click();
    URL.revokeObjectURL(url); // free memory
});

//Cookies ------------------------------------------------------------------------
setCookie = (cName,cValue,expdays) =>{
    let date=new Date();
    date.setTime(date.getTime()+(expdays *24 *60 *60 *1000))//so its in seconds
    const expires = "expires="+date.toUTCString();
    document.cookie=cName+ "=" + cValue + ";" + expires +"; path=/";
    console.log("cookie created")

}
getCookie=(cName) =>{
    const name=cName+"=";
    const cDecoded=decodeURIComponent(document.cookie);
    const cArr=cDecoded.split("; ");
    let value;
    cArr.forEach(val =>{
        if(val.indexOf(name) == 0) value=val.substring(name.length);
    })

    return value;
}
document.querySelector("#cookies-btn").addEventListener("click", () => {
    document.querySelector("#cookies").style.display="none"
    setCookie("cookie", "true", 30)//expier after 30 days
})

cookieMessage= () =>{
    if(!getCookie("cookie"))
        document.querySelector("#cookies").style.display="block";
    console.log("get that cookie")
}
window.addEventListener("load",cookieMessage)


//TRANSLATE WIDGETS ---------------------------------------------------------------------------
// const widgetLabels = {
//     "Zoom in": "zoomin",
//     "Zoom out": "zoomout",
//     "Default map view": "home",
//     "Reset map orientation": "compass",
//     "Bookmarks": "bookmarks",
//     "BaseMap": "basemap",
//     "Visibility": "visibility",
//     "Find my location": "locate",
//     "Enter fullscreen": "fullscreen",
//     "Exit fullscreen": "fullscreen",
//     "Print": "print",
//     "Measurement": "measurement",
//     "Elevation Profile": "elevation",
// };
// function translateWidgets(lang) {
//     const t = translations[lang];
//
//     Object.entries(widgetLabels).forEach(([original, key]) => {
//
//         // 1. aria-label
//         document.querySelectorAll(`[aria-label="${original}"]`)
//             .forEach(el => el.setAttribute("aria-label", t[key]));
//
//         // 2. title
//         document.querySelectorAll(`[title="${original}"]`)
//             .forEach(el => el.setAttribute("title", t[key]));
//
//         // 3. calcite shadow DOM (Compass, Home, Locate)
//         document.querySelectorAll("calcite-button, calcite-icon")
//             .forEach(el => {
//                 if (el.title === original) {
//                     el.title = t[key];
//                 }
//             });
//     });
// }
// const widgetObserver = new MutationObserver(() => {
//     const lang = sessionStorage.getItem("selectedLanguage") || "en";
//     translateWidgets(lang);
// });
//
// widgetObserver.observe(document.body, {
//     childList: true,
//     subtree: true
// });
function translateWidgets(lang){
    const t=translations[lang];
    document.querySelector('[title="Zoom in"]')?.setAttribute("title",t.zoomin)
    document.querySelector('[title="Zoom out"]')?.setAttribute("title",t.zoomout)
    document.querySelector('[title="Bookmarks"]')?.setAttribute("title",t.bookmarks)
    document.querySelector('[title="Default map view"]')?.setAttribute("title",t.home)
    document.querySelector('[title="Reset map orientation"]')?.setAttribute("title",t.compass)
    document.querySelector('[title="BaseMap"]')?.setAttribute("title",t.basemap)
    document.querySelector('[title="Visibility"]')?.setAttribute("title",t.visibility)
    document.querySelector('[title="Find my location"]')?.setAttribute("title",t.locate)
    document.querySelector('[title="Enter fullscreen"]')?.setAttribute("title",t.fullscreen)
    document.querySelector('[title="Print"]')?.setAttribute("title",t.print)
    document.querySelector('[title="Measurement"]')?.setAttribute("title",t.measurement)


    // document.querySelector('[aria-label="Add conversion"]')?.setAttribute("title",t.AddConversion)

    document.querySelectorAll("calcite-button").forEach(btn => {
        if (!btn.shadowRoot) return;

        const innerBtn = btn.shadowRoot.querySelector('button[title="Reset map orientation"]');
        if (innerBtn) {
            innerBtn.setAttribute("title", t.compass);
        }
    });

}



