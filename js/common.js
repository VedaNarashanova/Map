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
    const currentFlagDiv = document.getElementById("current-flag");

    if (!languageSelect || !currentFlagDiv) return;

    const defaultLang = "en";

    // Check if sessionStorage has a language (user navigated between pages)
    const savedLang = sessionStorage.getItem("selectedLanguage") || defaultLang;
    languageSelect.value = savedLang;
    translatePage(savedLang);
    updateFlag(savedLang);
    // translateWidgets(savedLang);
    // Update language while navigating
    languageSelect.addEventListener("change", () => {
        const lang = languageSelect.value;
        sessionStorage.setItem("selectedLanguage", lang);
        translatePage(lang);
        // translateWidgets(lang)
        updateFlag(lang);
        setTimeout(() => translateWidgets(lang), 700);
    });
    function updateFlag(lang) {
        currentFlagDiv.innerHTML = `<img src="${flagImages[lang]}" alt="${lang} flag" style="width:24px;height:16px;">`;
    }
});


    // const savedLang = localStorage.getItem("selectedLanguage") || "en";
    // languageSelect.value = savedLang;
    // translatePage(savedLang);

    // Add event listener
    // languageSelect.addEventListener("change", () => {
    //     const lang = languageSelect.value;
    //     localStorage.setItem("selectedLanguage", lang);
    //     translatePage(lang);
    // });
// });

loadHTML('footer', 'footer.html');




//Translation ------------------------------------------------------------------------
function translatePage(lang){
    // Translate inner text
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.innerHTML = translations[lang][key]; // use innerHTML so icons stay
        // el.textContent = translations[lang][key];
    });

    // Translate placeholders
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
        Home:"Home <i class=\"fas fa-house\"></i>",
        video:"Video  <i class=\"fas fa-video\"></i>",
        contact:"Contact <i class=\"fas fa-envelope\"></i>",
        read_more_policy:"Read more about our Privacy Policy",
        read_more_service:"Read more about our Terms of Service",
        read_more_contact:"If you have any question please Contact us",
        english:"English",
        macedonian:"Macedonian",
        albanian:"Albanian",
        getInTouch:"Get in Touch",
        your_name:"Your name",
        your_email:"Your email",
        your_message:"Your message",
        submit:"Submit",
        Adress:"Adress  <i class=\"fas fa-map-marker-alt\"></i>",
        street:"Boulevard Saint Kliment Ohridski 58b/2-4 MK",
        phone:"Phone Number <i class=\"fas fa-phone\"></i>",
        hours:"Working Hours <i class=\"fas fa-clock\"></i>",
        mon:"Mon-Fri: 9–17",
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
        elevation: "Elevation Profile",
        zoomin:"Zoom in",
        zoomout:"Zoom out",
        Footer:"If you have any problems, feel free to contact us at the phone number: 071/234567 or on social media:"

    },
    mk:{
        id:"ИД  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        name:"Име  <i class=\"fas fa-arrow-up sort-arrow\"></i>",
        adress:"Адреса",
        search_placeholder:"Пребарај според име",
        search: 'Пребарај <i class="fas fa-magnifying-glass"></i>',
        gallery:"Галерија  <i class=\"fas fa-images\"></i>",
        previous:"<i class=\"fas fa-chevron-left\"></i> Претходно",
        next:"Следно <i class=\"fas fa-chevron-right\"></i>",
        Home:"Дома <i class=\"fas fa-house\"></i>",
        video:"Видео  <i class=\"fas fa-video\"></i>",
        contact:"Контакт  <i class=\"fas fa-envelope\"></i>",
        read_more_policy:"Прочитајте повеже за нашата полиса за приватност",
        read_more_service:"Прочитајте повеже за нашите услови за користење.",
        read_more_contact:"Ако имаш прашања, ве замолуваме исконтактирајте не.",
        english:"Англиски",
        macedonian:"Македонски",
        albanian:"Албански",
        getInTouch:"Стапете во контакт",
        your_name:"Вашето има",
        your_email:"Вашиот мејл",
        your_message:"Вашата порака",
        submit:"Потврди",
        Adress:"Адреса <i class=\"fas fa-map-marker-alt\"></i>",
        street:"Булевар Свети Климент Охридски 58б/2-4 MK  ",
        phone:"Телефонски Број <i class=\"fas fa-phone\"></i>",
        hours:"Работни Часови <i class=\"fas fa-clock\"></i>",
        mon:"Пон-Пет: 9–17",
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
        Footer:"Ако имате какви било проблеми, слободно контактирајте нè на телефонскиот број: 071/234567 или преку социјалните мрежи:"
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
        Home:"Ballina <i class=\"fas fa-house\"></i>",
        video:"Video  <i class=\"fas fa-video\"></i>",
        contact:"Kontakt <i class=\"fas fa-envelope\"></i>",
        read_more_policy:"Lexo më shumë rreth Politikës së Privatësisë",
        read_more_service:"Lexo më shumë rreth Kushteve të Shërbimit",
        read_more_contact:"Nëse keni ndonjë pyetje, ju lutem na kontaktoni",
        english:"Anglisht",
        macedonian:"Maqedonisht",
        albanian:"Shqip",
        getInTouch:"Na kontaktoni",
        your_name:"Emri juaj",
        your_email:"Email-i juaj",
        your_message:"Mesazhi juaj",
        submit:"Dërgo",
        Adress:"Adresa <i class=\"fas fa-map-marker-alt\"></i>",
        street:"Bulevardi Shën Kliment Ohrit 58b/2-4 MK  ",
        phone:"Numri i telefonit <i class=\"fas fa-phone\"></i>",
        hours:"Orari i punës <i class=\"fas fa-clock\"></i>",
        mon:"Hën–Pre: 9–17",
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
        Footer:"Nëse keni ndonjë problem, mos hezitoni të na kontaktoni në numrin e telefonit: 071/234567 ose në rrjetet sociale:"

    }
}

const flagImages = {
    en: "../images/englis.webp",
    mk: "../images/macedonia.webp",
    sq: "../images/alb.svg"
};




