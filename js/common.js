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
        id:"ID",
        name:"Name",
        adress:"Adress",
        search_placeholder:"Search by name",
        search: 'Search <i class="fas fa-magnifying-glass"></i>',
        gallery:"Gallery  <i class=\"fas fa-images\"></i>",
        previous:"Previous <i class=\"fas fa-chevron-left\"></i>",
        next:"Next <i class=\"fas fa-chevron-right\"></i>",
        Home:"Home",
        video:"Video",
        contact:"Contact",
        read_more_policy:"Read more about our Privacy Policy",
        read_more_service:"Read more about our Terms of Service",
        read_more_contact:"If you have any question please Contact us",
        english:"English",
        macedonian:"Macedonian",
        bookmarks: "Bookmarks",
        compass: "Compass",
        home: "Home",
        basemap: "Base Map",
        visibility: "Visibility",
        getInTouch:"Get in Touch",
        your_name:"Your name",
        your_email:"Your email",
        your_message:"Your message",
        submit:"Submit",
        adress:"Adress",
        street:"Boulevard Saint Kliment Ohridski 58b/2-4 MK",
        phone:"Phone Number",
        hours:"Working Hours",
        mon:"Mon-Fri: 9–17",
    },
    mk:{
        id:"ИД",
        name:"Име",
        adress:"Адреса",
        search_placeholder:"Пребарај според име",
        search: 'Пребарај <i class="fas fa-magnifying-glass"></i>',
        gallery:"Галерија  <i class=\"fas fa-images\"></i>",
        previous:"<i class=\"fas fa-chevron-left\"></i> Претходно",
        next:"Следно <i class=\"fas fa-chevron-right\"></i>",
        Home:"Дома",
        video:"Видео",
        contact:"Контакт",
        read_more_policy:"Прочитајте повеже за нашата полиса за приватност",
        read_more_service:"Прочитајте повеже за нашите услови за користење.",
        read_more_contact:"Ако имаш прашања, ве замолуваме исконтактирајте не.",
        english:"Англиски",
        macedonian:"Македонски",
        bookmarks: "Обележувачи",
        compass: "Компас",
        home: "Почетен екран",
        basemap: "Основна мапа",
        visibility: "Видливост",
        getInTouch:"Стапете во контакт",
        your_name:"Вашето има",
        your_email:"Вашиот мејл",
        your_message:"Вашата порака",
        submit:"Потврди",
        adress:"Адреса",
        street:"Булевар Свети Климент Охридски 58б/2-4 MK",
        phone:"Телефонски Број",
        hours:"Работни Часови",
        mon:"Пон-Пет: 9–17",
    }
}
