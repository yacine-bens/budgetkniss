// Disable Page Action on all tabs
chrome.action.disable();

// Enable Page Action on ouedkniss
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.todo === 'showPageAction') {
        chrome.action.enable(sender.tab!.id);
    }
});