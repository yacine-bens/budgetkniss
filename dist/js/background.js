"use strict";
// Disable Page Action on all tabs except for ouedkniss store tabs
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
// on browser open, backgound script is not executed directly => page action is not disabled
// add listener to window created to trigger the background script
chrome.windows.onCreated.addListener(() => { console.log('window created'); });
