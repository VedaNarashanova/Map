function loadHTML(id, url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
}

loadHTML('header', 'header.html').then(() => {
    const languageSelect = document.getElementById("translate");

    languageSelect.addEventListener("change", () => {
        translatePage(languageSelect.value);
    });
});
loadHTML('footer', 'footer.html');


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
        Home:"Home",
        video:"Video",
        contact:"Contact",
        english:"English",
        macedonian:"Macedonian",
        getInTouch:"Get in Touch",
        your_name:"Your name",
        your_email:"Your email",
        your_message:"Your message",
        submit:"Submit",
        adress:"Adress",
        street:"123 Main Street",
        phone:"Phone Number",
        hours:"Working Hours",
        mon:"Mon-Fri: 9–17",
        read_more_policy:"Read more about our Privacy Policy",
        read_more_service:"Read more about our Terms of Service",
        read_more_contact:"If you have any question please Contact us",
    },
    mk:{
        Home:"Дома",
        video:"Видео",
        contact:"Контакт",
        english:"Англиски",
        macedonian:"Македонски",
        getInTouch:"Стапете во контакт",
        your_name:"Вашето има",
        your_email:"Вашиот мејл",
        your_message:"Вашата порака",
        submit:"Потврди",
        adress:"Адреса",
        street:"123 Главна Улица",
        phone:"Телефонски Број",
        hours:"Работни Часови",
        mon:"Пон-Пет: 9–17",
        read_more_policy:"Прочитајте повеже за нашата полиса за приватност",
        read_more_service:"Прочитајте повеже за нашите услови за користење.",
        read_more_contact:"Ако имаш прашања, ве замолуваме исконтактирајте не.",
    }
}
