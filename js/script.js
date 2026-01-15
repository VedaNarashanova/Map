let view;
let widgets={};
let SymbolDrawing;
let graphicsLayer
const SYMBOL="https://app.gdi.mk/arcgis/rest/services/Studenti/Kladilnici_Kazina/MapServer/1?f=pjson"//get the first layer and turn it into pretty 2202json
//load the symbols ----------------------------------------------------------------
async function loadSymbol(){
    const response2=await fetch(SYMBOL);
    const symboldata=await response2.json();
    SymbolDrawing=symboldata.drawingInfo.renderer.symbol
    console.log(SymbolDrawing)
}

let savedLang = sessionStorage.getItem("selectedLanguage") || "en";


// let mapReady = false;

//load the map ---------------------------------------------------------------------
loadSymbol().then(() =>{
    require([
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
    "esri/widgets/Legend",
    "esri/widgets/Measurement",
],
function(Map, MapView,GraphicsLayer,Graphic,Bookmarks, Expand,Compass, Home, LayerList,BasemapGallery,CoordinateConversion,Print,Sketch,TimeZoneLabel,ElevationProfile, Locate, Fullscreen, DistanceMeasurement2D, FeatureLayer, Legend, Measurement) {

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
        },
        locale: sessionStorage.getItem("selectedLanguage") || "en"
    });


    const featureLayer = new FeatureLayer({ //za legenda i popups
        url: "https://app.gdi.mk/arcgis/rest/services/Studenti/Kladilnici_Kazina/MapServer/1",
        outFields: ["*"],
        // title: "Kladilnici",
        popupTemplate: {
            title: "{ime}",
            content: `
            <b>Address:</b> {adresa}<br>
            <b>ID:</b> {objectid}
        `
        },
        renderer: {
            type: "simple",
            symbol: {
                type: "picture-marker",
                url: "data:image/png;base64," + SymbolDrawing.imageData,
                width: SymbolDrawing.width,
                height: SymbolDrawing.height
            }
        }
    });

    map.add(featureLayer);


    graphicsLayer = new GraphicsLayer();
    graphicsLayer.renderer = {
        type: "simple",
        label: "kladilnici",
        symbol: {
            type: "picture-marker",
            url: "data:image/png;base64," + SymbolDrawing.imageData,
            width: SymbolDrawing.width,
            height: SymbolDrawing.height
        }
    };
    graphicsLayer.title = "kladilnici";
    // map.add(graphicsLayer);

//Print
    const print = new Print({
        view: view,
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
    widgets.printExpand = printExpand;
    let printTranslateTimeout = null;



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
    widgets.bookmarksExpand = bookmarksExpand;

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
        listItemCreatedFunction: (event) => {
            // Only show the featureLayer in the list
            if (event.item.layer === featureLayer) {
                event.item.title = "Kladilnici"; // rename
                // event.item.actionsSections = [];

                // sync graphicsLayer visibility with featureLayer
                // featureLayer.watch("visible", visible => graphicsLayer.visible = visible);
            } else {
                // Remove other layers from the list completely
                event.item.panel = null;   // hides the expand arrow
                event.item.visible = false; // ensure it's not visible
            }
        }
    });

    const layerExpand = new Expand({
        view,
        content: layerList,
        expandTooltip: "Visibility"
    });

    view.ui.add(layerExpand, "top-left");
    widgets.LayerList = layerExpand;


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
    widgets.locate = locateWidget;


//Measurement widget
    let measurementWidget = new DistanceMeasurement2D({
        view: view
    });
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


//Full screen
    const fullscreen = new Fullscreen({
        view: view
    });
    view.ui.add(fullscreen, "top-left");
    widgets.fullscreen = fullscreen;


//legenda
    let legend = new Legend({
        view: view
    });
    view.ui.add(legend, "bottom-right");

//Elevation
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


//Sketch
    let sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        availableCreateTools: ["point", "polyline", "polygon", "rectangle", "circle"], // which shapes users can draw
        // visibleElements: {
        //     selectionTools: {
        //         "rectangle-selection": true,
        //         "lasso-selection": true
        //     },
        // },
    });
    view.ui.add(sketch, "top-right");





    async function loadAndDrawKladilnici(){
        const response=await fetch(LAYER_URL);
        const data=await response.json();

        data.features.forEach(feature =>{
            // const geometry=feature.geometry;
            // console.log(geometry);

            const { x, y } = feature.geometry;
            const { lat, lon } = convertToLatLon(x, y);

            const pointGraphic=new Graphic({
                geometry:{
                    type:"point",
                    longitude: lon,
                    latitude: lat
                },
                symbol: {
                    type: "picture-marker",
                    url: "data:image/png;base64," + SymbolDrawing.imageData,
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
            const {lat,lon} = convertToLatLon(x,y)

            return{
                id:  feature.attributes.objectid,
                name : feature.attributes.ime,
                adress:  feature.attributes.adresa,
                lat,
                lon,
            }
        })
        // .filter(feature => feature.id%2===0) za samo parni
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
        tableBody.appendChild(row)
    });

    //update page info
    const pageInfo = document.getElementById("page-info");
    // const totalPages=Math.ceil(kladilnici.length/pageSize);
    const totalPages=Math.ceil(source.length/pageSize);  //round it up for how many pages it will need
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
function convertToLatLon(x, y) {
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
document.getElementById("exportPDF-btn").addEventListener("click", () => {
    const source = filteredKladilnici.length > 0 ? filteredKladilnici : kladilnici;
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

    // Open a new window and write the table HTML into it
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
        <html>
            <head>
                <title>Kladilnici PDF</title>
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #000; padding: 5px; text-align: left; }
                    th { background-color: #eaeaf6; }
                    
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

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});
//Export in Excel --------------------------------------------------------------------
document.getElementById("exportEXCEL-btn").addEventListener("click", () => {
    const source = filteredKladilnici.length > 0 ? filteredKladilnici : kladilnici;
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

    // Create a Blob and download as Excel
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
    document.querySelector('[title="Elevation"]')?.setAttribute("title",t.elevation)
    document.querySelector('[title="Collapse"]')?.setAttribute("title",t.collapse)
    document.querySelector('[title="Expand"]')?.setAttribute("title",t.epxand)



    document.querySelector('[title="Зумирај"]')?.setAttribute("title",t.zoomin)
    document.querySelector('[title="Одзумирај"]')?.setAttribute("title",t.zoomout)
    document.querySelector('[title="Обележувачи"]')?.setAttribute("title",t.bookmarks)
    document.querySelector('[title="Почетен екран"]')?.setAttribute("title",t.home)
    document.querySelector('[title="Компас"]')?.setAttribute("title",t.compass)
    document.querySelector('[title="Основна мапа"]')?.setAttribute("title",t.basemap)
    document.querySelector('[title="Видливост"]')?.setAttribute("title",t.visibility)
    document.querySelector('[title="Моја локација"]')?.setAttribute("title",t.locate)
    document.querySelector('[title="Целосен екран"]')?.setAttribute("title",t.fullscreen)
    document.querySelector('[title="Испринтај"]')?.setAttribute("title",t.print)
    document.querySelector('[title="Мерки"]')?.setAttribute("title",t.measurement)
    document.querySelector('[title="Елевиран профил"]')?.setAttribute("title",t.elevation)
    document.querySelector('[title="Смали"]')?.setAttribute("title",t.collapse)
    document.querySelector('[title="Прошири"]')?.setAttribute("title",t.epxand)

    document.querySelector('[title="Home"]')?.setAttribute("title",t.home)
    document.querySelector('[title="Compass"]')?.setAttribute("title",t.compass)
    document.querySelector('[title="Fullscreen"]')?.setAttribute("title",t.fullscreen)
    document.querySelector('[title="My Location"]')?.setAttribute("title",t.locate)
    document.querySelector('[title="Base Map"]')?.setAttribute("title",t.basemap)


    document.querySelector('[title="Zmadho"]')?.setAttribute("title",t.zoomin)
    document.querySelector('[title="Zvogëlo"]')?.setAttribute("title",t.zoomout)
    document.querySelector('[title="Faqerojtje"]')?.setAttribute("title",t.bookmarks)
    document.querySelector('[title="Ballina"]')?.setAttribute("title",t.home)
    document.querySelector('[title="Busull"]')?.setAttribute("title",t.compass)
    document.querySelector('[title="Harta Bazë"]')?.setAttribute("title",t.basemap)
    document.querySelector('[title="Dukshmëria"]')?.setAttribute("title",t.visibility)
    document.querySelector('[title="Vendndodhja ime"]')?.setAttribute("title",t.locate)
    document.querySelector('[title="Ekran i Plotë"]')?.setAttribute("title",t.fullscreen)
    document.querySelector('[title="Printo"]')?.setAttribute("title",t.print)
    document.querySelector('[title="Matje"]')?.setAttribute("title",t.measurement)
    document.querySelector('[title="Profili i Lartësisë"]')?.setAttribute("title",t.elevation)



    document.querySelector('[title="xy conversion output"]')?.setAttribute("title",t.xyConversionOutput)
    document.querySelector('[title="xy излез за конверзија"]')?.setAttribute("title",t.xyConversionOutput)
    document.querySelector('[title="dalja e konvertimit xy"]')?.setAttribute("title",t.xyConversionOutput)

    document.querySelector('[title="Select feature"]')?.setAttribute("title",t.feature)
    document.querySelector('[title="Select by rectangle"]')?.setAttribute("title",t.selectrectangle)
    document.querySelector('[title="Select by lasso"]')?.setAttribute("title",t.lasso)
    document.querySelector('[title="Draw a point"]')?.setAttribute("title",t.point)
    document.querySelector('[title="Draw a polyline"]')?.setAttribute("title",t.polyline)
    document.querySelector('[title="Draw a polygon"]')?.setAttribute("title",t.polygon)
    document.querySelector('[title="Draw a rectangle"]')?.setAttribute("title",t.rectangle)
    document.querySelector('[title="Draw a circle"]')?.setAttribute("title",t.circle)
    document.querySelector('[title="Undo"]')?.setAttribute("title",t.undo)
    document.querySelector('[title="Redo"]')?.setAttribute("title",t.redo)
    document.querySelector('[title="Settings"]')?.setAttribute("title",t.settings)




    document.querySelector('[title="Избери објект"]')?.setAttribute("title",t.feature)
    document.querySelector('[title="Избери со правоаголник"]')?.setAttribute("title",t.selectrectangle)
    document.querySelector('[title="Избери со ласо"]')?.setAttribute("title",t.lasso)
    document.querySelector('[title="Насликај точка"]')?.setAttribute("title",t.point)
    document.querySelector('[title="Насликај линија"]')?.setAttribute("title",t.polyline)
    document.querySelector('[title="Насликај полигонот"]')?.setAttribute("title",t.polygon)
    document.querySelector('[title="Насликај правоаголник"]')?.setAttribute("title",t.rectangle)
    document.querySelector('[title="Насликај круг"]')?.setAttribute("title",t.circle)
    document.querySelector('[title="Поништи"]')?.setAttribute("title",t.undo)
    document.querySelector('[title="Повтори"]')?.setAttribute("title",t.redo)
    document.querySelector('[title="Подесувања"]')?.setAttribute("title",t.settings)


    document.querySelector('[title="Zgjidh veçorinë"]')?.setAttribute("title",t.feature)
    document.querySelector('[title="Zgjidh me drejtkëndësh"]')?.setAttribute("title",t.selectrectangle)
    document.querySelector('[title="Zgjidh me lasso"]')?.setAttribute("title",t.lasso)
    document.querySelector('[title="Vizato një pikë"]')?.setAttribute("title",t.point)
    document.querySelector('[title="Vizato një linjë"]')?.setAttribute("title",t.polyline)
    document.querySelector('[title="Vizato një poligon"]')?.setAttribute("title",t.polygon)
    document.querySelector('[title="Vizato një drejtkëndësh"]')?.setAttribute("title",t.rectangle)
    document.querySelector('[title="Vizato një rreth"]')?.setAttribute("title",t.circle)
    document.querySelector('[title="Anulo"]')?.setAttribute("title",t.undo)
    document.querySelector('[title="Rikthe"]')?.setAttribute("title",t.redo)
    document.querySelector('[title="Cilësimet"]')?.setAttribute("title",t.settings)

}






function translatePrintWidget(lang) {
    const t = translations[lang];

    //Header
    const printHeader = document.querySelector(".esri-print__header-title");
    if (printHeader) printHeader.textContent = t.print;

    // Tabs
    const layoutTab = document.querySelector("[data-tab-id='layoutTab']");
    if (layoutTab) layoutTab.textContent = t.layout;

    const mapOnlyTab = document.querySelector("[data-tab-id='mapOnlyTab']");
    if (mapOnlyTab) mapOnlyTab.textContent = t.mapOnly;


    // Layout / Design Section
    const layoutSection = document.querySelector(".esri-print__layout-section");
    if (layoutSection) {
        // Reuse your existing logic for Layout section here
        translateCalciteLabel(layoutSection, 0, t.titleLabel, t.titlePlaceholder);       // Title
        translateCalciteLabel(layoutSection, 1, t.templateLabel, t.selectTemplate);      // Template
        translateCalciteLabel(layoutSection, 2, t.fileFormatLabel, t.selectFormat);       // File Format
    }


    // Map Only Section
    const mapOnlySection = document.querySelector(".esri-print__map-only-section");
    if (mapOnlySection) {
        translateCalciteLabel(mapOnlySection, 0, t.fileNameLabel, t.fileNameLabel);    // File name
        translateCalciteLabel(mapOnlySection, 1, t.fileFormatLabel, t.selectFormat);    // File format

        // Width and Height
        const widthLabel = mapOnlySection.querySelector(".esri-print__width-container label");
        if (widthLabel) widthLabel.childNodes[0].textContent = t.width;

        const heightLabel = mapOnlySection.querySelector(".esri-print__height-container label");
        if (heightLabel) heightLabel.childNodes[0].textContent = t.height;
    }


    //Advanced / Export Section
    const adv = document.querySelector(".esri-print__advanced-options-button-title");
    if (adv) adv.textContent = t.advancedOptions;

    const exportBtn = document.querySelector(".esri-print__export-button");
    if (exportBtn) exportBtn.textContent = t.export;

    const exportedTitle = document.querySelector(".esri-print__export-title");
    if (exportedTitle) exportedTitle.textContent = t.exportedFiles;

    const exportedText = document.querySelector(".esri-print__export-panel-container div div");
    if (exportedText) exportedText.textContent = t.exportedFilesHint;
}


// Helper to translate Calcite labels
function translateCalciteLabel(section, index, labelText, placeholderText) {
    const label = section.querySelectorAll("calcite-label")[index];
    if (!label) return;

    // Light DOM: visible label
    label.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = labelText;
    });

    // Shadow DOM: input placeholder
    const input = label.querySelector("calcite-input, calcite-combobox")?.shadowRoot?.querySelector("input");
    if (input && placeholderText) input.placeholder = placeholderText;
}


function translateBookmarksWidget(lang) {
    const t = translations[lang];
    const container = document.querySelector(".esri-bookmarks");
    if (!container || !t) return;

    // Collapse button
    container
        .closest(".esri-expand")
        ?.querySelectorAll('calcite-button[title]')
        .forEach(btn => {
            if (btn.title === "Collapse") {
                btn.title = t.collapse;
                btn.setAttribute("aria-label", t.collapse);
            }
        });

    //options
    container.querySelectorAll(".text-container").forEach(el => {
        if (el.textContent.trim() === "Options") {
            el.textContent = t.options;
        }
    });

    // Empty state title
    const noBookmarksTitle = container.querySelector(
        ".esri-bookmarks__no-bookmarks-heading"
    );
    if (noBookmarksTitle) {
        noBookmarksTitle.textContent = t.noBookmarks;
    }

    // Empty state description
    const noBookmarksDesc = container.querySelector(
        ".esri-bookmarks__no-bookmarks-description"
    );
    if (noBookmarksDesc) {
        noBookmarksDesc.textContent = t.noBookmarksDesc;
    }

    // Add Bookmark button (piercing shadow DOM)
    container.querySelectorAll("calcite-fab, calcite-button").forEach(btn => {
        const shadow = btn.shadowRoot;
        if (!shadow) return;

        const span = shadow.querySelector("span.content");
        if (span && span.textContent.trim() === "Add bookmark") {
            span.textContent = t.addBookmark;
        }

        //update the outer title
        if (btn.title === "Add bookmark") {
            btn.title = t.addBookmark;
        }
    });

    // Translate the Add Bookmark form
    const form = container.querySelector(".esri-bookmarks__form");
    if (form) {
        const titleLabel = form.querySelector("calcite-label");
        if (titleLabel) {
            titleLabel.childNodes[0].textContent = t.title;
            const input = titleLabel.querySelector("input");
            if (input) input.placeholder = t.enterTitle;
        }

        // Cancel button
        const cancelBtn = form.querySelector('calcite-button[type="button"]');
        if (cancelBtn && cancelBtn.shadowRoot) {
            const span = cancelBtn.shadowRoot.querySelector("span.content");
            if (span) span.textContent = t.cancel;
        }

        // Add button
        const addBtn = form.querySelector('calcite-button[type="submit"]');
        if (addBtn && addBtn.shadowRoot) {
            const span = addBtn.shadowRoot.querySelector("span.content");
            if (span) span.textContent = t.add;
        }
    }
}




