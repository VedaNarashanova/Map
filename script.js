function loadHTML(id, url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}
// Load header and footer
// loadHTML('header', 'header.html');

loadHTML('header', 'header.html').then(() => {
    const languageSelect = document.getElementById("translate");

    languageSelect.addEventListener("change", () => {
        translatePage(languageSelect.value);
    });
});
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
    // const pageItems=kladilnici.slice(start,end);
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




//search logic ---------------------------------------
const searchInput=document.getElementById("search")
const searchBtn=document.getElementById("search-btn")

searchBtn.addEventListener("click",()=>{
    const input=searchInput.value.trim().toLowerCase()
    if(!input){
        filteredKladilnici=[];
        currentPage=1;
        renderPage();
        return
    }
    filteredKladilnici=kladilnici.filter(k=>
        k.name.toLowerCase().includes(input)
    );
    currentPage=1;
    renderPage();
})


//math for converting coordinates into longtitude and latitude  ------------------------------------------------------------------
function mercatorToLatLon(x, y) {
    const R = 6378137; // radius of Earth in meters
    const lon = x / R * (180 / Math.PI);
    const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI/2) * (180 / Math.PI);
    return { lat, lon };
}


//for images slider -------------------------------------------------------------------------------------------------------------
// const images=[
//     "images/k1.jpg",
//     "images/k2.jpg",
//     "images/k3.jpg",
//     "images/k4.jpg",
//     "images/k5.jpg",
//     "images/k6.jpg"
// ]
// let currentIndex=0;
//
// const sliderImage=document.getElementById("slider-image");
// const prevBtn=document.getElementById("prev-btn")
// const nextBtn=document.getElementById("next-btn")
// const openGallery=document.getElementById("gallery-btn")
//
// document.querySelector("#gallery-slider").style.display="none"
//
// openGallery.addEventListener("click", ()=>{
//     document.querySelector("#gallery-slider").style.display="block";
//     sliderImage.src=images[currentIndex];
// })
// nextBtn.addEventListener("click", ()=>{
//     currentIndex=(currentIndex+1)%images.length;
//     sliderImage.src=images[currentIndex];
// })
// prevBtn.addEventListener("click", ()=>{
//     currentIndex=(currentIndex-1+images.length)%images.length;
//     sliderImage.src=images[currentIndex];
// })
const slides=document.querySelectorAll(".slides img")
let slideIndex=0;
const slider=document.querySelector(".slider");
const galleryBtn=document.getElementById("gallery-btn")

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
    slider.style.display = "none";           // hide slider
    document.body.classList.remove("slider-active"); // remove gray overlay
}





//Translation ------------------------------------------------------------------------
function translatePage(lang){
    // Translate inner text
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = translations[lang][key];
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = translations[lang][key];
    });
}
const translations={
    en:{
        id:"ID",
        name:"Name",
        adress:"Adress",
        search_placeholder:"Search by name",
        search:"Search",
        gallery:"Gallery",
        previous:"Previous",
        next:"Next",
        home:"Home",
        video:"Video",
        contact:"Contact",
        read_more_policy:"Read more about our Privacy Policy",
        read_more_service:"Read more about our Terms of Service",
        read_more_contact:"If you have any question please Contact us"
    },
    mk:{
        id:"ИД",
        name:"Име",
        adress:"Адреса",
        search_placeholder:"Пребарај според име",
        search:"Пребарај",
        gallery:"Галерија",
        previous:"Претходно",
        next:"Следно",
        home:"Дома",
        video:"Видео",
        contact:"Контакт",
        read_more_policy:"Прочитајте повеже за нашата полиса за приватност",
        read_more_service:"Прочитајте повеже за нашите услови за користење.",
        read_more_contact:"Ако имаш прашања, ве замолуваме исконтактирајте не."
    }
}

