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
    // const currentFlagDiv = document.getElementById("current-flag");

    // if (!languageSelect || !currentFlagDiv) return;
    if (!languageSelect) return;
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
        updateFlag(lang);
        // setTimeout(() => translateWidgets(lang), 700);
    });
    // function updateFlag(lang) {
    //     currentFlagDiv.innerHTML = `<img src="${flagImages[lang]}" alt="${lang} flag" style="width:24px;height:16px;">`;
    // }
    function updateFlag(lang) {
        const flagDiv = document.getElementById("current-flag");
        if (!flagDiv) return;

        flagDiv.innerHTML = `
        <img src="${flagImages[lang]}"
             alt="${lang} flag"
             style="width:24px;height:16px;">`;
    }
});



// loadHTML('footer', 'footer.html');
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
        el.innerHTML = translations[lang][key]; // use innerHTML so icons stay
        // el.textContent = translations[lang][key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = translations[lang][key];
    });
}
const translations={
    en:{
        Home: 'Home <i class="fas fa-house small-icon"></i>',
        video: 'Video <i class="fas fa-video small-icon"></i>',
        contact: 'Contact <i class="fas fa-envelope small-icon"></i>',
        Footer:"If you have any problems, feel free to contact us at the phone number: 071/234567 or on social media:",
        english:"English",
        macedonian:"Macedonian",
        albanian:"Albanian",
        Footer2:"© 2025 Your Website Name. All rights reserved.",

    },
    mk:{
        Home: 'Дома <i class="fas fa-house small-icon"></i>',
        video: 'Видео <i class="fas fa-video small-icon"></i>',
        contact: 'Контакт <i class="fas fa-envelope small-icon"></i>',
        Footer:"Ако имате какви било проблеми, слободно контактирајте нè на телефонскиот број: 071/234567 или преку социјалните мрежи:",
        english:"Англиски",
        macedonian:"Македонски",
        albanian:"Албански",
        Footer2:"© 2025 Име на вашата веб-страница. Сите права се задржани.",

    },
    sq: {
        Home: 'Kryefaqja <i class="fas fa-house small-icon"></i>',
        video: 'Video <i class="fas fa-video small-icon"></i>',
        contact: 'Kontakt <i class="fas fa-envelope small-icon"></i>',
        Footer:"Nëse keni ndonjë problem, mos hezitoni të na kontaktoni në numrin e telefonit: 071/234567 ose në rrjetet sociale:",
        english:"Anglisht",
        macedonian:"Maqedonisht",
        albanian:"Shqip",
        Footer2:"© 2025 Emri i faqes suaj të internetit. Të gjitha të drejtat e rezervuara.",
    }
}

const flagImages = {
    en: "../images/englis.webp",
    mk: "../images/macedonia.webp",
    sq: "../images/alb.svg"
};




