var lang_button = document.querySelector('#lang_button');
var navbar = document.querySelector('#navbar');
var container = document.querySelector('#flex-container');
var fr_btn = document.querySelector('#fr_btn');
var en_btn = document.querySelector('#en_btn');
var ar_btn = document.querySelector('#ar_btn');
var current_language = "fr";
var fr_elements = document.querySelectorAll(".fr");
var en_elements = document.querySelectorAll(".en");
var ar_elements = document.querySelectorAll(".ar");
var unity_element = document.querySelector('#unity');
var unity_da = document.querySelector('option[value="da"]');
var unity_mc = document.querySelector('option[value="mc"]');
var index = 0;

var flex_container = document.querySelector('#flex-container');

var budget_input = document.querySelector('#budget');
var clicked = false;
navbar.style.width = "0px";

lang_button.onclick = function(){
    navbar.style.width = clicked ? "0px" : "60%";
    clicked = !clicked;
}

container.onclick = function(){
    hideNavBar();
}

fr_btn.onclick = function(){
    index = unity_element.selectedIndex;
    if(current_language != "fr"){
        navbar.style.width = "100%";
        setTimeout(anim.bind(null, "Entrer votre budget", "Dinar", "Million Centime", "La langue", "20px", fr_elements, en_elements, ar_elements, "flex-start", index), 500);
        current_language = "fr";
    }
    else{
        hideNavBar();
    }
}
en_btn.onclick = function(){
    index = unity_element.selectedIndex;
    if(current_language != "en"){
        navbar.style.width = "100%";
        setTimeout(anim.bind(null, "Enter your budget", "Dinar", "Million Cent", "Language", "20px", en_elements, fr_elements, ar_elements, "flex-start", index), 500);
        current_language = "en";
    }
    else{
        hideNavBar();
    }
}
ar_btn.onclick = function(){
    index = unity_element.selectedIndex;
    if(current_language != "ar"){
        let placeholder = "أدخل ميزانيتك";
		let lang = "اللغة";
        let size = "22px";
        let align = "flex-end";
        let option1 = "دينار";
        let option2 = "مليون سنتيم";
        navbar.style.width = "100%";
        setTimeout(anim.bind(null, placeholder, option1, option2, lang, size, ar_elements, fr_elements, en_elements, align, index), 500);
        current_language = "ar";
    }
    else{
        hideNavBar();
    }
}

function anim(placeholder, op1, op2, lang, size, show, hide1, hide2, align, indx){
    budget_input.placeholder = placeholder;
	lang_button.innerText = lang;
    lang_button.style.fontSize = size;
    flex_container.style["align-items"] = align;
    unity_element.selectedIndex = indx;
    unity_da.innerText = op1;
    unity_mc.innerText = op2;
    hideNavBar();
    showAll(show);
    hideAll(hide1);
    hideAll(hide2);
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