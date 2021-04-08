var btn = document.querySelector("#btn");
var resetBtn = document.querySelector("#reset");
var textBox = document.querySelector("#budget");
var chkBox = document.querySelector("#hide");
var chkBox2 = document.querySelector("#hideNull");
var colorPicker = document.querySelector('#color-picker');
var budgetText = document.querySelector("#budgetText");
var unityElement = document.querySelector('#unity');
var invalid_input = document.querySelector('#invalid_input');
var current_language;
var unity_text;
var undefined_text;
var intro_element = document.querySelector('#intro');

var lang_button = document.querySelector('#lang_button');
var navbar = document.querySelector('#navbar');
var container = document.querySelector('#flex-container');
var fr_btn = document.querySelector('#fr_btn');
var en_btn = document.querySelector('#en_btn');
var ar_btn = document.querySelector('#ar_btn');
var fr_elements = document.querySelectorAll(".fr");
var en_elements = document.querySelectorAll(".en");
var ar_elements = document.querySelectorAll(".ar");
var unity_da = document.querySelector('option[value="da"]');
var unity_mc = document.querySelector('option[value="mc"]');
var index = 0;
var flex_container = document.querySelector('#flex-container');
var budget_input = textBox;
var clicked = false;
navbar.style.width = "0px";

window.onload = function(){
    initialize();
    hideIntro();
}

var fr_params = {
    placeholder : "Entrer votre budget",
    lang : "La langue",
    size : "20px",
    fontSize: "18px",
    dir: "ltr",
    align : "flex-start",
    option1 : "Dinar",
    option2 : "Million Centime"
}

var en_params = {
    placeholder : "Enter your budget",
    lang : "Language",
    size : "20px",
    fontSize: "18px",
    dir: "ltr",
    align : "flex-start",
    option1 : "Dinar",
    option2 : "Million Cent"
}

var ar_params = {
    placeholder : "أدخل ميزانيتك",
    lang : "اللغة",
    size : "22px",
    fontSize: "18px",
    dir: "rtl",
    align : "flex-end",
    option1 : "دينار",
    option2 : "مليون سنتيم"
}

function initialize(){
    chrome.storage.sync.get('color', function(colorTemp){
        if(colorTemp.color){
            colorPicker.value = colorTemp.color;
            colorPicker.style = getStyle(colorTemp.color);
        }
        else{
            colorPicker.value = "#FFFF00";
            colorPicker.style = getStyle("#FFFF00");
        }
    })
    chrome.storage.sync.get('hide', function(hideTemp){
        if(hideTemp.hide){
            chkBox.checked = hideTemp.hide;
        }
    })
    chrome.storage.sync.get('hideNull', function(hideNullTemp){
        if(hideNullTemp.hideNull){
            chkBox2.checked = hideNullTemp.hideNull;
        }
    })
    chrome.storage.sync.get('unity', function(unityTemp){
        if(unityTemp.unity){
            unityElement.selectedIndex = (unityTemp.unity == 'da') ? 0 : 1;
        }
        chrome.storage.sync.get('language', function(langTemp){
            if(langTemp.language){
                current_language = langTemp.language;
            }
            else{
                current_language = "fr";
            }
            switch(current_language){
                case "fr": unity_text = " DA"; undefined_text = "Pas définis"; switchLang(fr_params, fr_elements, en_elements, ar_elements, unityElement.selectedIndex); break;
                case "en": unity_text = " DA"; undefined_text = "Undefined"; switchLang(en_params, en_elements, fr_elements, ar_elements, unityElement.selectedIndex); break;
                case "ar": unity_text = " دج "; undefined_text = "غير معين"; switchLang(ar_params, ar_elements, fr_elements, en_elements, unityElement.selectedIndex); break;
            }
            chrome.storage.sync.get('budget', function(budgetTemp){
                if(budgetTemp.budget > 0){
                    budgetText.textContent = budgetTemp.budget + unity_text;
                    textBox.value = (unityTemp.unity == "da") ? budgetTemp.budget : budgetTemp.budget / 10000;
                }
                else{
                    budgetText.textContent = undefined_text;
                }
            })
        })
    })
}

btn.onclick = function(){
    var unity = unityElement.value;
    var color = colorPicker.value;
    var isHide = chkBox.checked;
    var isHideNull = chkBox2.checked;
    if(isNaN(parseFloat(textBox.value))){
        invalid_input.style.visibility = "visible";
        textBox.style.border = "solid 3px red";
        textBox.value = '';
        var budget;
    }
    else{
        if(parseFloat(textBox.value) == 0){
            invalid_input.style.visibility = "visible";
            textBox.style.border = "solid 3px red";
        }
        else{
            invalid_input.style.visibility = "hidden";
            textBox.style.border = "";
            textBox.value = parseFloat(textBox.value);
            var budget = (unity == 'da') ? parseInt(textBox.value) : parseFloat(textBox.value) * 10000;
        }
    }
    if(budget){
        budgetText.textContent = budget + unity_text;
    }
    chrome.storage.sync.set({'color': color});
    chrome.storage.sync.set({'budget': budget});
    chrome.storage.sync.set({'hide': isHide});
    chrome.storage.sync.set({'hideNull': isHideNull});
    chrome.storage.sync.set({'unity': unity});
    chrome.storage.sync.set({'language': current_language});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {todo: "applyBudget", budget: budget, hide: isHide, hideNull: isHideNull, color: color});
    })
}

resetBtn.onclick = function(){
    textBox.value = '';
    textBox.style.border = '';
    invalid_input.style.visibility = "hidden";
    chkBox.checked = false;
    chkBox2.checked = false;
    colorPicker.value = "#FFFF00";
    colorPicker.style = getStyle("#FFFF00");
    budgetText.textContent = undefined_text;
    unityElement.selectedIndex = 0;
    chrome.storage.sync.set({'budget': 0});
    chrome.storage.sync.set({'hide': false});
    chrome.storage.sync.set({'hideNull': false});
    chrome.storage.sync.set({'unity': 'da'});
    chrome.storage.sync.set({'color': '#FFFF00'});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {todo: "resetBudget"});
    })
}

function getStyle(clr){
    return "background-image: linear-gradient(to right, "+clr+" 0%, "+clr+" 30px, rgba(0, 0, 0, 0) 31px, rgba(0, 0, 0, 0) 100%), url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAAAU0lEQVRIS2OcOXPmfwY84OzZs/ikGYyNjfHK49KfnJzMsH379uWMow4YDYHREBjwEEhLS8NbDpCbz2GFAy79Tk5ODEuXLl3OOOqA0RAYDYGBDgEA8g6qcfRT/m4AAAAASUVORK5CYII=\") !important; background-position: left top, left top !important; background-size: auto, 32px 16px !important; background-repeat: repeat-y, repeat-y !important; background-origin: padding-box, padding-box !important; padding-left: 40px !important;"
}

lang_button.onclick = function(){
    navbar.style.width = clicked ? "0px" : "60%";
    clicked = !clicked;
}

container.onclick = function(){
    hideNavBar();
}

fr_btn.onclick = function(){
    index = unityElement.selectedIndex;
    if(current_language != "fr"){
        navbar.style.width = "100%";
        current_language = "fr";
        chrome.storage.sync.set({'language': current_language});
        setTimeout(switchLang.bind(null, fr_params, fr_elements, en_elements, ar_elements, index), 500);
        setTimeout(initialize, 500);
    }
    else{
        hideNavBar();
    }
}

en_btn.onclick = function(){
    index = unityElement.selectedIndex;
    if(current_language != "en"){
        navbar.style.width = "100%";
        current_language = "en";
        chrome.storage.sync.set({'language': current_language});
        setTimeout(switchLang.bind(null, en_params, en_elements, fr_elements, ar_elements, index), 500);
        setTimeout(initialize, 500);
    }
    else{
        hideNavBar();
    }
}

ar_btn.onclick = function(){
    index = unityElement.selectedIndex;
    if(current_language != "ar"){
        navbar.style.width = "100%";
        current_language = "ar";
        chrome.storage.sync.set({'language': current_language});
        setTimeout(switchLang.bind(null, ar_params, ar_elements, fr_elements, en_elements, index), 500);
        setTimeout(initialize, 500);
    }
    else{
        hideNavBar();
    }
}

function switchLang(params, show, hide1, hide2, indx){
    budget_input.placeholder = params.placeholder;
	lang_button.innerText = params.lang;
    lang_button.style.fontSize = params.size;
    btn.style.fontSize = params.fontSize;
    resetBtn.style.fontSize = params.fontSize;
    flex_container.style["align-items"] = params.align;
    unity_da.innerText = params.option1;
    unity_mc.innerText = params.option2;
    showAll(show);
    hideAll(hide1);
    hideAll(hide2);
    unityElement.selectedIndex = indx;
    unityElement.style.direction = params.dir;
    hideNavBar();
}

function hideNavBar(){
    navbar.style.width = "0px";
    clicked = false;
}

function hideAll(elements){
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display = 'none';
    }
}

function showAll(elements){
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display = 'inline';
    }
}

function hideIntro(){
    intro_element.style.opacity = "0%";
    setTimeout(function(){
        intro_element.style.display = "none";
    }, 1000);
}