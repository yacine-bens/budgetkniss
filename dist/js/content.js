"use strict";
const DEFAULT_PREFS = {
    budget: 0,
    isHideOtherItems: false,
    isHideNoPriceItems: false,
    color: '#FFFF00'
};
const itemsContainerXpathExp = '//*[@id="AnnounBrowser-0"]/div/div[2]/div/div/div[2]/div[1]';
const itemsContainerObserver = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (document.evaluate(itemsContainerXpathExp, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength) {
                const prefs = await getPrefs();
                await applyBudget(prefs);
                return;
            }
        }
    }
});
itemsContainerObserver.observe(document.body, {
    childList: true,
    subtree: true
});
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.todo) {
        case 'applyBudget': {
            const prefs = await getPrefs();
            await applyBudget(prefs);
            break;
        }
        case 'resetBudget': {
            await applyBudget(DEFAULT_PREFS);
            break;
        }
    }
    // send empty response
    sendResponse({});
    return true;
});
const applyBudget = async ({ budget, isHideOtherItems, isHideNoPriceItems, color } = DEFAULT_PREFS) => {
    const priceItems = await getPriceItems();
    if (priceItems.length) {
        priceItems.forEach(item => {
            // get price element
            const priceElementXpathExp = './/span[@class[contains(., "price")]]/ancestor::div[1]';
            const priceElement = document.evaluate(priceElementXpathExp, item, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const priceValue = parseFloat(priceElement.innerText.replaceAll(' ', ''));
            if (priceValue <= budget) {
                priceElement.style.backgroundColor = color;
                item.style.display = '';
            }
            else {
                priceElement.style.backgroundColor = '';
                item.style.display = (isHideOtherItems) ? 'none' : '';
            }
        });
    }
    const noPriceItems = await getNoPriceItems();
    if (noPriceItems.length) {
        noPriceItems.forEach(item => {
            item.style.display = (isHideNoPriceItems) ? 'none' : '';
        });
    }
};
const getItemsContainer = async () => {
    const itemsContainerXpathExp = '//*[@id="AnnounBrowser-0"]/div/div[2]/div/div/div[2]/div[1]';
    const itemsContainerXpathResult = await waitForXPath(itemsContainerXpathExp, document, document.body);
    return itemsContainerXpathResult.snapshotItem(0);
};
const getPriceItems = async () => {
    const itemsContainer = await getItemsContainer();
    const priceItemsXpathExp = './/div/h2/ancestor::div[1][count(div) = 2]/ancestor::div[3]';
    const priceItemsXpathResult = await waitForXPath(priceItemsXpathExp, itemsContainer, itemsContainer);
    return Array.from({ length: priceItemsXpathResult.snapshotLength }, (_, i) => priceItemsXpathResult.snapshotItem(i));
};
const getNoPriceItems = async () => {
    const itemsContainer = await getItemsContainer();
    const noPriceItemsXpathExp = './/div/h2/ancestor::div[1][count(div) = 1]/ancestor::div[3]';
    const noPriceItemsXpathResult = await waitForXPath(noPriceItemsXpathExp, itemsContainer, itemsContainer);
    return Array.from({ length: noPriceItemsXpathResult.snapshotLength }, (_, i) => noPriceItemsXpathResult.snapshotItem(i));
};
const waitForXPath = async (xpathExpression, node, observedElement) => {
    return new Promise((resolve) => {
        if (document.evaluate(xpathExpression, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength) {
            return resolve(document.evaluate(xpathExpression, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
        }
        const observer = new MutationObserver((mutations) => {
            if (document.evaluate(xpathExpression, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength) {
                observer.disconnect();
                return resolve(document.evaluate(xpathExpression, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
            }
        });
        observer.observe(observedElement, {
            childList: true,
            subtree: true
        });
    });
};
const getPrefs = async () => {
    const prefs = await chrome.storage.local.get(['budget', 'isHideOtherItems', 'isHideNoPriceItems', 'color']);
    return {
        budget: prefs.budget || DEFAULT_PREFS.budget,
        isHideOtherItems: prefs.isHideOtherItems || DEFAULT_PREFS.isHideOtherItems,
        isHideNoPriceItems: prefs.isHideNoPriceItems || DEFAULT_PREFS.isHideNoPriceItems,
        color: prefs.color || DEFAULT_PREFS.color
    };
};
