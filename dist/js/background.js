"use strict";
// Page actions are disabled by default and enabled on select tabs
chrome.action.disable();
// Clear all rules to ensure only our expected rules are set
chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // Declare a rule to enable the action 
    let rule = {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { pathContains: '/store' },
            })
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
    };
    chrome.declarativeContent.onPageChanged.addRules([rule]);
});
chrome.windows.onCreated.addListener(() => { console.log('window created'); });
