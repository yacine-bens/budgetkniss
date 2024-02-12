"use strict";
const applyBtn = document.querySelector("#apply-btn");
const resetBtn = document.querySelector("#reset-btn");
const budgetInput = document.querySelector("#budget");
const hideOtherItemsCheckbox = document.querySelector("#hide-other-items");
const hideNoPriceItemsCheckbox = document.querySelector("#hide-no-price");
const colorPicker = document.querySelector('#color-picker');
const budgetText = document.querySelector("#budget-text");
const invalidBudgetWarning = document.querySelector('#invalid-budget');
const unitSelect = document.querySelector('#unit');
const unit_da = document.querySelector('option[value="da"]');
const unit_mc = document.querySelector('option[value="mc"]');
const introElement = document.querySelector('#intro');
const navbar = document.querySelector('#navbar');
const container = document.querySelector('#flex-container');
const switchLangBtn = document.querySelector('#lang-button');
const fr_btn = document.querySelector('#fr-btn');
const en_btn = document.querySelector('#en-btn');
const ar_btn = document.querySelector('#ar-btn');
const languageElements = {
    'fr': document.querySelectorAll('.fr'),
    'en': document.querySelectorAll('.en'),
    'ar': document.querySelectorAll('.ar'),
};
const languageParams = {
    'fr': {
        placeholder: "Entrer votre budget",
        lang: "La langue",
        size: "20px",
        fontSize: "18px",
        dir: "ltr",
        align: "flex-start",
        option1: "Dinar",
        option2: "Million Centime"
    },
    'en': {
        placeholder: "Enter your budget",
        lang: "Language",
        size: "20px",
        fontSize: "18px",
        dir: "ltr",
        align: "flex-start",
        option1: "Dinar",
        option2: "Million Cent"
    },
    'ar': {
        placeholder: "أدخل ميزانيتك",
        lang: "اللغة",
        size: "22px",
        fontSize: "18px",
        dir: "rtl",
        align: "flex-end",
        option1: "دينار",
        option2: "مليون سنتيم"
    },
};
let currentLanguage = 'fr';
let unitText = ' DA';
let undefinedBudgetText = 'Pas définis';
let isNavbarOpen = false;
navbar.style.width = "0px";
window.onload = () => {
    initialize();
    hideIntro();
};
applyBtn.onclick = async () => {
    const unit = unitSelect.value;
    const color = colorPicker.value;
    const isHideOtherItems = hideOtherItemsCheckbox.checked;
    const isHideNoPriceItems = hideNoPriceItemsCheckbox.checked;
    let budget = 0;
    // Invalid Input
    if (isNaN(parseFloat(budgetInput.value))) {
        invalidBudgetWarning.style.visibility = "visible";
        budgetInput.style.border = "solid 3px red";
        budgetInput.value = '';
        return;
    }
    else {
        if (parseFloat(budgetInput.value) == 0) {
            invalidBudgetWarning.style.visibility = "visible";
            budgetInput.style.border = "solid 3px red";
            return;
        }
        else {
            invalidBudgetWarning.style.visibility = "hidden";
            budgetInput.style.border = "";
            budget = (unit == 'da') ? parseInt(budgetInput.value) : parseFloat(budgetInput.value) * 10000;
            budgetText.textContent = budget + unitText;
        }
    }
    await setStorage({ color, budget, isHideOtherItems, isHideNoPriceItems, unit, 'language': currentLanguage });
    await sendMessage({ todo: "applyBudget" });
};
resetBtn.onclick = async () => {
    budgetInput.value = '';
    budgetInput.style.border = '';
    invalidBudgetWarning.style.visibility = "hidden";
    hideOtherItemsCheckbox.checked = false;
    hideNoPriceItemsCheckbox.checked = false;
    colorPicker.value = '#FFFF00';
    colorPicker.setAttribute('style', getColorPickerStyle('#FFFF00'));
    budgetText.textContent = undefinedBudgetText;
    unitSelect.selectedIndex = 0;
    await setStorage({
        'budget': 0,
        'isHideOtherItems': false,
        'isHideNoPriceItems': false,
        'unit': 'da',
        'color': '#FFFF00',
    });
    await sendMessage({ todo: "resetBudget" });
};
switchLangBtn.onclick = () => { isNavbarOpen ? hideNavBar() : showNavbar(); };
container.onclick = () => { hideNavBar(); };
fr_btn.onclick = () => { langBtnClick('fr'); };
en_btn.onclick = () => { langBtnClick('en'); };
ar_btn.onclick = () => { langBtnClick('ar'); };
const initialize = async () => {
    const prefs = await getStorage(['budget', 'isHideOtherItems', 'isHideNoPriceItems', 'color', 'unit', 'language']);
    colorPicker.value = prefs.color || '#FFFF00';
    colorPicker.setAttribute('style', getColorPickerStyle(prefs.color || '#FFFF00'));
    hideOtherItemsCheckbox.checked = prefs.isHideOtherItems || false;
    hideNoPriceItemsCheckbox.checked = prefs.isHideNoPriceItems || false;
    unitSelect.selectedIndex = (prefs.unit === 'da') ? 0 : 1;
    currentLanguage = prefs.language || 'fr';
    switch (currentLanguage) {
        case "fr":
            unitText = " DA";
            undefinedBudgetText = "Pas définis";
            switchLang('fr');
            break;
        case "en":
            unitText = " DA";
            undefinedBudgetText = "Undefined";
            switchLang('en');
            break;
        case "ar":
            unitText = " دج ";
            undefinedBudgetText = "غير معين";
            switchLang('ar');
            break;
    }
    if (prefs.budget > 0) {
        budgetText.textContent = prefs.budget + unitText;
        budgetInput.value = (prefs.unit === 'da') ? prefs.budget : prefs.budget / 10000;
    }
    else {
        budgetText.textContent = undefinedBudgetText;
    }
};
const switchLang = (lang) => {
    budgetInput.placeholder = languageParams[lang].placeholder;
    switchLangBtn.innerText = languageParams[lang].lang;
    switchLangBtn.style.fontSize = languageParams[lang].size;
    applyBtn.style.fontSize = languageParams[lang].fontSize;
    resetBtn.style.fontSize = languageParams[lang].fontSize;
    container.style.alignItems = languageParams[lang].align;
    unit_da.innerText = languageParams[lang].option1;
    unit_mc.innerText = languageParams[lang].option2;
    switchLangDisplay(lang);
    unitSelect.style.direction = languageParams[lang].dir;
    hideNavBar();
};
const switchLangDisplay = (currentLang) => {
    let display;
    Object.keys(languageElements).forEach(lang => {
        display = (lang === currentLang) ? 'inline' : 'none';
        languageElements[lang].forEach(elm => { elm.style.display = display; });
    });
};
const langBtnClick = async (lang) => {
    if (currentLanguage != lang) {
        navbar.style.width = "100%";
        currentLanguage = lang;
        await setStorage({ 'language': currentLanguage });
        setTimeout(switchLang.bind(null, lang), 500);
        setTimeout(initialize, 500);
    }
    else {
        hideNavBar();
    }
};
const hideNavBar = () => {
    navbar.style.width = "0px";
    isNavbarOpen = false;
};
const showNavbar = () => {
    navbar.style.width = "60%";
    isNavbarOpen = true;
};
const hideIntro = () => {
    introElement.style.opacity = "0%";
    setTimeout(() => {
        introElement.style.display = "none";
    }, 1000);
};
const getColorPickerStyle = (clr) => {
    return "background-image: linear-gradient(to right, " + clr + " 0%, " + clr + " 30px, rgba(0, 0, 0, 0) 31px, rgba(0, 0, 0, 0) 100%), url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAAAU0lEQVRIS2OcOXPmfwY84OzZs/ikGYyNjfHK49KfnJzMsH379uWMow4YDYHREBjwEEhLS8NbDpCbz2GFAy79Tk5ODEuXLl3OOOqA0RAYDYGBDgEA8g6qcfRT/m4AAAAASUVORK5CYII=\") !important; background-position: left top, left top !important; background-size: auto, 32px 16px !important; background-repeat: repeat-y, repeat-y !important; background-origin: padding-box, padding-box !important; padding-left: 40px !important;";
};
const getCurrentTab = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
};
const sendMessage = async (message) => {
    const tab = await getCurrentTab();
    await chrome.tabs.sendMessage(tab.id, message);
};
const setStorage = async (prefs) => {
    await chrome.storage.local.set(prefs);
};
const getStorage = async (keys) => {
    return await chrome.storage.local.get(keys);
};
