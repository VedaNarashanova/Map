function loadHTML(id, url) {
    return fetch(url)//fetches the html file
        .then(response => response.text())//then read the text
        .then(data => {
            document.getElementById(id).innerHTML = data;//put the html inside the element with the given id
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}



loadHTML('header', 'header.html').then(() => {
    const languageSelect = document.getElementById("translate");
    const currentFlagDiv = document.getElementById("current-flag");

    if (!languageSelect || !currentFlagDiv) return; //stop the function if either is missing

    const defaultLang = "en";

    // Check if sessionStorage has a language (user navigated between pages)
    const savedLang = sessionStorage.getItem("selectedLanguage") || defaultLang;
    languageSelect.value = savedLang;
    translatePage(savedLang);
    // updateFlag(savedLang);
    requestAnimationFrame(() => updateFlag(savedLang));
    // translateWidgets(savedLang);
    // translatePrintWidget(savedLang)

    languageSelect.addEventListener("change", () => {
        const lang = languageSelect.value;
        sessionStorage.setItem("selectedLanguage", lang);
        translatePage(lang);
        translateWidgets(lang)
        translatePrintWidget(lang)
        translateBookmarksWidget(lang)
        // translateDistanceWidget(lang)
        // translateMapOnlySection(lang)
        // translatePrintWidgetSticky(lang)
        updateFlag(lang);
        setTimeout(() => translateWidgets(lang), 700);
    });
    function updateFlag(lang) {
        currentFlagDiv.innerHTML = `<img src="${flagImages[lang]}" alt="${lang} flag" style="width:24px;height:16px;">`;
    }

});



loadHTML('footer', 'footer.html').then(() =>{
    const languageSelect = document.getElementById("translate");

    if (!languageSelect) return;
    const defaultLang = "en";

    // Check if sessionStorage has a language (user navigated between pages)
    const savedLang = sessionStorage.getItem("selectedLanguage") || defaultLang;
    languageSelect.value = savedLang;
    translatePage(savedLang);

    // Update language while navigating
    languageSelect.addEventListener("change", () => {
        const lang = languageSelect.value;
        sessionStorage.setItem("selectedLanguage", lang);
        translatePage(lang);

    });
});


//Translation ------------------------------------------------------------------------
function translatePage(lang){
    // Translate inner text
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.innerHTML = translations[lang][key]; // use innerHTML so icons stay, land-which language, key- which word
        // el.textContent = translations[lang][key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = translations[lang][key];
    });
}
const translations={
    en:{
        id:"ID  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        name:"Name  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        adress:"Adress  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        search_placeholder:"Search by name",
        search: 'Search <i class="fas fa-magnifying-glass"></i>',
        gallery:"Gallery  <i class=\"fas fa-images\"></i>",
        previous:"Previous <i class=\"fas fa-chevron-left\"></i>",
        next:"Next <i class=\"fas fa-chevron-right\"></i>",
        Home: "Home <i class=\"fas fa-house small-icon\"></i>",
        video: "Video <i class=\"fas fa-video small-icon\"></i>",
        contact: "Contact <i class=\"fas fa-envelope small-icon\"></i>",
        read_more_policy:"Read more about our Privacy Policy",
        read_more_service:"Read more about our Terms of Service",
        read_more_contact:"If you have any question please Contact us",
        english:"English",
        macedonian:"Macedonian",
        albanian:"Albanian",
        pdf:"PDF <i class=\"fas fa-file-pdf\"></i>",
        excel:"EXCEL <i class=\"fas fa-file-excel\"></i>",
        export:"Export in:",
        compass: "Compass",
        home: "Home",
        basemap: "Base Map",
        visibility: "Visibility",
        bookmarks: "Bookmarks",
        locate: "My Location",
        fullscreen: "Fullscreen",
        measurement: "Measurement",
        print: "Print",
        elevation: "Elevation",
        zoomin:"Zoom in",
        zoomout:"Zoom out",
        xyConversionOutput:"xy conversion output",
        feature:"Select feature",
        selectrectangle:"Select by rectangle",
        lasso:"Select by lasso",
        point:"Draw a point",
        polyline:"Draw a polyline",
        polygon:"Draw a polygon",
        rectangle:"Draw a rectangle",
        circle:"Draw a circle",
        undo:"Undo",
        redo:"Redo",
        settings:"Settings",
        Footer:"If you have any problems, feel free to contact us at the phone number: 071/234567 or on social media:",
        Footer2:"© 2025 Your Website Name. All rights reserved.",
        epxand:"Expand",



        layout: "Layout",
        mapOnly: "Map only",
        title: "Title",
        selectTemplate: "Set template",
        // letterAnsiA_landscape: "Писмо ANSI A хоризонтално",
        // A3_landscape: "A3 хоризонтално",
        // PDF: "PDF",
        // JPG: "JPG",
        exportBtn: "Извези",
        advancedOptions: "Advanced options",
        exportedFiles: "Exported files",
        fileNameLabel: "File name",
        fileNamePlaceholder: "File name",

        fileFormatPlaceholder: "Select format",


        titleLabel:"Title",
        titlePlaceholder:"Title of file",
        templateLabel:"Template",
        fileFormatLabel: "File format",
        selectFormat: "Select format",
        exportedFilesHint: "Your exported files will appear here.",


        width: "Width",
        height: "Height",

        bookmarksTitle: "Bookmarks",
        collapse: "Collapse",
        options: "Options",
        noBookmarks: "No bookmarks",
        noBookmarksDesc: "Add bookmarks to your map and they will appear here.",
        addBookmark: "Add bookmark",
        titleBookmark: "Title",
        enterTitle: "Enter a title",
        cancel: "Cancel",
        add: "Add",


        hint: "Start to measure by clicking in the map to place your first point",
        unit: "Unit",
        distance: "Distance",
        newMeasurement: "New measurement",
        units: {
            meters: "Meters",
            kilometers: "Kilometers"
        }

    },
    mk:{
        id:"ИД  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        name:"Име  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        adress:"Адреса <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        search_placeholder:"Пребарај според име",
        search: 'Пребарај <i class="fas fa-magnifying-glass"></i>',
        gallery:"Галерија  <i class=\"fas fa-images\"></i>",
        previous:"<i class=\"fas fa-chevron-left\"></i> Претходно",
        next:"Следно <i class=\"fas fa-chevron-right\"></i>",
        Home: 'Дома <i class="fas fa-house small-icon"></i>',
        video: 'Видео <i class="fas fa-video small-icon"></i>',
        contact: 'Контакт <i class="fas fa-envelope small-icon"></i>',
        read_more_policy:"Прочитајте повеже за нашата полиса за приватност",
        read_more_service:"Прочитајте повеже за нашите услови за користење.",
        read_more_contact:"Ако имаш прашања, ве замолуваме исконтактирајте не.",
        english:"Англиски",
        macedonian:"Македонски",
        albanian:"Албански",
        pdf:"PDF <i class=\"fas fa-file-pdf\"></i>",
        excel:"EXCEL <i class=\"fas fa-file-excel\"></i>",
        export:"Извези во:",
        bookmarks: "Обележувачи",
        compass: "Компас",
        home: "Почетен екран",
        basemap: "Основна мапа",
        visibility: "Видливост",
        locate: "Моја локација",
        fullscreen: "Целосен екран",
        measurement: "Мерки",
        print: "Испринтај",
        elevation: "Елевиран профил",
        zoomin:"Зумирај",
        zoomout:"Одзумирај",
        xyConversionOutput:"xy излез за конверзија",
        feature: "Избери објект",
        selectrectangle: "Избери со правоаголник",
        lasso: "Избери со ласо",
        point: "Насликај точка",
        polyline: "Насликај линија",
        polygon: "Насликај полигонот",
        rectangle: "Насликај правоаголник",
        circle: "Насликај круг",
        undo: "Поништи",
        redo: "Повтори",
        settings: "Подесувања",
        Footer:"Ако имате какви било проблеми, слободно контактирајте нè на телефонскиот број: 071/234567 или преку социјалните мрежи:",
        Footer2:"© 2025 Име на вашата веб-страница. Сите права се задржани.",
        epxand:"Прошири",


        layout: "Распоред",
        mapOnly: "Само мапа",
        title: "Наслов",
        selectTemplate: "Избери шаблон",
        letterAnsiA_landscape: "Писмо ANSI A хоризонтално",
        A3_landscape: "A3 хоризонтално",
        PDF: "PDF",
        JPG: "JPG",
        exportBtn: "Извези",
        advancedOptions: "Напредни опции",
        exportedFiles: "Извезени датотеки",
        fileNameLabel: "Име на датотека",
        fileNamePlaceholder: "Име на датотека",
        fileFormatPlaceholder: "Избери формат",


        titleLabel:"Наслов",
        titlePlaceholder:"Наслов на датотека",
        templateLabel:"Темплејт",
        fileFormatLabel: "Формат на датотека",
        selectFormat: "Избери формат",
        exportedFilesHint: "Тука ќе се прикажат извезените датотеки.",
        width:"Ширина",
        height:"Висина",

        bookmarksTitle: "Обележувачи",
        collapse: "Собери",
        options: "Опции",
        noBookmarks: "Нема обележувачи",
        noBookmarksDesc: "Додајте обележувачи на мапата и тие ќе се појават тука.",
        addBookmark: "Додај обележувач",
        titleBookmark: "Наслов",
        enterTitle: "Внесете наслов",
        cancel: "Откажи",
        add: "Додади",



        hint: "Започнете со мерење со кликнување на мапата за да ја поставите првата точка",
        unit: "Единица",
        distance: "Должина",
        newMeasurement: "Ново мерење",
        units: {
            meters: "Метри",
            kilometers: "Километри"
        }


    },
    sq: {
        id:"ID  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        name:"Emri  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        adress:"Adresa  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        search_placeholder:"Kërko sipas emrit",
        search: "Kërko <i class=\"fas fa-magnifying-glass\"></i>",
        gallery:"Galeri  <i class=\"fas fa-images\"></i>",
        previous:"Prapa <i class=\"fas fa-chevron-left\"></i>",
        next:"Para <i class=\"fas fa-chevron-right\"></i>",
        Home: 'Kryefaqja <i class="fas fa-house small-icon"></i>',
        video: 'Video <i class="fas fa-video small-icon"></i>',
        contact: 'Kontakt <i class="fas fa-envelope small-icon"></i>',
        read_more_policy:"Lexo më shumë rreth Politikës së Privatësisë",
        read_more_service:"Lexo më shumë rreth Kushteve të Shërbimit",
        read_more_contact:"Nëse keni ndonjë pyetje, ju lutem na kontaktoni",
        english:"Anglisht",
        macedonian:"Maqedonisht",
        albanian:"Shqip",
        pdf:"PDF <i class=\"fas fa-file-pdf\"></i>",
        excel:"EXCEL <i class=\"fas fa-file-excel\"></i>",
        export:"Eksporto në:",
        compass: "Busull",
        home: "Ballina",
        basemap: "Harta Bazë",
        visibility: "Dukshmëria",
        bookmarks: "Faqerojtje",
        locate: "Vendndodhja ime",
        fullscreen: "Ekran i Plotë",
        measurement: "Matje",
        print: "Printo",
        elevation: "Profili i Lartësisë",
        zoomin:"Zmadho",
        zoomout:"Zvogëlo",
        xyConversionOutput:"dalja e konvertimit xy",
        feature: "Zgjidh veçorinë",
        selectrectangle: "Zgjidh me drejtkëndësh",
        lasso: "Zgjidh me lasso",
        point: "Vizato një pikë",
        polyline: "Vizato një linjë",
        polygon: "Vizato një poligon",
        rectangle: "Vizato një drejtkëndësh",
        circle: "Vizato një rreth",
        undo: "Anulo",
        redo: "Rikthe",
        settings: "Cilësimet",
        Footer:"Nëse keni ndonjë problem, mos hezitoni të na kontaktoni në numrin e telefonit: 071/234567 ose në rrjetet sociale:",
        Footer2:"© 2025 Emri i faqes suaj të internetit. Të gjitha të drejtat e rezervuara.",
        layout: "Paraqitja",
        mapOnly: "Vetëm harta",
        title:"titull",
        titleLabel: "Titulli",
        titlePlaceholder: "Titulli i skedarit",

        templateLabel: "Shabllon",
        selectTemplate: "Zgjidh shabllon",

        fileNameLabel: "Emri i skedarit",
        fileNamePlaceholder: "Emri i skedarit",

        fileFormatLabel: "Formati i skedarit",
        selectFormat: "Zgjidh format",
        fileFormatPlaceholder: "Zgjidh format",

        advancedOptions: "Opsione të avancuara",

        exportedFiles: "Skedarët e eksportuar",
        exportedFilesHint: "Skedarët e eksportuar do të shfaqen këtu.",

        width: "Gjerësia",
        height: "Lartësia",

        bookmarksTitle: "Faqerojtës",
        collapse: "Mbyll",
        options: "Opsione",
        noBookmarks: "Nuk ka faqerojtës",
        noBookmarksDesc: "Shtoni faqerojtës në hartë dhe ato do të shfaqen këtu.",
        addBookmark: "Shto faqerojtës",
        titleBookmark: "Titull",
        enterTitle: "Shkruani një titull",
        cancel: "Anulo",
        add: "Shto",



        hint: "Filloni matjen duke klikuar në hartë për të vendosur pikën tuaj të parë",
        unit: "Njësia",
        distance: "Distanca",
        newMeasurement: "Matje e re",
        units: {
            meters: "Metra",
            kilometers: "Kilometra"
        }
    }
}

const flagImages = {
    en: "../images/englis.webp",
    mk: "../images/macedonia.webp",
    sq: "../images/alb.svg"
};




