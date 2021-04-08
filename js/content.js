var budget = 0;
var isHide = false;
var isHideNull = false;
var color;
var prix;

window.addEventListener('load', function(){
    prix = document.querySelectorAll(".produit_prix");

    chrome.runtime.sendMessage({todo: "showPageAction"});

    chrome.storage.sync.get('budget', function(budgetTemp){
        if(budgetTemp.budget){
            budget = budgetTemp.budget;
            chrome.storage.sync.get('hide', function(hideTemp){
                if(hideTemp.hide){
                    isHide = hideTemp.hide;
                }
                chrome.storage.sync.get('hideNull', function(hideNullTemp){
                    if(hideNullTemp.hideNull){
                        isHideNull = hideNullTemp.hideNull;
                    }
                    chrome.storage.sync.get('color', function(colorTemp){
                        if(colorTemp.color){
                            color = colorTemp.color;
                        }
                        applyBudgetFunction(budget, isHide, isHideNull, color);
                    })
                })
            })
        }
    })
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "applyBudget") {
        budget = request.budget;
        isHide = request.hide;
        isHideNull = request.hideNull;
        color = request.color;
        applyBudgetFunction(budget, isHide, isHideNull, color);
    };
    if (request.todo == "resetBudget") {
        resetBudgetFunction();
    }
})

function applyBudgetFunction(value, hide, hideNull, clr){
    budget = value;
    isHide = hide;
    isHideNull = hideNull;
    color = clr;
    if(budget && budget > 0) {
    for(var i = 0; i < prix.length; i++) {
        prix[i].style.color = (parseFloat(prix[i].innerHTML) <= budget) ? color : '';
        prix[i].parentElement.parentElement.style.display = (parseFloat(prix[i].innerHTML) > budget && isHide) ? 'none' : '';
        prix[i].parentElement.parentElement.style.display = (prix[i].innerHTML.length == 0 && isHideNull) ? 'none' : prix[i].parentElement.parentElement.style.display ;
    }
    }
}

function resetBudgetFunction() {
    for(var i = 0; i < prix.length; i++) {
        prix[i].style.color = '';
        prix[i].parentElement.parentElement.style.display = '';
    }
}