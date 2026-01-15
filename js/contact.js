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
    en: {
        // Header
        Home: 'Home <i class="fas fa-house small-icon"></i>',
        video: 'Video <i class="fas fa-video small-icon"></i>',
        contact: 'Contact <i class="fas fa-envelope small-icon"></i>',
        english: "English",
        macedonian: "Macedonian",
        albanian: "Albanian",

        // Footer
        Footer: "If you have any problems, feel free to contact us at the phone number: 071/234567 or on social media:",
        Footer2:"© 2025 Your Website Name. All rights reserved.",
        // Contact form
        getInTouch: "Get in touch",
        your_name: "Your Name",
        your_email: "Your Email",
        your_message: "Your Message",
        submit: "Submit <i class=\"fas fa-check\"></i>",
        Adress: "Address <i class=\"fas fa-map-marker-alt\"></i>",
        street: "Boulevard Saint Kliment Ohridski 58b/2-4 MK",
        phone: "Phone Number <i class=\"fas fa-phone\"></i>",
        hours: "Working Hours <i class=\"fas fa-clock\"></i>",
        mon: "Mon–Fri: 8:30–16:30"
    },
    mk: {
        // Header
        Home: 'Дома <i class="fas fa-house small-icon"></i>',
        video: 'Видео <i class="fas fa-video small-icon"></i>',
        contact: 'Контакт <i class="fas fa-envelope small-icon"></i>',
        english: "Англиски",
        macedonian: "Македонски",
        albanian: "Албански",

        // Footer
        Footer: "Ако имате какви било проблеми, слободно контактирајте нè на телефонскиот број: 071/234567 или преку социјалните мрежи:",
        Footer2:"© 2025 Име на вашата веб-страница. Сите права се задржани.",
        // Contact form
        getInTouch: "Стапете во контакт",
        your_name: "Вашето име",
        your_email: "Вашиот е-маил",
        your_message: "Вашата порака",
        submit: "Потврди <i class=\"fas fa-check\"></i>",
        Adress: "Адреса <i class=\"fas fa-map-marker-alt\"></i>",
        street: "Булевар Свети Климент Охридски 58б/2-4 MK",
        phone: "Телефонски Број <i class=\"fas fa-phone\"></i>",
        hours: "Работни Часови <i class=\"fas fa-clock\"></i>",
        mon: "Пон–Пет: 8:30–16:30"
    },
    sq: {
        // Header
        Home: 'Kryefaqja <i class="fas fa-house small-icon"></i>',
        video: 'Video <i class="fas fa-video small-icon"></i>',
        contact: 'Kontakt <i class="fas fa-envelope small-icon"></i>',
        english: "Anglisht",
        macedonian: "Maqedonisht",
        albanian: "Shqip",

        // Footer
        Footer: "Nëse keni ndonjë problem, mos hezitoni të na kontaktoni në numrin e telefonit: 071/234567 ose në rrjetet sociale:",
        Footer2:"© 2025 Emri i faqes suaj të internetit. Të gjitha të drejtat e rezervuara.",
        // Contact form
        getInTouch: "Na kontaktoni",
        your_name: "Emri juaj",
        your_email: "Email-i juaj",
        your_message: "Mesazhi juaj",
        submit: "Dërgo <i class=\"fas fa-check\"></i>",
        Adress: "Adresa <i class=\"fas fa-map-marker-alt\"></i>",
        street: "Bulevardi Shën Kliment Ohrit 58b/2-4 MK",
        phone: "Numri i telefonit <i class=\"fas fa-phone\"></i>",
        hours: "Orari i punës <i class=\"fas fa-clock\"></i>",
        mon: "Hën–Pre: 8:30–16:30"
    }
}

const flagImages = {
    en: "../images/englis.webp",
    mk: "../images/macedonia.webp",
    sq: "../images/alb.svg"
};




