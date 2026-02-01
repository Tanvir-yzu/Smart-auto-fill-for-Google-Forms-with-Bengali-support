// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('AutoFill Pro installed');
    
    // Set default settings
    chrome.storage.local.set({
        settings: {
            highlightFields: true,
            animate: true
        }
    });
    
    // Create context menu for quick fill
    chrome.contextMenus.create({
        id: 'quickFill',
        title: 'Quick Fill Form',
        contexts: ['page'],
        documentUrlPatterns: ['https://docs.google.com/forms/*']
    }, () => {
        if (chrome.runtime.lastError) {
            console.log('Context menu may already exist');
        }
    });
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'quickFill') {
        chrome.storage.local.get(['savedData'], (result) => {
            if (result.savedData) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (data) => {
                        window.postMessage({
                            type: 'AUTOFILL_QUICK_FILL',
                            data: data
                        }, '*');
                    },
                    args: [result.savedData]
                });
            }
        });
    }
});

// Handle form detection messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'formDetected') {
        console.log('Form detected:', request.title);
    }
    return true;
});